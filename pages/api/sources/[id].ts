import { NextApiRequest, NextApiResponse } from 'next';
import { AV } from '@/utils/leancloud-object';
import { allowCors } from '@/utils/index';

const sources = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const SourceQuery = new AV.Query('Source');
    const source = await SourceQuery.get(req.query.id as string);
    res.status(200).send(source.toJSON());
  } else if (req.method === 'DELETE') {
    const sourceObj = AV.Object.createWithoutData('Source', req.query.id as string);
    sourceObj.destroy();
    res.status(200).end();
  } else {
    res.status(405).send({});
  }
};

export default allowCors(sources);
