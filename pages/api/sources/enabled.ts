import { NextApiRequest, NextApiResponse } from 'next';
import { AV } from '@/utils/leancloud-object';

const enabled = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const SourceQuery = new AV.Query('Source');
    SourceQuery.equalTo('status', 2);
    SourceQuery.ascending('searchTime');
    const list = await SourceQuery.find();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).send(list);
  } else {
    res.status(405).send({});
  }
};

export default enabled;
