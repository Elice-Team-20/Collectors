import { Router } from 'express';
import { orderInfoService } from './../services/index'
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

orderInfoRouter.get('/', async(req, res) => {
  res.json(await orderInfoService.getOrderInfo());
})

orderInfoRouter.get('/:id', async(req, res) => {
  const {id} = req.params;
  res.json(await orderInfoService.getOrderInfoById(id));
})

// 주문 중복 해결해야함
orderInfoRouter.post('/makeOrder', async(req, res) => {
  const {email, orderId} = req.body;
  //res.json({email:email, orderid: orderId})
  console.log(orderId)
  res.json(await orderInfoService.connectOrderAndInfo(email, orderId));
})

//주문정보 업데이트 이거 body 에 담아야하나?
orderInfoRouter.post('/update', async(req, res) => {
  const {orderId, updateInfo} = req.body;
  try{
    res.json(await orderInfoService.updateInfo(orderId, updateInfo))
  }
  catch(er){
    return er
  }
})

orderInfoRouter.delete('/delete', async(req, res) => {
  const {orderId} = req.body;
  const deleteResult = await orderInfoService.deleteInfo(orderId);
  res.json({deleteResult})
})


export { orderInfoRouter };
