import { model } from 'mongoose';
import OrderSchema from '../schemas/orderInfo-schema'

const orderInfoModel = model('orderinfoes', OrderSchema)

export class OrderModel{
  //r
  async findByObjectId(objectId){
    try{
      const data = await orderInfoModel.findByid({objectId});
      if(!data){
        return new Error({message: "데이터가 없습니다."});
      }
      return data;
    }
    catch(er){
      return er
    }
  }


  async findall(){
    try{
      const data = await orderInfoModel.find({});
      if(!data){
        return new Error({message: "데이터가 없습니다."});
      }
      return data;
    }
    catch(er){
      return er
    }
  }

  //c
  async create(orderinfo){
    if (!orderinfo){
      return new Error({message: "입력데이터가 없습니다 "})
    }
    try{
      const createResult = await orderInfoModel.create(orderinfo);
      return createResult;
    }
    catch(er){
      return er
    }
  }

  async updateByObjectId(objectId, updateInfo){
    const filter = {_id: objectId};
    const returnOption = { returnOriginal: false};
    try{
      const updateResult = await orderInfoModel.updateOne({ filter, updateInfo, returnOption})
      return updateResult;
    }
    catch (er){
      return er
    }
  }

  //D
  async deleteByObjectId(objectId){
    try{
      const delResult = await orderInfoModel.deleteOne({ _id: objectId})
      return delResult;
    }
    catch(er){
      return er
    }
  }

}

const orderInfo = new OrderModel();

export { orderInfo }
