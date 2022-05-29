import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {

  // 이메일로 유저 검색
  async findByEmail(email) {
    const user = await User.findOne({ email })
    return user;
  }

  // objectId로 유저 검색
  async findById(userId) {
    const user = await User.findOne({ _id: userId })
    return user;
  }

  // 유저 생성
  async create(userInfo) {
    const createdNewUser = await User.create(userInfo)
    return createdNewUser;
  }

  // 전체 유저 조회
  async findAll() {
    const users = await User.find({})
    return users;
  }

  // 유저 정보 업데이트
  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option)
    return updatedUser;
  }

  // email로 유져 정보 update 아직 서비스 할당안됨
  async updateByEmail({ userEmail, update }) {
    const filter = { email: userEmail };
    // after 사용해도 변화된 결과 돌려줌
    const option = { returnDocument: 'after' };
    try{
      const updatedUser = await User.findOneAndUpdate(filter, update, option)
      return updatedUser;
    }
    catch(er){
      return er
    }
  }

  // 유저 정보 삭제
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
