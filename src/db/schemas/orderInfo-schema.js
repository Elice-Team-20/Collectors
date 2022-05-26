import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({
  shipAddress: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
     required: true
    },
  recipientName: {
    type: String,
     required: true}
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
