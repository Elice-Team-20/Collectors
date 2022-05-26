import { Schema } from 'mongoose';

const OrderSchema = new Schema({
  shipAddress: {
    type: new Schema(
      {
        postalCode: Number,
        address1: String,
        address2: String,
      },
      {
        _id: false,
      }
    ),
    required: true,
  },
  totalCost: {
    type: Number,
     required: true
    },
  recipientName: {
    type: String,
     required: true
    }
     ,
  recipientPhone: {
    type: Number,
     required: true
    },

},
{
  collection: 'orderinfoes',
  timestamps :true,
}
);

export default OrderSchema;
