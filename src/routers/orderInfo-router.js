import { Router } from 'express';
import { orderInfoService, userService } from './../services/index';
import { loginRequired, adminRequired } from './../middlewares/index';
const orderInfoRouter = Router();

orderInfoRouter.post('/', async (req, res) => {
  try {
    const {
      itemList,
      address1,
      address2,
      postalCode,
      totalCost,
      recipientName,
      recipientPhone,
      shipRequest,
    } = req.body;
    const address = {
      postalCode: postalCode,
      address1: address1,
      address2: address2,
    };

    const inputOrderData = {
      itemList: itemList,
      totalCost: totalCost,
      recipientName: recipientName,
      recipientPhone: recipientPhone,
      shipAddress: address,
      shipRequest: shipRequest,
    };

    res.json(await orderInfoService.addOrderInfo(inputOrderData));
  } catch (error) {
    next(error);
  }
});

// db 에 등록된 주문 목록 전체를 조회하는 api
// 관리자 권한이 필요.
orderInfoRouter.get(
  '/',
  loginRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      res.json(await orderInfoService.getOrderInfo());
    } catch (error) {
      next(error);
    }
  }
);

// api/order/list
// 로그인한 유저의 주문내역을 반환
orderInfoRouter.get('/list', loginRequired, async (req, res) => {
  const userId = req.currentUserId;
  const userInfo = await userService.getUser(userId);

  const result = await orderInfoService.getOrderList(userInfo.orderInfo);

  res.json(result);
});

// 주문id 로 주문을 조회하는 api
orderInfoRouter.get('/:id', loginRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await orderInfoService.getOrderInfoById(id));
  } catch (error) {
    next(error);
  }
});

// 결제를 누르면 주문 목록이 해당 유저에게 할당시키는 api
orderInfoRouter.post('/makeOrder', loginRequired, async (req, res, next) => {
  try {
    const { userId, orderInfo } = req.body;
    res.json(await orderInfoService.connectOrderAndInfo(userId, orderInfo));
  } catch (error) {
    next(error);
  }
});

//주문정보 업데이트
orderInfoRouter.post('/update', loginRequired, async (req, res, next) => {
  const { orderId, updateInfo } = req.body;
  try {
    res.json(await orderInfoService.updateInfo(orderId, updateInfo));
  } catch (error) {
    next(error);
  }
});

// 회원 전용 : 주문 목록을 지우는 api
orderInfoRouter.delete('/delete', loginRequired, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const deleteResult = await orderInfoService.deleteInfo(orderId);
    res.json({ deleteResult });
  } catch (error) {
    next(error);
  }
});

// 관리자 전용: 주문 전체를 조회할 수 있고, 삭제가 가능.
orderInfoRouter.delete(
  '/admin/delete',
  loginRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const deletedResult = await orderInfoService.deleteInfo(orderId);
      res.json({ deletedResult });
    } catch (error) {
      next(error);
    }
  }
);

export { orderInfoRouter };
