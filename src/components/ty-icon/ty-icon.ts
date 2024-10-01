import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IconSet } from '../../icon-set';

@customElement('ty-icon')
export class TyIcon extends LitElement {
  svgContent = '';

  @property() name = '';

  constructor() {
    super();
  }

  // connectedCallback() {
  //   // fs.readFileSync(`./../../asset/drag-icon.svg`);
  // }

  render() {
    console.log('icon-set', IconSet);
    return html` <div>${IconSet[this.name]}</div>`;
  }
}
