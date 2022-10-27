import { NodeVM } from 'vm2';
import axios from 'axios';
import cheerio from 'cheerio';
import md5 from 'md5';
import cryptoJs from 'crypto-js';
import * as byteBase64 from 'byte-base64';

export default new NodeVM({
  require: {
    root: './',
    mock: { axios, cheerio, md5, fetch, cryptoJs, byteBase64 },
  },
});
