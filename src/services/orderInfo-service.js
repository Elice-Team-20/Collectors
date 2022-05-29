import { orderInfo, userModel } from "../db/index";

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

  async getOrderInfo(){
    return this.orderModel.findAll();
  }

  async getOrderInfoById(id){
    if(checkData(id)){
      return this.orderModel.findByObjectId(id);
    }
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
      const address = await this.orderModel.findByObjectId(orderId);
      const { postalCode, address1, address2 } = address.shipAddress;
      // 가져온 주문정보 의 주소를 user 정보에 업데이트 시킵니다.
      const updateAdddressRes = await this.userModel.update({
         userId: userId,
         update:{
           address:
        {
          postalCode:postalCode,
          address1: address1,
          address2: address2
         }
       }
     });
      return updateAdddressRes;
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
