import axios from 'axios';

export async function getCdn(name: string) {
  try {
    const result = await axios.get(
      `https://cdn.dsmcdn.com/seller-ads/editor/resources/${name}.svg`,
    );

    return result.data;
  } catch (e) {
    console.error(`svg component not found on server, name: ${name}`);
  }
}
