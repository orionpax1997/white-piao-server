import { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '@/utils/index';
import absoluteUrl from 'next-absolute-url';
import JavaScriptVM from '@/utils/script-vm';

const stream = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { origin } = absoluteUrl(req);
    const result = await fetch(origin + '/api/streams/source?id=' + req.query.id);
    const json = await result.json();
    const fun = new JavaScriptVM(json.findStreamScript);
    const url = await fun.run(req.query.playPageUrl);
    res.redirect(url);
  } else {
    res.status(405).send({});
  }
};

export default allowCors(stream);
