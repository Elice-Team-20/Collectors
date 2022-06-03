import { model } from 'mongoose';
import { ItemSchema } from '../schemas/item-schema';
import lodash from 'lodash';

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
      const item = await Item.find({ deleteFlag: false })
        .sort({ updatedAt: -1 })
        .exec();
      return item;
    } catch (er) {
      console.log('모델 에러 발생 개발자도구를 확인하세요');
      return er;
    }
  }

  // 카테고리별 상품 검색
  async findByCategory(category) {
    try {
      const items = await Item.find({ category: category })
        .sort({ updatedAt: -1 })
        .exec();
      return items;
    } catch (er) {
      return er;
    }
  }

  // stocks가 5개 미만인 아이템 검색
  async findFiveOrLessThanItems() {
    const items = await Item.find({
      $and: [{ deleteFlag: false }, { stocks: { $lte: 5, $gt: 0 } }],
    }).exec();
    return items;
  }

  // 최근에 등록된 6개의 아이템 검색
  async findNewItems() {
    const items = await Item.find({ deleteFlag: false })
      .sort({ createdAt: -1 })
      .limit(6);
    console.log(items);
    return items;
  }

  // 디비에서 키워드 검색
  async searchItems(keyword) {
    // 1. 아이템 이름에 있는지 검색
    // 2. 해쉬태그에 있는지 검색
    // 3. 요약 설명에 있는지 검색
    // 중복되면 안됨.
    // isDelete가 fasle 이어야 함.

    const itemArray = [];

    // 검색 키워드가 없을 경우 빈 배열 반환
    if (!keyword) {
      return itemArray;
    }

    // 1. 아이템 이름 검색
    const findByName = await Item.find({
      itemName: { $regex: `.*${keyword}.*` },
    });

    itemArray.push(...findByName);

    // 2. 해쉬태그 검색
    const findByHashTag = await Item.find({
      hashTag: { $regex: `.*${keyword}.*` },
    });

    itemArray.push(...findByHashTag);

    // lodash 라이브러리 : 중복되는 id를 가지는 요소들 제거
    // deleteFlag가 true인 것만 필터링
    const result = lodash
      .uniqBy(itemArray, 'id')
      .filter((data) => !data.deleteFlag);

    return result;
  }

  async create(itemInfo) {
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
