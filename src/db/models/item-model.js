import { model } from 'mongoose';
import { ItemSchema } from '../schemas/item-schema';

const Item = model('items', ItemSchema);

export class ItemModel {
  async findById(itemId) {
    // 오브젝트 아이디 무조건 _ 하나여야 검증 가능
    //추후 async handler 추가 필요 - 일단 dev 에 넣기 위해 이렇게 처리

    try {
      const item = await Item.findOne({ _id: itemId }).exec();
      return item;
    } catch (er) {
      console.log('모델 에러 발생 개발자도구를 확인하세요');
      return er;
    }
  }

  async find() {
    try {
      const item = await Item.find({}).exec();
      return item;
    } catch (er) {
      console.log('모델 에러 발생 개발자도구를 확인하세요');
      return er;
    }
  }

  // 카테고리별 상품 검색
  async findByCategory(category) {
    try {
      const items = await Item.find({ category: category }).exec();
      return items;
    } catch (er) {
      return er;
    }
  }

  // stocks가 5개 미만인 아이템 검색
  async findFiveOrLessThanItems() {
    const items = await Item.find({ stocks: { $lte: 5 } }).exec();
    return items;
  }

  // 최근에 등록된 6개의 아이템 검색
  async findNewItems() {
    const items = await Item.find({}).sort({ createdAt: -1 }).limit(6);
    return items;
  }

  async create(itemInfo) {
    console.log(itemInfo);
    try {
      const item = await Item.create(itemInfo);
      return item;
    } catch (er) {
      console.log(' 모델 에러 발생 개발자도구를 확인하세요');
      return er;
    }
  }

  async delete(itemId) {
    try {
      const filter = { _id: itemId };
      const option = { returnOriginal: false };
      const data = { deleteFlag: true };
      const item = await Item.findOneAndUpdate(filter, data, option);
      return item;
    } catch (er) {
      console.log('에러 발생 개발자도구를 확인하세요');
      return er;
    }
  }

  async update(itemId, newInfo) {
    console.log(itemId, newInfo);
    try {
      const updatedItem = await Item.updateOne({ _id: itemId }, newInfo).exec();
      return updatedItem;
    } catch (er) {
      return er;
    }
  }
}

const itemModel = new ItemModel();

export { itemModel };
