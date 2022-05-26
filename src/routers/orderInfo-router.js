import {Router} from 'express';
import {orderInfoService} from './../services/index'
const orderInfoRouter = Router();

orderInfoRouter.post('/', (req, res) => {
<<<<<<< HEAD
	const {shipAddress, totalCost, recipientName, recipientPhone} = req.body;
	const inputOrderData = {
		shipAddress: shipAddress,
		totalCost: totalCost,
		recipientName: recipientName,
		recipientPhone: recipientPhone,
	}
	res.json(orderInfoService.addOrderInfo(inputOrderData))
=======

	res.send(orderInfoService.addOrderInfo())
>>>>>>> orderInfo라우터 생성
})

export {orderInfoRouter}
