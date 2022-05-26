import { categoryModel } from '../db';

class CategoryService {
  
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  async addCategory(categoryName){
    const findCategory = await this.categoryModel.findByName(categoryName);

    if(findCategory){
      throw new Error('카테고리가 이미 존재합니다. 다른 카테고리를 추가해주세요.');
    }

    const category = await categoryModel.create(categoryName);
    return category;
  }

  async getCategories(){
    const categories = await categoryModel.findAll();
    return categories;
  }

  async getCategoryByName(name) {
    const category = await categoryModel.findByName(name);
    return category;
  }

}
const categoryService = new CategoryService(categoryModel);

export {categoryService};