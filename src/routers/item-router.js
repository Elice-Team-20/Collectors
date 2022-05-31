import { Router } from 'express';
import { itemService } from '../services';
import { adminRequired, loginRequired, upload } from '../middlewares/index';

const itemRouter = Router();

// 아이탬을 생성하는 라우터
itemRouter.get('/', async (req, res) => {
  const item = await itemService.getItems();
  res.json({ item });
});

// 매진임박인 아이템(5개 이하)을 조회하는 라우터
itemRouter.get('/soldOut', async (req, res, next) => {
  try{
    const items = await itemService.getSoldOutImminentItems();
    res.json(items);
  }catch(error){
    next(error);
  }
})

// s3 에 이미지 업로드후 req 에 링크 넣고 아이템 db에 등록
itemRouter.post('/', upload.single('file'), async (req, res) => {
  const {
    itemName,
    category,
    manufacturingCompany,
    summary,
    mainExplanation,
    stocks,
    hashTag,
    price,
  } = req.body;

  const formData = {
    itemName,
    category,
    manufacturingCompany,
    summary,
    mainExplanation,
    imgUrl: req.file.location,
    stocks,
    price,
    hashTag,
  };
  const resultData = await itemService.addItem(formData);
  res.json({ status: 'ok', sucsess: resultData });
});

itemRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const itemData = await itemService.getItembyObId(id);
  res.json(itemData);
});

// GET api/item/category/:category
// 파라미터로 받은 category값으로 상품 조회
itemRouter.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const itemData = await itemService.getItemsByCategory(category);
  res.json(itemData);
});

// DELETE api/item/delete/:id
// 아이템 삭제 - 관리자 권한 필요. 로그인 되어있는지 검사 후 관리자 계정인지 확인
itemRouter.delete(
  '/delete/:id',
  loginRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await itemService.deleteItem(id);
      console.log(result);
      res.json({ status: 'ok', result: `${result.itemName} 삭제` });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/update/:id
// 아이템 수정 - 관리자 권한 필요.
itemRouter.post(
  '/update/:id',
  loginRequired,
  adminRequired,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const info = req.body;
      const result = await itemService.updateItem(id, info);
      // 추후 헤더 수정
      res.json({ status: 'ok', result: result });
    } catch (error) {
      next(error);
    }
  },
);

export { itemRouter };
