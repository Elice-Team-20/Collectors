import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    itemList: {
      type: [],
      required: true,
    },
    shipAddress: {
      type: new Schema(
        {
          postalCode: Number,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        },
      ),
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: '상품 준비중',
    },
    shipRequest: {
      type: 'String',
      required: false,
    },
  },
  {
    collection: 'orderinfoes',
    timestamps: true,
  },
);

export default OrderSchema;
