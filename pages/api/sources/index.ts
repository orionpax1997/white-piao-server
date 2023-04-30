import { NextApiRequest, NextApiResponse } from 'next';
import { AV, SourceObject } from '@/utils/leancloud-object';
import { allowCors } from '@/utils/index';

const sources = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const sourceObj = new SourceObject();
    sourceObj.set('name', req.body.name);
    sourceObj.set('baseURL', req.body.baseURL);
    sourceObj.set('status', 0);
    sourceObj.set('author', req.body.author);
    sourceObj.set('authorEmail', req.body.authorEmail);
    res.status(200).send(await sourceObj.save());
  } else if (req.method === 'PUT') {
    const sourceObj = AV.Object.createWithoutData('Source', req.body.objectId);
    if (req.body.name) sourceObj.set('name', req.body.name);
    if (req.body.baseURL) sourceObj.set('baseURL', req.body.baseURL);
    if (req.body.status != null) sourceObj.set('status', req.body.status);
    if (req.body.author != null) sourceObj.set('author', req.body.author);
    if (req.body.authorEmail != null) sourceObj.set('authorEmail', req.body.authorEmail);
    if (req.body.searchScript) sourceObj.set('searchScript', req.body.searchScript);
    if (req.body.searchTime) sourceObj.set('searchTime', req.body.searchTime);
    if (req.body.findSeriesScript) sourceObj.set('findSeriesScript', req.body.findSeriesScript);
    if (req.body.findStreamScript) sourceObj.set('findStreamScript', req.body.findStreamScript);
    if (req.body.findDiscoveryScript) sourceObj.set('findDiscoveryScript', req.body.findDiscoveryScript);
    if (req.body.discoveryScript) sourceObj.set('discoveryScript', req.body.discoveryScript);
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

export default allowCors(sources);
