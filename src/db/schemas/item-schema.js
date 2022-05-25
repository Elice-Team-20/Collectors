import { shortId } from './types/short-id';
import { Schema } from 'mongoose';


/*
  순서대로 id(shortId), 상품명, 카테고리, 제조사, 요약 설명, 메인 설명, 이미지, 재고수, 가격, 해쉬태그(필수요소 지정X)
*/
const ItemSchema = new Schema(
  { shortId,
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    manufacturingCompany: {
      type: String,
      required: true,
    },
    summary:{
      type: String,
      required: true,
    },
    mainExplanation:{
      type: String,
      required: true,
    },
    imgUrl:{
      type: String,
      required: true,
    },
    stocks:{
      type: Number,
      required: true,
    },
    price:{
      type: Number,
      required: true,
    },
    hashTag:{
      // required
      type: [],
    }
  },
  {
    collection: 'orderinfos',
    timestamps :true,
  }
);

export { ItemSchema };
