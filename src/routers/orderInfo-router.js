import {Router} from 'express';
import {orderInfoService} from './../services/index'
const orderInfoRouter = Router();

orderInfoRouter.post('/', (req, res) => {

	res.send(orderInfoService.addOrderInfo())
})

export {orderInfoRouter}
