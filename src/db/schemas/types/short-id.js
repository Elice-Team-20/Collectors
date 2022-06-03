import { nanoid } from 'nanoid';

const shortId = {
  type: String,
  default: () => {
    return nanoid();
  },
  require: true,
};

export { shortId };
