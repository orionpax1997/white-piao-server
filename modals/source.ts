import AbstractAVObject from './abstract-av-object';

export class Source extends AbstractAVObject {
  name!: string;
  baseURL!: string;
  status!: number;
  searchScript?: string;
  findSeriesScript?: string;
  findStreamScript?: string;
}
