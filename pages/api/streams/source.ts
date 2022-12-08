import { NextApiRequest, NextApiResponse } from 'next';
import { AV } from '@/utils/leancloud-object';
import { allowCors } from '@/utils/index';

const source = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const SourceQuery = new AV.Query('Source');
    const source = await SourceQuery.get(req.query.id as string);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).send(source.toJSON());
  } else {
    res.status(405).send({});
  }
};

export default allowCors(source);
