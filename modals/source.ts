import AbstractAVObject from './abstract-av-object';

export class Source extends AbstractAVObject {
  name!: string;
  baseURL!: string;
  status!: number;
  author!: string;
  authorEmail!: string;
  searchTime?: number;
  searchScript?: string;
  findSeriesScript?: string;
  findStreamScript?: string;
  findDiscoveryScript?: string;
  discoveryScript?: string;
}
