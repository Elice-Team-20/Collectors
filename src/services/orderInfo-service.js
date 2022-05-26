import { orderInfo } from "../db/index";

class OrderinfoService {
  constructor(inputOrderInfoModel){
    this.orderModel = inputOrderInfoModel;
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


}
// 싱글톤
const orderInfoService = new OrderinfoService(orderInfo)

export { orderInfoService }
