import { NodeVM } from 'vm2';

export default new NodeVM({
  require: {
    external: ['axios', 'cheerio'],
  },
});
