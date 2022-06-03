import { itemModel } from '../db';
import { shuffle } from '../utils';

class ItemService {
  constructor(itemModel) {
    this.itemModel = itemModel;
  }

  // 상품 추가
  async addItem(itemInfo) {
    const item = await this.itemModel.create(itemInfo);
    return item;
  }

  // 전체 상품 조회
  async getItems() {
    //평가지표 보고 만들기
    //아이탬이 비었는지 검사
    const itemData = await this.itemModel.find();
    return itemData;
  }

  // ObjectID로 조회
  async getItembyObId(objectId) {
    // object 아이디 검사
    const itemData = await this.itemModel.findById(objectId);
    return itemData;
  }

  // Category명으로 상품 검색
  async getItemsByCategory(category) {
    const items = await this.itemModel.findByCategory(category);
    return items;
  }

  // 상품 중에 stocks가 5개 이하인 물품들 가져오기 (매진임박인 아이템 가져오기)
  async getSoldOutImminentItems() {
    const items = await this.itemModel.findFiveOrLessThanItems();
    let shuffledItems = shuffle(items);

    // 매진임박 상품 없을 때 에러처리
    if (items.length == 0) {
      throw new Error('매진임박인 상품이 없습니다.');
    }

    // 만약 item의 개수가 3개 이상이라면, 랜덤으로 3개를 골라서 돌려줌
    if (items.length >= 3) {
      const array = shuffledItems.slice(0, 3);
      return array;
    }

    // item의 개수가 3개 미만일 경우 바로 아이템 리턴
    return shuffledItems;
  }

  // 신상품 조회 함수
  async getNewItems() {
    const items = await this.itemModel.findNewItems();
    return items;
  }

  // 주어진 키워드로 검색
  async searchItems(keyword) {
    const items = await this.itemModel.searchItems(keyword);
    return items;
  }

  // 상품 삭제
  async deleteItem(itemId) {
    // 먼저 상품이 있는지 검사하고, 있을 경우 삭제. 그렇지 않으면 에러처리.
    const item = await this.itemModel.findById(itemId);

    if (!item) {
      throw new Error('등록된 상품이 없습니다.');
    }

    const result = await this.itemModel.delete(itemId);
    return result;
  }

  // 상품 수정
  async updateItem(itemId, info) {
    const item = await this.itemModel.findById(itemId);
    if (!item) {
      throw new Error('등록된 상품이 없습니다.');
    }

    await this.itemModel.update(itemId, info);

    const resultUpdate = await this.itemModel.findById(itemId);
    return resultUpdate;
  }
}

const itemService = new ItemService(itemModel);

export { itemService };
