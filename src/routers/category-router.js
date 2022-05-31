import { Router } from 'express';
import { categoryService } from '../services';

// 경로 : api/category
const categoryRouter = Router();

// GET api/category
// 전체 카테고리들 리턴
categoryRouter.get('/', async (req, res, next) => {
  try{
    const categories = await categoryService.getCategories();
    res.json(categories);
  }catch(error) {
    next(error);
  }
})

// GET api/category
// body에 저장된 categoryName으로 검사 
// 이미 카테고리가 데이터베이스에 저장되어있을 경우 reject, 없을 경우 카테고리 추가
categoryRouter.post('/', async (req, res, next) => {
  try{
    const {categoryName} = req.body;
    const newCategory = await categoryService.addCategory(categoryName);

    res.json(newCategory);
  }catch(error){
    next(error);
  }
})

// DELETE api/category
// body로 받아온 카테고리 삭제
categoryRouter.delete('/', async (req, res, next) => {
  try{
    const {categoryName} = req.body;
    const deletedCategory = await categoryService.deleteCategory(categoryName);
    res.json(deletedCategory);
  }catch(error){
    next(error);
  }
})

// POST api/category/:name
// 파라미터로 받은 name으로 검색하고, 해당 카테고리명을 body로 받은 값으로 수정
categoryRouter.post('/:oldName', async (req, res, next) => {
  try{
    const {oldName} = req.params;
    const {newCategoryName} = req.body;
    
    const updatedCategory = await categoryService.updateCategory(oldName, newCategoryName);
    res.json(updatedCategory);
  }catch(error){
    next(error);
  }
})

export {categoryRouter};
