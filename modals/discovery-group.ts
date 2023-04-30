import { DiscoveryItem } from './discovery-item';

/**
 * 发现组
 */
export class DiscoveryGroup {
  /** 标题 */
  title!: string;
  /** 发现项列表 */
  discoveryItemList!: DiscoveryItem[];
}
