import { orderInfo, userModel, itemModel } from "../db/index";
import { getDate } from '../utils/get-date';

const checkData = async function(orderId){
  return await orderInfo.findByObjectId(orderId) ? true: false;
}
class OrderinfoService {
  constructor(inputOrderInfoModel, inputUserModel){
    this.orderModel = inputOrderInfoModel;
    this.userModel = inputUserModel;
  }

  async addOrderInfo(orderData){
    return this.orderModel.create(orderData)
  };

  // 전체 주문 조회
  async getOrderInfo(){
    return this.orderModel.findAll();
  }

  // 아이디별 조회
  async getOrderInfoById(id){
    if(checkData(id)){
      return this.orderModel.findByObjectId(id);
    }
  }

  async getOrderList(orderInfo){
    const array = [];
    console.log(orderInfo)
    for(let i = 0 ; i < orderInfo.length; i++){
      const temp = {};
      temp.orderId = orderInfo[i].id;

      const date = new Date(orderInfo[i].createdAt);
      temp.orderDate = getDate(date);

      const itemList = await this.idToOrderName(orderInfo[i].itemList);
      temp.itemList = itemList;

      temp.status = orderInfo[i].status;

      array.push(temp);
    }
    return array;
  }

  async idToOrderName(orderList) {
    const array = [];

    for(let i = 0 ; i < orderList.length; i++){
      const res = await itemModel.findById(orderList[i].itemId);
      array.push({"itemName": res.itemName, "count": orderList[i].count});
    }
    return array;
  }

  // 1. 받은 정보를 기반으로 주문 정보를 만듦
  // 2. 받은 정보를 기반으로 유져 정보 변경(최신화)
  async connectOrderAndInfo(userId, orderInfo){
    try{
     // const order = await this.orderModel.findByObjectId(id);

     // 새로운 주문 정보를 만듦
      const newOrderInfo = await this.orderModel.create(orderInfo)
      // 주문 정보로 부터 아이디 획득
      const orderId = newOrderInfo._id.toString()
      // 주문 정보를 조회해서 데이터 가져옴 ( 정보를  매개변수로 받은걸 그대로 쓸수 있지만
      // db에 number 와 String 차이처럼 저장되는게 다를수도 모른다는 생각을 했습니다)
      const DBorderData = await this.orderModel.findByObjectId({_id: orderId})
      // user 와 생성된 orderInfo 연결
      await this.userModel.appendOrder(userId, DBorderData);
      // 마찬가지로 주문정보 db에서 주소정보를 가져왔습니다.
      const createdOrder = await this.orderModel.findByObjectId(orderId);
      const { postalCode, address1, address2 } = createdOrder.shipAddress;
      const phoneNumber = createdOrder.recipientPhone;
      // 가져온 주문정보 의 주소를 user 정보에 업데이트 시킵니다.
      const result = await this.userModel.update({
          userId,
          update:{
            address:
            {
            postalCode,
            address1,
            address2
            },
          phoneNumber
       }
     });
     const populateRes = await this.userModel.getUserAndPopulate(userId);
      return populateRes;
    }
    catch(er){
      return er
    };

  };
  async updateInfo(orderId, info){
    const order = await this.orderModel.findByObjectId(orderId)
    if(checkData(orderId)) {
      const result = await this.orderModel.updateByObjectId(orderId, info);
      return result;
    }
    return new Error('등록된 상품이 없습니다.');
  }

  async deleteInfo(orderId){
    const deleteResult = await this.orderModel.deleteByObjectId(orderId)
    if(deleteResult.deletedCount == 0){
      return new Error(" 지워진 데이터가 없습니다 아이디를 확인하세요")
    }
    else{
      return deleteResult;
    }
  }


}
// 싱글톤
const orderInfoService = new OrderinfoService(orderInfo, userModel);

export { orderInfoService }
