import { itemModel } from '../db';

class ItemService {

  constructor(itemModel) {
    this.itemModel = itemModel;
  }

}

const itemService = new ItemService(itemModel);

export {itemService};