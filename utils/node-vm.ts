import { NodeVM } from 'vm2';
import axios from 'axios';
import cheerio from 'cheerio';
import md5 from 'md5';
import cryptoJs from 'crypto-js';
import * as byteBase64 from 'byte-base64';

// 设置9秒的默认超时
const instance = axios.create();
instance.defaults.timeout = 9000;

export default new NodeVM({
  require: {
    root: './',
    mock: { axios: instance, cheerio, md5, fetch, cryptoJs, byteBase64 },
  },
});
