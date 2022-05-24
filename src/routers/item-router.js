import { Router } from 'express';
import upload from '../db/models/s3-model';

const itemRouter = Router();

itemRouter.get('/', (req, res) => {
  res.send("ok");
})

// itemRouter.delete()

itemRouter.post('/img/:imgName', upload.single('file'),function(req,res){
	res.json({message:"성공"})
})

export {itemRouter}
