import { model } from 'mongoose';
import { ItemSchema } from '../schemas/item-schema';

const Item = model('items', ItemSchema);

export class ItemModel {
  async findById(itemId) {
    
  }

  async create(itemInfo) {

  }

  async delete(itemId) {
    const item = await Item.findOneAndDelete({id: itemId});
    return item;
  }

  async update(itemId, newInfo){
    const updatedItem = await Item.findByIdAndUpdate({id: itemId}, newInfo);
    return updatedItem;
  }

}


const itemModel = new ItemModel();

export { itemModel };
