import { orderInfo, userModel } from "../db/index";

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
    return this.orderModel.findByObjectId(id)
  }

  async connectOrderAndInfo(email, id){
    const user = await this.userModel.findByEmail(email)
    const order = await this.orderModel.findByObjectId(id)
    const res = await userModel.appendOrder(email, order)
    //return 반영된 결과
    return res

  }
  async updateInfo(orderId, info){
    const order = await this.orderModel.findByObjectId(orderId)
    if(!order) {
      throw new Error('등록된 상품이 없습니다.');
    }
    const result = await this.orderModel.updateByObjectId(orderId, info);
    return result;
  }


}
// 싱글톤
const orderInfoService = new OrderinfoService(orderInfo, userModel)

export { orderInfoService }
