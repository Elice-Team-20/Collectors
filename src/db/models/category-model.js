import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

class CategoryModel {

  async findByName(categoryName) {
    try{
      const form = {"name": categoryName}
      const category = await Category.findOne(form);
      return category;
    }catch (error){
      return error;
    }
  }

  async findAll(){
    const categories = await Category.find({});
    return categories;
  }

  async create(categoryName) {
    const form = {"name": categoryName};
    const createdCategory = await Category.create(form);
    
    return createdCategory;
  }

  async delete(categoryName) {
    const form = {"name": categoryName};
    const deletedCategory = await Category.deleteOne(form);
    return deletedCategory;
  }

  async update(oldCategoryName, newCategoryName){
    const form = {"name": newCategoryName};
    const updatedCategory = await Category.updateOne({
      "name": oldCategoryName,
    }, form);
    return updatedCategory;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };