import AbstractAVObject from './abstract-av-object';

export class Source extends AbstractAVObject {
  name!: string;
  baseURL!: string;
  status!: number;
  searchExpression?: string;
  loadSeriesExpression?: string;
  findStreamExpression?: string;
}
