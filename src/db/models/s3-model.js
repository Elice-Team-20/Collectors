import * as AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
import { v1, v3, v4, v5} from 'uuid';

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
    key:function(req, file, cb){
      const type = file.mimetype.split("/")[1];
      // uuid + 파일명으로 생성
      const fileName = `image/${v1().toString().replace('-','')}.${type}`;
      cb(null, fileName);
  },
    acl: 'public-read-write',
  }),
});

export default upload;
