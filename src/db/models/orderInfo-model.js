import { model } from 'mongoose';
import OrderSchema from '../schemas/orderInfo-schema'

const orderInfoModel = model('orderinfoes', OrderSchema)

export class OrderModel{
  //r
  async findByObjectId(objectId){
    const data = await orderInfoModel.findByid({objectId});
    if(!data){
      return new Error({message: "데이터가 없습니다."});
    }
    return data;

  }

  async findByshorId(shortId){
    const data = await orderInfoModel.findOne({shortId : shortId});
    if(!data){
      return new Error({message: "데이터가 없습니다."});
    }
    return data;
  }

  async findall(){
    const data = await orderInfoModel.find({});
    if(!data){
      return new Error({message: "데이터가 없습니다."});
    }
    return data;
  }

  //c
  async create(orderinfo){
    if (!orderinfo){
      return new Error({message: "데이터가 없습니다 "})
    }
    const createResult = await orderInfoModel.create(orderinfo);
    return createResult;
  }

  async updateByObjectId(objectId, updateInfo){
    const filter = {_id: objectId};
    const returnOption = { returnOriginal: false};
    const updateResult = await orderInfoModel.updateOne({ filter, updateInfo, returnOption})
    console.log(updateResult)
    return updateResult;
  }

  async updateByShortId(shortId, updateInfo){
    const filter = {shortId: shortId};
    const returnOption = { returnOriginal: false};
    const updateResult = await orderInfoModel.updateOne({ filter, updateInfo, returnOption})
    return updateResult;
  }

  //D
  async deleteByObjectId(objectId){
    const delResult = await orderInfoModel.deleteOne({ _id: objectId})
    return delResult;
  }

  async deleteByObjectId(objectId){
    const delResult = await orderInfoModel.deleteOne({ shortId: objectId})
    return delResult;
  }

}

const orderInfo = new OrderModel();

export { orderInfo }
