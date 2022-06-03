import { orderInfo, userModel, itemModel } from '../db/index';
import { getDate, setRole } from '../utils';
import { itemService } from './index';
import { userService } from './user-service';

const checkData = async function (orderId) {
  return (await orderInfo.findByObjectId(orderId)) ? true : false;
};
class OrderinfoService {
  constructor(inputOrderInfoModel, inputUserModel) {
    this.orderModel = inputOrderInfoModel;
    this.userModel = inputUserModel;
  }

  async addOrderInfo(orderData) {
    return this.orderModel.create(orderData);
  }

  // 전체 주문 조회
  // 필요한 데이터만 전달하도록 필터링 역할을 하는 함수입니다.
  // 이 부분을 효율적으로 보완하고 싶은데, 좋은 방법 있다면 알려주시면 감사하겠습니다.
  async getOrderInfo() {
    let orders = await this.orderModel.findAll();
    const array = [];

    // orderList가 최신순으로 보이도록 작성
    for (let i = orders.length - 1; i >= 0; i--) {
      const temp = {};
      temp._id = orders[i]._id;

      const date = new Date(orders[i].createdAt);
      temp.orderDate = getDate(date);

      temp.itemList = orders[i].itemList;

      temp.status = orders[i].status;

      temp.shipAddress = orders[i].shipAddress;

      temp.totalCost = orders[i].totalCost;

      temp.recipientName = orders[i].recipientName;

      temp.recipientPhone = orders[i].recipientPhone;
      array.push(temp);
    }
    return array;
  }

  // 아이디별 조회
  async getOrderInfoById(id) {
    if (checkData(id)) {
      return this.orderModel.findByObjectId(id);
    }
  }

  // 이 부분도 마찬가지로 필요한 데이터만 전달하도록 필터링하는 함수입니다.
  // 개선점을 찾아주시면 감사하겠습니다..!
  async getOrderList(orderInfo) {
    const array = [];
    for (let i = orderInfo.length - 1; i >= 0; i--) {
      const temp = {};
      temp.orderId = orderInfo[i].id;

      const date = new Date(orderInfo[i].createdAt);

      // getDate : 2022-06-01T10:32:44.903+00:00 형식의 날짜 데이터를 YYYY-MM-DD로 변경하는 함수
      temp.orderDate = getDate(date);

      const itemList = await this.idToOrderName(orderInfo[i].itemList);
      temp.itemList = itemList;

      temp.status = orderInfo[i].status;

      array.push(temp);
    }
    return array;
  }

  // id로 저장된 부분을 이름으로 치환
  async idToOrderName(orderList) {
    const array = [];

    for (let i = 0; i < orderList.length; i++) {
      const res = await itemModel.findById(orderList[i].itemId);
      array.push({ itemName: res.itemName, count: orderList[i].count });
    }
    return array;
  }

  // 1. 받은 정보를 기반으로 주문 정보를 만듦
  // 2. 받은 정보를 기반으로 유져 정보 변경(최신화)
  async connectOrderAndDecreaseStock(userId, orderId) {
    try {
      //const order = await this.orderModel.findByObjectId(id);
      //const orderId = order._id;
      // 주문 정보를 조회해서 데이터 가져옴 ( 정보를  매개변수로 받은걸 그대로 쓸수 있지만
      // db에 number 와 String 차이처럼 저장되는게 다를수도 모른다는 생각을 했습니다)
      const DBorderData = await this.orderModel.findByObjectId({
        _id: orderId,
      });
      // user 와 생성된 orderInfo 연결
      await this.userModel.appendOrder(userId, DBorderData);
      // 마찬가지로 주문정보 db에서 주소정보를 가져왔습니다.
      const createdOrder = await this.orderModel.findByObjectId(orderId);
      const { postalCode, address1, address2 } = createdOrder.shipAddress;
      const phoneNumber = createdOrder.recipientPhone;
      // 가져온 주문정보 의 주소를 user 정보에 업데이트 시킵니다.
      const result = await this.userModel.update({
        userId,
        update: {
          address: {
            postalCode,
            address1,
            address2,
          },
          phoneNumber,
        },
      });
      const itemList = createdOrder.itemList;
      itemList.forEach(async (e) => {
        try {
          const currItem = await itemService.getItembyObId(e.itemId);
          const inputItemCount = e.count;
          const changeStock = currItem.stocks - inputItemCount;
          if (changeStock < 0) {
            return;
          }
          const updateReturn = await itemService.updateItem(
            { _id: e.itemId },
            { stocks: changeStock },
          );
        } catch (er) {
          throw new Error(er);
        }
      });
      const populateRes = await this.userModel.getUserAndPopulate(userId);
      return populateRes;
    } catch (er) {
      return er;
    }
  }

