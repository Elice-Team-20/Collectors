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
    return this.orderModel.findAll()
  }

  async getOrderInfoById(id){
    if(checkData(id)){
      return this.orderModel.findByObjectId(id);
    }
  }

  async connectOrderAndInfo(email, id){
    try{
      const user = await this.userModel.findByEmail(email)
      const order = await this.orderModel.findByObjectId(id)
      const res = await userModel.appendOrder(email, order)
      return res
    }
    catch(er){
      return er
    }
    //return 반영된 결과

  }
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
