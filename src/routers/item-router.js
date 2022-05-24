import { Router } from 'express';
import {itemService} from '../services/item-service';

const itemRouter = Router();

itemRouter.get('/', (req, res) => {
  res.send("ok");
})

//관리자 계정이어야 할듯
itemRouter.delete('/delete/:id', (req, res) => {
  try{
    const { id } = req.params;
    const result = itemService.deleteItem(id);
    res.json({result: 'ok'});
  }catch(error){
    next(error);
  }
})

itemRouter.post('/update/:id', (req, res) => {
  try{
    const { id } = req.params;
    const info = req.body;
    const result = itemService.updateItem(id, info);
    res.json({result: 'ok'});
  }catch(error){
    next(error);
  }
})

// itemRouter.delete()
export { itemRouter };
