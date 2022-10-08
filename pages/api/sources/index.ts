import { NextApiRequest, NextApiResponse } from 'next';
import { AV, SourceObject } from '@/utils/leancloud-object';

const sources = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const sourceObj = new SourceObject();
    sourceObj.set('name', req.body.name);
    sourceObj.set('baseURL', req.body.baseURL);
    sourceObj.set('status', 0);
    res.status(200).send(await sourceObj.save());
  } else if (req.method === 'PUT') {
    const sourceObj = AV.Object.createWithoutData('Source', req.body.objectId);
    sourceObj.set('name', req.body.name);
    sourceObj.set('baseURL', req.body.baseURL);
    sourceObj.set('status', req.body.status);
    sourceObj.set('searchScript', req.body.searchScript);
    sourceObj.set('findSeriesScript', req.body.findSeriesScript);
    sourceObj.set('findStreamScript', req.body.findStreamScript);
    res.status(200).send(await sourceObj.save());
  } else if (req.method === 'GET') {
    const SourceQuery = new AV.Query('Source');
    SourceQuery.descending('createdAt');
    SourceQuery.skip(parseInt(req.query.number as string) * parseInt(req.query.pageSize as string));
    SourceQuery.limit(parseInt(req.query.pageSize as string));
    if (req.query.keyword) {
      SourceQuery.contains('name', req.query.keyword as string);
    }
    const [list, totalElements] = await SourceQuery.findAndCount();
    res.status(200).send({
      skip: parseInt(req.query.number as string) * parseInt(req.query.pageSize as string),
      limit: parseInt(req.query.pageSize as string),
      list,
      totalElements,
    });
  } else {
    res.status(405).send({});
  }
};

export default sources;
