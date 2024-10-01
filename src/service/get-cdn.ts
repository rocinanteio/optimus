import axios from 'axios';
import { IconSet } from '../icon-set.js';

export async function getCdn(name: string) {
  try {
    if (IconSet.has(name)) {
      return IconSet.get(name);
    }

    const result = await axios.get(
      `https://cdn.dsmcdn.com/seller-ads/editor/resources/${name}.svg`,
    );

    IconSet.set(name, result.data);
    return result.data;
  } catch (e) {
    console.error(`svg component not found on server, name: ${name}`);
  }
}
