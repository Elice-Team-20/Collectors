import { model } from 'mongoose';
import { ItemSchema } from '../schemas/item-schema';

const Item = model('items', ItemSchema);

export class ItemModel {
  async create() {

  }

  async findAll() {

  }

}


const itemModel = new ItemModel();

export { itemModel };
