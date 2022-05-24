import { Router } from 'express';

const itemRouter = Router();

itemRouter.get('/', (req, res) => {
  res.send("ok");
})

// itemRouter.delete()
export { itemRouter };
