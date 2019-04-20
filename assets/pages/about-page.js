import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-header-layout/app-header-layout.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-icon-button/paper-icon-button.js'

import '../ship-ahoy-icons.js'
import '../ship-ahoy-shared-styles.js'

class AboutPage extends PolymerElement {
  static get is() { return 'about-page' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles">
        :host {
          display: block;
        }
        a paper-icon-button,
        a:active paper-icon-button,
        a:visited paper-icon-button {
          color: white;
        }
        iron-icon {
          color: white;
          --iron-icon-width: 32px;
          --iron-icon-height: 32px;
          padding: 8px;
        }
        paper-card {
          font-size: 10pt;
          margin: 24px;
          padding: 16px;
        }
      </style>

      <app-header-layout fullbleed has-scrolling-region>

        <app-header slot="header" fixed>
          <app-toolbar>
            <a href="/map" tabindex="-1">
              <paper-icon-button icon="ship-ahoy-icons:arrow-back"></paper-icon-button>
            </a>
            <div main-title>About</div>
            <iron-icon icon="ship-ahoy-icons:logo"></iron-icon>
          </app-toolbar>
        </app-header>

        <paper-card lang="en">
          <div class="card-content">
            <p><strong>shipahoy.io</strong> is a free service from <abbr title="Maritime Data Systems">MDS</abbr> —
              <a href="http://www.maritimedatasystems.com" target="_blank">Maritime Data Systems GmbH</a>. The shown AIS positions are received with an <em>Raispberry AIS Box</em> and
              refreshed in realtime.</p>
            <p>If you like our service we would be happy if you give us a like and a comment on our Facebook page. Also
              feedback and error messages are welcome!</p>
            <p>If you are interested in hosting your own AIS box or in a collaboration -- please get in touch with
              us.</p>
          </div>
          <div class="card-actions">
            <a href="https://www.facebook.com/Shipahoyio-1736319943112017/" target="_blank">Visit us on Facebook</a>
          </div>
        </paper-card>
        <paper-card lang="de">
          <div class="card-content">
            <p><span lang="en"><strong>shipahoy.io</strong></span> ist ein kostenloses Angebot von <abbr title="Maritime Data Systems">MDS</abbr> — <a href="http://www.maritimedatasystems.com" target="_blank">Maritime Data Systems GmbH</a>. Die angezeigten AIS
              Schiffspositionen werden durch eine <em>Raispberry AIS Box</em> empfangen und in Echtzeit zur Verfügung
              gestellt.</p>
            <p>Wenn Dir unser Angebot gefällt würden wir uns über ein Like oder einen Kommentar auf unserer
              Facebookseite freuen. Dort kannst Du uns auch gerne Feedback oder Anregungen zukommen lassen.</p>
            <p>Solltest Du Interesse an einer eigenen AIS Box oder Lust an einer Zusammenarbeit haben, würden wir uns
              ebenfalls über einen Kontakt freuen.</p>
          </div>
          <div class="card-actions">
            <a href="https://www.facebook.com/Shipahoyio-1736319943112017/" target="_blank">Besuchen Sie uns auf Facebook</a>
          </div>
        </paper-card>

      </app-header-layout>
    `
  }
}

window.customElements.define(AboutPage.is, AboutPage)
