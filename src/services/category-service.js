import { categoryModel } from '../db';

class CategoryService {
  
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  //카테고리가 DB에 있는지 검사하는 함수.
  async findCategory(name){
    const findCategory = await this.categoryModel.findByName(name);
    return findCategory ? true : false;
  }

  async addCategory(name){
    const result = await this.findCategory(name);

    if(!result){
      const category = await categoryModel.create(name);
      return category;
    } else{
      throw new Error('카테고리가 이미 존재합니다. 다른 카테고리를 추가해주세요.');
    }
  }

  async getCategories(){
    const categories = await categoryModel.findAll();
    return categories;
  }

  async getCategoryByName(name) {
    const category = await categoryModel.findByName(name);
    return category;
  }

  async deleteCategory(name) {
    const result = await this.findCategory(name);
    
    if (result) {// 카테고리가 존재할 경우
      const deletedCategory = await categoryModel.delete(name);
      return deletedCategory;
    } else {
      throw new Error('카테고리가 존재하지 않습니다.');
    }
  }

  async updateCategory(oldname, newName){
    const result = await this.findCategory(oldname);
    console.log(result)

    if (result) {
      const updatedCategory = await categoryModel.update(oldname, newName);
      return updatedCategory;
    } else {
      throw new Error('카테고리가 존재하지 않습니다.');
    }
  }

}
const categoryService = new CategoryService(categoryModel);

export {categoryService};