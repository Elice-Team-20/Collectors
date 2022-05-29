import { Router } from 'express';
import { orderInfoService } from './../services/index'
import {loginRequired} from './../middlewares/index'
const orderInfoRouter = Router();

orderInfoRouter.post('/', async(req, res) => {
  const {
          address1,
          address2,
          postalCode,
          totalCost,
          recipientName,
          recipientPhone
        } = req.body;

  const address = {
    postalCode: postalCode,
    address1: address1,
    address2: address2,
  };

  const inputOrderData = {
    totalCost: totalCost,
    recipientName: recipientName,
    recipientPhone: recipientPhone,
    shipAddress: address,
  };

  res.json(await orderInfoService.addOrderInfo(inputOrderData));
})

//db 에 등록된 주문 목록 전체를 조회하는 api
orderInfoRouter.get('/', loginRequired, async(req, res) => {
  res.json(await orderInfoService.getOrderInfo());
})

// 주문id 로 주문을 조회하는 api
orderInfoRouter.get('/:id', loginRequired, async(req, res) => {
  const {id} = req.params;
  res.json(await orderInfoService.getOrderInfoById(id));
})

// 결제를 누르면 주문 목록이 해당 유저에게 할당시키는 api
orderInfoRouter.post('/makeOrder',loginRequired, async(req, res) => {
  const {email, orderId} = req.body;
  //res.json({email:email, orderid: orderId})
  res.json(await orderInfoService.connectOrderAndInfo(email, orderId));
})

//주문정보 업데이트
orderInfoRouter.post('/update', loginRequired, async(req, res) => {
  const {orderId, updateInfo} = req.body;
  try{
    res.json(await orderInfoService.updateInfo(orderId, updateInfo))
  }
  catch(er){
    return er
  }
})

// 주문 목록을 지우는 api
orderInfoRouter.delete('/delete', loginRequired, async(req, res) => {
  const {orderId} = req.body;
  const deleteResult = await orderInfoService.deleteInfo(orderId);
  res.json({deleteResult});
})



export { orderInfoRouter };
