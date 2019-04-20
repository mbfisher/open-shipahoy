import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import '../../ship-ahoy-icons.js'
import '../../ship-ahoy-shared-styles.js'

class DrawerFooter extends PolymerElement {
  static get is() { return 'drawer-footer' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles paper-material-styles">
        :host {
          display: block;
          @apply --layout-horizontal;
          @apply --layout-justified;
          @apply --paper-material-elevation-5;
        }
        a {
          text-decoration: none;
          @apply --layout-horizontal;
          @apply --layout-flex;
        }
        a paper-button,
        a:active paper-button,
        a:visited paper-button {
          @apply --layout-flex;
          text-transform: none;
          color: var(--paper-indigo-a400);
        }
      </style>

      <a href="/impressum" tabindex="-1">
        <paper-button>Impressum</paper-button>
      </a>
      <a href="/about" tabindex="-1">
        <paper-button>About</paper-button>
      </a>
    `
  }
}

window.customElements.define(DrawerFooter.is, DrawerFooter)
