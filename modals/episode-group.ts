import { Episode } from './episode';

/**
 * 剧集组
 */
export class EpisodeGroup {
  /** 标题 */
  title!: string;
  /** 剧集列表 */
  episodeList!: Episode[];
}
