import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { viewsRouter, userRouter, itemRouter, orderInfoRouter, categoryRouter, authRouter } from './routers';
import { initialize } from './passport/index';
import { errorHandler } from './middlewares';

const app = express();

initialize();

// CORS 에러 방지
app.use(cors());
// logger 사용
app.use(morgan('dev'));
//아래는 배포환경 에서 사용하는 로거 입니다 배포시 주석 해제 하거나 env 파일로 분기 주면 될거 같습니다.
//app.user(morgan('combined'))
// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/api/order', orderInfoRouter)
app.use('/api/category', categoryRouter);
app.use('/api/auth', authRouter);

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
