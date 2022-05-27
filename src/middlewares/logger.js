// exprss 설정으로 morgan 설정을 해서 쓰이지는 않는 미들웨어지만
// 혹시 적용 안되는 부분이 생기면 미들웨어 적용해서 보실수 있습니다.

import morgan from "morgan";
export function RouterLoggerMiddleware(req, res,next,) {
    morgan.debug(`${req.method} ${req.originalUrl}`);
    next();
  }
