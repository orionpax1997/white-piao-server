import { NextApiRequest, NextApiResponse } from 'next';
import NodeVM from '@/utils/node-vm';
import { SearchItem, EpisodeGroup, Episode } from '@/modals/index';

const run = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const fun = NodeVM.run(req.body.script, 'node-vm.js');
    const data = await fun(req.body.input);
    if (req.query.option === 'search') {
      if (!data) {
        res.status(206).json({ msg: '结果为空' });
      } else if (data.some((item: SearchItem) => !item.title || !item.seriesUrl)) {
        res.status(206).json({ msg: 'SearchItem 需要包涵必要字段 title、seriesUrl' });
      } else {
        res.status(200).json({ data: data });
      }
    } else if (req.query.option === 'findSeries') {
      if (!data) {
        res.status(206).json({ msg: '结果为空' });
      } else if (data.some((item: EpisodeGroup) => !item.title || !item.episodeList || !item.episodeList.length)) {
        res.status(206).json({ msg: 'EpisodeGroup 需要包涵必要字段 title、episodeList, 且 episodeList 不能为空' });
      } else if (
        data.some((item: EpisodeGroup) =>
          item.episodeList.some((episode: Episode) => !episode.title || !episode.playPageUrl)
        )
      ) {
        res.status(206).json({ msg: 'Episode 需要包涵必要字段 title、playPageUrl' });
      } else {
        res.status(200).json({ data: data });
      }
    } else if (req.query.option === 'findStream') {
      if (!data) {
        res.status(206).json({ msg: '结果为空' });
      } else {
        res.status(200).json({ data: data });
      }
    }
  } catch (error) {
    if (typeof error === 'string') {
      res.status(500).json({ msg: error });
    } else if (error instanceof Error) {
      res.status(500).json({ msg: error.message });
    }
  }
};

export default run;
