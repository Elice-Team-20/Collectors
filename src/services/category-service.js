import { categoryModel } from '../db';

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  //카테고리가 DB에 있는지 검사하는 함수.
  async isExistCategory(name) {
    const checkedCategory = await this.categoryModel.findByName(name);
    return checkedCategory ? true : false;
  }

  // 카테고리 추가
  async addCategory(name) {
    // 먼저 카테고리가 데이터베이스에 있는지 검사
    const result = await this.isExistCategory(name);

    // DB에 추가하려는 카테고리가 없으면 create, 그렇지 않으면 error
    if (!result) {
      const category = await categoryModel.create(name);
      return category;
    } else {
      throw new Error(
        '카테고리가 이미 존재합니다. 다른 카테고리를 추가해주세요.'
      );
    }
  }

  // 전체 카테고리 조회
  async getCategories() {
    const categories = await categoryModel.findAll();
    const array = [];
    categories.forEach((data) => array.push(data.name));
    return array;
  }

  async deleteCategory(name) {
    const result = await this.isExistCategory(name);

    // 삭제하려는 카테고리가 DB에 있을 경우 삭제, 그렇지 않으면 error
    if (!result) {
      throw new Error('카테고리가 존재하지 않습니다.');
    }

    const deletedCategory = await categoryModel.delete(name);
    return deletedCategory;
  }

  async updateCategory(oldname, newName) {
    const result = await this.isExistCategory(oldname);

    // 수정전 카테고리를 검색하고, 카테고리가 있다면 업데이트
    if (!result) {
      throw new Error('카테고리가 존재하지 않습니다.');
    }

    const updatedCategory = await categoryModel.update(oldname, newName);
    return updatedCategory;
  }
}
const categoryService = new CategoryService(categoryModel);

export { categoryService };
