import { NextApiRequest, NextApiResponse } from 'next';
import NodeVM from '@/utils/node-vm';

import { SearchItem, EpisodeGroup, Episode, Discovery, DiscoveryGroup, DiscoveryItem } from '@/modals/index';
import { allowCors } from '@/utils/index';

const run = async (req: NextApiRequest, res: NextApiResponse) => {
  let data;
  try {
    const start = new Date().getTime();
    const fun = NodeVM.run(req.body.script, 'node-vm.js');
    data = await fun(req.body.input);
    const time = new Date().getTime() - start;
    if (!data) {
      res.status(206).json({ msg: '结果为空' });
      return;
    } else if (req.query.option === 'search' && data.some((item: SearchItem) => !item.title || !item.seriesUrl)) {
      res.status(206).json({ data, msg: 'SearchItem 需要包涵必要字段 title、seriesUrl' });
      return;
    } else if (
      req.query.option === 'findSeries' &&
      data.some((item: EpisodeGroup) => !item.title || !item.episodeList || !item.episodeList.length)
    ) {
      res.status(206).json({ data, msg: 'EpisodeGroup 需要包涵必要字段 title、episodeList, 且 episodeList 不能为空' });
      return;
    } else if (
      req.query.option === 'findSeries' &&
      data.some((item: EpisodeGroup) =>
        item.episodeList.some((episode: Episode) => !episode.title || !episode.playPageUrl)
      )
    ) {
      res.status(206).json({ data, msg: 'Episode 需要包涵必要字段 title、playPageUrl' });
      return;
    } else if (
      req.query.option === 'findDiscovery' &&
      data.some((item: Discovery) => !item.title || !item.discoveryUrl)
    ) {
      res.status(206).json({ data, msg: 'Discovery 需要包涵必要字段 title、discoveryUrl' });
      return;
    } else if (
      req.query.option === 'discovery' &&
      data.some((item: DiscoveryGroup) => !item.title || !item.discoveryItemList || !item.discoveryItemList.length)
    ) {
      res
        .status(206)
        .json({ data, msg: 'DiscoveryGroup 需要包涵必要字段 title、discoveryItemList, 且 discoveryItemList 不能为空' });
      return;
    } else if (
      req.query.option === 'discovery' &&
      data.some((item: DiscoveryGroup) =>
        item.discoveryItemList.some((discovery: DiscoveryItem) => !discovery.title || !discovery.seriesUrl)
      )
    ) {
      res.status(206).json({ data, msg: 'DiscoveryItem 需要包涵必要字段 title、seriesUrl' });
      return;
    }
    res.status(200).json({ data, time });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : error;
    if (typeof errMessage === 'string' && errMessage.includes('timeout')) {
      res.statusMessage = errMessage;
      res.status(408).send({ data, msg: errMessage, error: errMessage });
    } else {
      res.status(500).json({ data, msg: errMessage });
    }
  }
};

export default allowCors(run);
