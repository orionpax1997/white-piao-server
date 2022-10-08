import AbstractAVObject from './abstract-av-object';

export class Source extends AbstractAVObject {
  name!: string;
  baseURL!: string;
  status!: number;
  author!: string;
  authorEmail!: string;
  searchScript?: string;
  searchTime?: number;
  findSeriesScript?: string;
  findStreamScript?: string;
}
