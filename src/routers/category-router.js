import { Router } from 'express';
import { categoryService } from '../services';

const categoryRouter = Router();

// 전체 카테고리들 리턴
categoryRouter.get('/', async (req, res, next) => {
  try{
    const categories = await categoryService.getCategories();
    res.json(categories);
  }catch(error) {
    next(error);
  }
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

categoryRouter.delete('/', async (req, res, next) => {
  try{
    const {categoryName} = req.body;
    const deletedCategory = await categoryService.deleteCategory(categoryName);
    res.json(deletedCategory);
  }catch(error){
    next(error);
  }
})

categoryRouter.post('/:name', async (req, res, next) => {
  try{
    const newCategoryName = req.params.name;
    const {categoryName} = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryName, newCategoryName);
    res.json(updatedCategory);
  }catch(error){
    next(error);
  }
})

export {categoryRouter};
