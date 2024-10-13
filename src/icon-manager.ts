import { getCdn } from './service';

export class IconManager {
  icons: { [key: string]: string } = {};

  getIcon(name: string) {
    if (!this.icons[name]) {
      console.log(`optimus plugin could not found this icon: ${name}`);
      return;
    }
    return this.icons[name];
  }

  async addIcons(iconSet: string[]) {
    for (const icon of iconSet) {
      await this.addIcon(icon);
    }
  }

  private async addIcon(icon: string) {
    if (!this.icons[icon]) {
      this.icons[icon] = await getCdn(icon);
    }

    return this.icons[icon];
  }
}
