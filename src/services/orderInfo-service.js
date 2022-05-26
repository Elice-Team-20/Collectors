import { orderInfo } from "../db/index";

class OrderinfoService {
  constructor(inputOrderInfoModel){
    this.orderModel = inputOrderInfoModel;
  }

  async addOrderInfo(){
    console.log(this.orderModel.create)
  }
  // 피드백 받은 코드 반영
  // async addOrderInfo(orderInfo){
  //   return this.orderModel.crate(orderInfo)
  // }



}
// 싱글톤
const orderInfoService = new OrderinfoService(orderInfo)
orderInfoService.test()
export {orderInfoService}
