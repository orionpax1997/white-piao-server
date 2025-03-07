import axios from 'axios';
import parse from 'node-html-parser';

// import cheerio from 'cheerio';
// import md5 from 'md5';
// import cryptoJs from 'crypto-js';
// import * as byteBase64 from 'byte-base64';

// 设置9秒的默认超时
const instance = axios.create();
instance.defaults.timeout = 9000;

export default class JavaScriptVM {
  /** CheerioAPI 对象 */
  protected _fun: any;

  constructor(script: string) {
    this._fun = new Function(
      'axios',
      'parse',
      'input',
      `return new Promise(resolve => {
            ${script}
       })`
    );
  }

  async run(input: any): Promise<any> {
    return await this._fun(instance, parse.parse, input);
  }
}
