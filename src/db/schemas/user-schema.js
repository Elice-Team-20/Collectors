import { Schema } from 'mongoose';

// 유저가 가지는 정보
// email, 이름, 비밀번호, 전화번호, 주소(우편번호, 구체적인 주소 2개), 유저 레벨, 관리자인지 검사
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        },
      ),
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: '피터 파커',
    },
    accumulatedTotalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    orderInfo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'orderinfoes',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    //stat{name: , count}
    stat: {
      weapon: {
        type: Number,
        default: 0,
      },
      magic: {
        type: Number,
        default: 0,
      },
      intelligence: {
        type: Number,
        default: 0,
      },
      psychic: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export { UserSchema };
