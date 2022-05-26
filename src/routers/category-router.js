import { Router } from 'express';
import { categoryService } from '../services';

const categoryRouter = Router();

categoryRouter.get('/', async (req, res) => {
  const categories = await categoryService.getCategories();
  res.json(categories);
})

categoryRouter.post('/', async (req, res, next) => {
  try{
    const {categoryName} = req.body;
    const newCategory = await categoryService.addCategory(categoryName);

    res.json(newCategory);
  }catch(error){
    next(error);
  }
})

export {categoryRouter};
