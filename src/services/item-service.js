import { itemModel } from '../db';

class ItemService {

  constructor(itemModel) {
    this.itemModel = itemModel;
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