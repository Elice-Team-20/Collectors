import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match : /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
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
