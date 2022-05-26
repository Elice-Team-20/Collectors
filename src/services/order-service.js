import { orderModel } from "../db";

class OrderinfoService {
  constructor(orderModel){
    this.orderModel = orderModel
  }

  async addOrderInfo(orderInfo){
    const item = await this.orderModel.addOrderInfo(orderInfo)
    return item
  }


  async getOrderInfo()
}
