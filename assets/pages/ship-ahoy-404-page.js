import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'

class ShipAhoy404Page extends PolymerElement {
  static get is() { return 'ship-ahoy-404-page' }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          padding: 10px 20px;
        }
      </style>
      Oops you hit a 404. <a href="/">Head back to home.</a>
    `
  }
}

window.customElements.define(ShipAhoy404Page.is, ShipAhoy404Page)
