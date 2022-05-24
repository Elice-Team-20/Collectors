import { Router } from 'express';
import upload from '../db/models/s3-model';
import { itemService } from '../services/item-service';

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
  res.json({sucsess: resultData});
})

itemRouter.get('/:id', async(req, res) => {
  const {id} = req.params;
  const itemData = await itemService.getItembyObId(id)
  res.json(itemData);
})

// 로그인 인증 넣어야한가?
// submit 할때 같이 올려야함 따로 떨어지면안됨
itemRouter.post('/img/:imgName', upload.single('file'),function(req,res){
  res.json({message: "성공"});
})

export {itemRouter};
