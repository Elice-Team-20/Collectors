import { userModel } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(userInfo) {
    // 객체 destructuring
    const { email, fullName, password } = userInfo;

    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.'
      );
    }

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = { fullName, email, password: hashedPassword };

    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }

  // 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: user.role, isAdmin: user.isAdmin }, secretKey);

    return { token };
  }

  async setUserTokenNaver(loginInfo) {

    const { email } = loginInfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    const token = jwt.sign({ userId: user._id, role: user.role, isAdmin: user.isAdmin }, secretKey);

    return { token };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUserByEmail(email) {
    const user = await this.userModel.findByEmail(email);
    return user;
  }

  async setOrderInfo(objectId){
    // objectId
    const currentData = await this.userModel.findById({_id: objectId})
    return;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // 객체 destructuring
    const { userId, currentPassword } = userInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 이제 드디어 업데이트 시작

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }

  // 패스워드를 요구하지 않는 update 함수입니다. 보안상 좋지는 않을거 같습니다.
  async noPasswordUpdateAddress(userId, address){
    const updateRes = await this.userModel.update({
      userId: userId,
      update: address,
    })
    return updateRes;
  }

  // 유저 삭제 (회원 탈퇴)
  async deleteUser(userId, password){

    // objectId로 유저 검색
    const user = await this.userModel.findById(userId);
    const correctPasswordHash = user.password;

    // 비밀번호 일치하는지 검사
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    // 일치하지 않을 경우 에러
    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    const deletedUser = await this.userModel.delete(userId, password);
    return deletedUser;

  }

  async getUser(userId){
    // 주문 목록이 할당된게 없으면
    const user = await this.userModel.findById(userId);
    if(user.orderInfo.length !== 0){
      // 1개라도 있으면 populate 사용해서 보여준다.
      return await this.userModel.getUserAndPopulate(userId);
    }
    return user;
  }

  async getUserAddressInOrder(userId){
        // 주문 목록이 할당된게 없으면
        let user = await this.userModel.findById(userId);
        if(user.orderInfo.length !== 0){
          // 1개라도 있으면 populate 사용해서 보여준다.
          user = await this.userModel.getUserAndPopulate(userId);
        }
        const address = []
        // 주문 주소 만 address 에 push
        for (let key in user.orderInfo){
          address.push(user.orderInfo[key].shipAddress)
        }
        // 주문 주소가 없으면 에러 출력
        if(address.length === 0){
          throw new Error("할당된 주문목록이 없습니다.")
        }
        return address;
  }
  async getUserByEmail(userEmail){
    return await this.userModel.findByEmail(userEmail)
  }
}

const userService = new UserService(userModel);

export { userService };
