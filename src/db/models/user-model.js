import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email })
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId })
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo)
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({})
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option)
    return updatedUser;
  }

  async delete(userId) {
    const removedUser = await User.findOneAndDelete({_id: userId})
    return removedUser;
  }

  async appendOrder(userEmail, orderInfo){
    try{
      // findOneAndUpdate return the document _before_ `update` was applied
      //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
      await User.findOneAndUpdate({ email: userEmail }, {$addToSet: {orderInfo: orderInfo}} )
      return await User.findOne({email: userEmail});
    }
    catch(er){
      return er
    }
  }

  async getUserAndPopulate(userId){
      try{
        const data = await User.findOne({_id: userId}).populate({path:'orderInfo'})

        return data;
      }
      catch(err){
        return err;
      }
  }
}

const userModel = new UserModel();

export { userModel };
