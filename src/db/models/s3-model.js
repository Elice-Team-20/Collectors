import * as AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
import * as path from 'path';

require('dotenv').config();

// s3 객체생성하고 aws 계정 key 할당
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETKEY,
  region: process.env.AWS_REGEION,
});
// s3.config.""에 저장된다

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'team20',
    // 객체 업로드할 s3 이름
    key(req, file, cb) {
      const extension = path.extname(file.originalname);
      // 객체 고유 이름이기때문에 겹치면 안된다 나중에 object 아이디 or short id 받아서 고유성 유지 명심!!
      cb(null, req.params.imgName + extension);
    },
    acl: 'public-read-write',
  }),
});

export default upload;
