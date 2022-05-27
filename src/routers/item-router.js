import { Router } from 'express';
import upload from '../db/models/s3-model';
import { itemService } from '../services';
import { adminRequired, loginRequired } from '../middlewares' ;


const itemRouter = Router();

itemRouter.get('/', async (req, res) => {
  const item = await itemService.getItems()
  res.json({item});
})

itemRouter.post('/', upload.single('file'), async(req,res)=>{
  const {
  itemName,
  category,
  manufacturingCompany,
  summary,
  mainExplanation
  ,stocks,hashTag,price} = req.body;

  const formData = {
    itemName: itemName ,
    category: category,
    manufacturingCompany: manufacturingCompany,
    summary: summary,
    mainExplanation: mainExplanation,
    imgUrl: req.file.location,
    stocks: stocks,
    price: price,
    hashTag: hashTag,
  }
  const resultData = await itemService.addItem(formData)
  res.json({status: "ok", sucsess: resultData});
})

itemRouter.get('/:id', async(req, res) => {
  const {id} = req.params;
  const itemData = await itemService.getItembyObId(id)
  res.json(itemData);
})

itemRouter.get('/category/:category', async(req, res) => {
  const {category} = req.params;
  console.log(category)
  const itemData = await itemService.getItemsByCategory(category);
  res.json(itemData);
})

// 로그인 인증 넣어야한가?
// submit 할때 같이 올려야함 따로 떨어지면안됨
// itemRouter.post('/img/:imgName', upload.single('file'),function(req,res){
//   res.json({message: "성공"});
// })

//관리자 계정이어야 할듯
itemRouter.delete('/delete/:id', loginRequired, adminRequired, async (req, res, next) => {
  try{
    const { id } = req.params;
    const result = itemService.deleteItem(id);
    res.json({status: "ok" ,result: result});
  }catch(error){
    next(error);
  }
})

itemRouter.post('/update/:id', loginRequired, adminRequired, async (req, res, next) => {
  try{
    const { id } = req.params;
    const info = req.body;
    const result = itemService.updateItem(id, info);
    // 추후 헤더 수정
    res.json({status: 'ok', result: result});
  }catch(error){
    next(error);
  }
})

export {itemRouter};

//SyntaxError: /home/mj/projects/pet_shop/src/routers/item-router.js: `itemRouter` has already been exported. Exported identifiers must be unique. (72:9)
