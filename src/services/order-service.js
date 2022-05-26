import { orderModel } from "../db/index";

class OrderinfoService {
  constructor(orderModel){
    this.orderModel = orderModel;
  }

  test(){
    console.log(this.orderModel)
  }
  // 피드백 받은 코드 반영
  // async addOrderInfo(orderInfo){
  //   return this.orderModel.crate(orderInfo)
  // }



}
// 싱글톤
const orderInfoService = new OrderinfoService(orderModel)
orderInfoService.test()
export {orderinfoService}
