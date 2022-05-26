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
  res.json( await orderInfoService.getOrderInfo());
})

orderInfoRouter.get('/:id', async(req, res) => {
  const {id} = req.params
  res.json( await orderInfoService.getOrderInfoById(id));
})


export {orderInfoRouter};
