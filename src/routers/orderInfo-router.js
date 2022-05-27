import {Router} from 'express';
import {orderInfoService} from './../services/index'
const orderInfoRouter = Router();

orderInfoRouter.post('/', (req, res) => {
	const {shipAddress, totalCost, recipientName, recipientPhone} = req.body;
	const inputOrderData = {
		shipAddress: shipAddress,
		totalCost: totalCost,
		recipientName: recipientName,
		recipientPhone: recipientPhone,
	}
	res.json(orderInfoService.addOrderInfo(inputOrderData))
})

export {orderInfoRouter}
