import { itemModel } from '../db';

class ItemService {

  constructor(itemModel) {
    this.itemModel = itemModel;
  }

  async addItem(itemInfo){

    const item = await this.itemModel.create(itemInfo);
    return item;
  }

  async getItems(){
    //평가지표 보고 만들기
    //아이탬이 비었는지 검사
    const itemData = await this.itemModel.find({});
    return itemData;
  }

  async getItembyObId(objectId){
    // object 아이디 검사
    const itemData = await this.itemModel.findById(objectId);
    return itemData;
  }

  async deleteItem(itemId) {
    const item = await this.itemModel.findById(itemId);

    if(!item) {
      throw new Error('등록된 상품이 없습니다.');
    }

    const result = await this.itemModel.delete(itemId);
  }

  async updateItem(itemId, info) {
    const item = await this.itemModel.findById(itemId);

    if(!item) {
      throw new Error('등록된 상품이 없습니다.');
    }

    const result = await this.itemModel.update(itemId, info);
  }

}

const itemService = new ItemService(itemModel);

export {itemService};
