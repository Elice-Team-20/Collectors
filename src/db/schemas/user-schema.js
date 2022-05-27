import { Schema } from 'mongoose';

// 유저가 가지는 정보
// email, 이름, 비밀번호, 전화번호, 주소(우편번호, 구체적인 주소 2개), 유저 레벨, 관리자인지 검사 
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
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
        }
      ),
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: 'basic-user',
    },
  orderInfo:[{
    type: Schema.Types.ObjectId,
    ref: "orderinfoes",
  }],
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export { UserSchema };
