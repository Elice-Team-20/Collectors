import { model } from 'mongoose';
import { ItemSchema } from '../schemas/item-schema';

const Item = model('items', ItemSchema);

export class ItemModel {
  async findById(itemId) {
    const item = await Item.findOne({id: itemId});
    return item;
  }

  async create(itemInfo) {

  }

  async delete(itemId) {
    const item = await Item.findOneAndDelete({id: itemId});
    return item;
  }

  async update(itemId, newInfo){
    console.log(itemId, newInfo)
    const updatedItem = await Item.updateOne({id: itemId}, newInfo);
    return updatedItem;
  }

}


const itemModel = new ItemModel();

export { itemModel };
