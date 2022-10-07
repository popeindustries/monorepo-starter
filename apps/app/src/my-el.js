import { html, render } from '@popeindustries/lit';

export class MyEl extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('enabled')) {
      render(this.render(), this);
    }
  }

  render() {
    return html`<p>✅ Looks good!</p>`;
  }
}

customElements.define('my-el', MyEl);
