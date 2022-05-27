import { itemModel } from '../db';

class ItemService {

  constructor(itemModel) {
    this.itemModel = itemModel;
  }

  // 상품 추가
  async addItem(itemInfo){
    const item = await this.itemModel.create(itemInfo);
    return item;
  }

  // 전체 상품 조회
  async getItems(){
    //평가지표 보고 만들기
    //아이탬이 비었는지 검사
    const itemData = await this.itemModel.find({});
    return itemData;
  }

  // ObjectID로 조회
  async getItembyObId(objectId){
    // object 아이디 검사
    const itemData = await this.itemModel.findById(objectId);
    return itemData;
  }

  // Category명으로 상품 검색
  async getItemsByCategory(category){
    const items = await this.itemModel.findByCategory(category);
    return items;
  }

  // 상품 삭제
  async deleteItem(itemId) {
    // 먼저 상품이 있는지 검사하고, 있을 경우 삭제. 그렇지 않으면 에러처리.
    const item = await this.itemModel.findById(itemId);

    if(!item) {
      throw new Error('등록된 상품이 없습니다.');
    }

    const result = await this.itemModel.delete(itemId);
    return result;
  }

  // 상품 수정
  async updateItem(itemId, info) {
    const item = await this.itemModel.findById(itemId);

    if(!item) {
      throw new Error('등록된 상품이 없습니다.');
    }

    const result = await this.itemModel.update(itemId, info);
    return result;
  }

}

const itemService = new ItemService(itemModel);

export {itemService};
