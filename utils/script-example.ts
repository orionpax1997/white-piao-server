const SEARCH_EXAMPLE = `// 使用 vm2 作为沙盒执行的脚本
// vm2 不支持 ES Moudle 因此使用 require 引入第三方库
// @see https://github.com/patriksimek/vm2
// @see https://github.com/axios/axios
// @see https://github.com/cheeriojs/cheerio
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 发现方法, 通过关键字查询发现项, 以下是天天视频的例子
 * @param keyword 输入的关键字
 * @return SearchItem[]
 * @author Humble.X
 * @see https://github.com/Humble-Xiang/white-piao-server/blob/main/modals/search-item.ts
 */
async function searchFunction(keyword) {
    // 获取网页HTML
    const res = await axios.get('https://www.ttsp.tv/vodsearch/-------------.html?wd=' + encodeURI(keyword));
    // 加载 CheerioAPI
    const $ = cheerio.load(res.data);
    // 爬取列表项, 并转换为 SearchItem 返回
    return $('.searchlist_item').map((_, em) => {
        return {
            title: $(em).find('a').attr('title'),
            seriesUrl: 'https://www.ttsp.tv' + $(em).find('a').attr('href'),
            type: $(em).find('.info_right').text(),
            actors: $(em).find('.vodlist_sub').first().text(),
            intro: $(em).find('.vodlist_sub').eq(2).text(),
            image: $(em).find('.vodlist_thumb').attr('data-original'),
        };
    }).toArray();
}

// 需要导出发现方法
module.exports = searchFunction;`;

const FIND_SERIES_EXAMPLE = `// 使用 vm2 作为沙盒执行的脚本
// vm2 不支持 ES Moudle 因此使用 require 引入第三方库
// @see https://github.com/patriksimek/vm2
// @see https://github.com/axios/axios
// @see https://github.com/cheeriojs/cheerio
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 发现剧集组的方法, 通过 SearchItem.seriesUrl 爬取并封装 EpisodeGroup[], 以下是天天视频的例子
 * @param seriesUrl 剧集页地址
 * @return EpisodeGroup[]
 * @author Humble.X
 * @see https://github.com/Humble-Xiang/white-piao-server/blob/main/modals/episode.ts
 * @see https://github.com/Humble-Xiang/white-piao-server/blob/main/modals/episode-group.ts
 */
async function findSeriesFunction(seriesUrl) {
    // 获取网页HTML
    const res = await axios.get(seriesUrl);
    // 加载 CheerioAPI
    const $ = cheerio.load(res.data);
    // 爬取各个源, 并转换为 EpisodeGroup 返回
    return $('.play_source_tab>a').map((i, em) => {
        return {
            title: $(em).attr('alt'),
            episodeList: $('.play_list_box>.playlist_full').eq(i).find('a').map((_, em) => {
                return {
                    title: $(em).text(),
                    playPageUrl: 'https://www.ttsp.tv' + $(em).attr('href'),
                }
            }).toArray(),
        };
    }).toArray();
}

// 需要导出发现剧集组的方法
module.exports = findSeriesFunction;`;

const FIND_STREAM_EXAMPLE = `// 使用 vm2 作为沙盒执行的脚本
// vm2 不支持 ES Moudle 因此使用 require 引入第三方库
// @see https://github.com/patriksimek/vm2
// @see https://github.com/axios/axios
const axios = require('axios');

/**
 * 发现视频流的方法, 通过 Episode.playPageUrl 爬取视频流, 以下是天天视频的例子
 * @param playPageUrl 播放页地址
 * @return 视频流地址
 * @author Humble.X
 * @see https://github.com/Humble-Xiang/white-piao-server/blob/main/modals/episode.ts
 */
async function findStreamFunction(playPageUrl) {
    // 获取网页HTML
    const res = await axios.get(playPageUrl);
    // 正则匹配视频流
    const match = res.data.match(/(?<=},"url":")[^&"]*/);
    // 返回处理无用字符，并返回视频流地址
    return match[0].replaceAll('\\\\', '');
}

// 需要导出发现视频流的方法
module.exports = findStreamFunction;`;

export { SEARCH_EXAMPLE, FIND_SERIES_EXAMPLE, FIND_STREAM_EXAMPLE };