  async checkStock(orderInfo) {
    try {
      //const orderId = newOrderInfo._id.toString();
      //const createdOrder = await this.orderModel.findByObjectId(orderId);
      const itemList = orderInfo.itemList;
      const boolList = await Promise.all(
        itemList.map(async (e) => {
          const currItem = await itemService.getItembyObId(e.itemId);
          const inputItemCount = e.count;
          const changeStock = await (currItem.stocks - inputItemCount);
          return changeStock < 0;
        }),
      );

      return boolList;
    } catch (er) {
      return er;
    }
  }

  // 배송이 완료되면 상태를 '배송 완료'로 바꾸고 누적cost를 업데이트
  async updateInfo(orderId, info) {
    if (checkData(orderId)) {
      const order = await this.orderModel.findByObjectId(orderId);
      const user = await userService.findByOrderId(orderId);
      const updateCost = order.totalCost + user.accumulatedTotalCost;

      // update된 cost 비용으로 role 설정
      const newRole = setRole(updateCost);

      const updatedOrder = await this.orderModel.updateByObjectId(
        orderId,
        info,
      );
      const updatedUser = await userService.updateUserInfo(user.id, {
        accumulatedTotalCost: updateCost,
        role: newRole,
      });

      return updatedOrder;
    }
    return new Error('등록된 상품이 없습니다.');
  }

  async deleteInfo(orderId) {
    const deleteResult = await this.orderModel.deleteByObjectId(orderId);
    if (deleteResult.deletedCount == 0) {
      return new Error(' 지워진 데이터가 없습니다 아이디를 확인하세요');
    } else {
      return deleteResult;
    }
  }

  // 취소한 갯수만큼 아이탬 수량 증가하는 함수
  async addStock(orderId) {
    // 현재 아이탬  수량 긁어오기
    const currentOrder = await this.getOrderInfoById(orderId);
    const orderItemList = currentOrder.itemList;
    orderItemList.forEach(async (data) => {
      // 들어온 주문정보에서 수량 긁어오고 마이너스 계산
      const itemInfo = await itemService.getItembyObId(data.itemId);
      const updateStock = itemInfo.stocks + data.count;
      // 수량정보 갱신하기
      const result = await itemService.updateItem(
        { _id: data.itemId },
        { stocks: updateStock },
      );
    });
  }

  async addStat(orderId) {
    try {
      const order = await orderInfo.findByObjectId(orderId);
      const itemList = order.itemList;
      await Promise.all([
        itemList.forEach(async (e) => {
          const itemData = await itemService.getItembyObId(e.itemId);
          const userId = await userService.findByOrderId(orderId);
          const userInfo = await userService.getUser(userId);
          const count = e.count;
          let updateData;
          if (itemData.category === '장비') {
            updateData = {
              equipment: parseInt(count + userInfo.stat.equipment),
            };
          } else if (itemData.category === '초능력') {
            updateData = { psychic: parseInt(count + userInfo.stat.psychic) };
          } else if (itemData.category === '마법') {
            updateData = {
              magic: parseInt(count + userInfo.stat.magic),
            };
          } else if (itemData.category === '지능') {
            updateData = {
              intelligence: parseInt(count + userInfo.stat.intelligence),
            };
          } else {
            updateData = false;
          }
          if (updateData) {
            const insertData = { stat: updateData };
            const updateResult = await userService.updateUserInfo(
              userId,
              insertData,
            );
            //console.log(updateResult);
          }
        }),
      ]);
      return { succsess: 'ok' };
    } catch (er) {
      return er;
    }
  }
}
// 싱글톤
const orderInfoService = new OrderinfoService(orderInfo, userModel);

export { orderInfoService };
