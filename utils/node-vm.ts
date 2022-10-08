import { NodeVM } from 'vm2';
import axios from 'axios';
import cheerio from 'cheerio';

export default new NodeVM({
  require: {
    root: './',
    mock: { axios, cheerio },
  },
});
