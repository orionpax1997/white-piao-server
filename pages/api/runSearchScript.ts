import { NextApiRequest, NextApiResponse } from 'next';
import NodeVM from '@/utils/node-vm';

const runSearchScript = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchFunction = NodeVM.run(
    `
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function searchFunction(keyword) {
  const res = await axios.get('https://www.ttsp.tv/vodsearch/-------------.html?wd='+encodeURI(keyword));
  const $ = cheerio.load(res.data);
  const list = $('.searchlist_item').map((_, em) => {
    return {
      title: $(em).find('a').attr('title'),
      seriesUrl: $(em).find('a').attr('href'),
      type: $(em).find('.info_right').text(),
      actors: $(em).find('.vodlist_sub').first().text(),
      intro: $(em).find('.vodlist_sub').eq(2).text(),
      image: $(em).find('.vodlist_thumb').attr('data-original'),
    };
  });
  return list.toArray();
}
`,
    'node-vm.js'
  );
  res.status(200).json({ data: await searchFunction(req.body.keyword) });
};

export default runSearchScript;
