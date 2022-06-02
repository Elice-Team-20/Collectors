import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);
class CategoryModel {
  // 카테고리 이름으로 검색
  async findByName(categoryName) {
    try {
      const form = { name: categoryName };
      const category = await Category.findOne(form);
      return category;
    } catch (error) {
      return error;
    }
  }

  // 전체 카테고리 검색
  async findAll() {
    const categories = await Category.find({});
    return categories;
  }

  // 카테고리 추가
  async create(categoryName) {
    const form = { name: categoryName };
    const createdCategory = await Category.create(form);

    return createdCategory;
  }

  // 카테고리 삭제
  async delete(categoryName) {
    const form = { name: categoryName };
    const deletedCategory = await Category.deleteOne(form);
    return deletedCategory;
  }

  // 카테고리 수정
  // 이전 값 : oldCategoryName => 변경 후 : newCategoryName
  async update(oldCategoryName, newCategoryName) {
    const form = { name: newCategoryName };
    const updatedCategory = await Category.updateOne(
      {
        name: oldCategoryName,
      },
      form
    );
    return updatedCategory;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
