import { orderInfo } from "../db/index";

class OrderinfoService {
  constructor(inputOrderInfoModel){
    this.orderModel = inputOrderInfoModel;
  }

  async addOrderInfo(orderData){
    return this.orderModel.create(orderData)
  };

  async getOrderInfo(){
    return await this.orderModel.findAll()
  }


}
// 싱글톤
const orderInfoService = new OrderinfoService(orderInfo)

export { orderInfoService }
