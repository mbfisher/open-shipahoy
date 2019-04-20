import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-header-layout/app-header-layout.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-icon-button/paper-icon-button.js'

import '../ship-ahoy-icons.js'
import '../ship-ahoy-shared-styles.js'

class ImpressumView extends PolymerElement {
  static get is() { return 'impressum-page' }

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
            <div main-title>Impressum</div>
            <iron-icon icon="ship-ahoy-icons:logo"></iron-icon>
          </app-toolbar>
        </app-header>

        <paper-card lang="de">
          <h3>Angaben gemäß § 5 TMG:</h3>
          <p>Maritime Data Systems GmbH<br> Schwanenwik 24<br> 22087 Hamburg</p>
          <h3>Vertreten durch:</h3>
          <p>Herrn Carsten Bullemer</p>
          <h3>Kontakt:</h3>
          <p>E-Mail: info@maritimedatasystems.com</p>
          <h3>Registereintrag:</h3>
          <p>Eintragung im Handelsregister. <br> Registergericht: Amtsgericht Hamburg <br> Registernummer: HRB 83155
          </p>
          <h3>Umsatzsteuer:</h3>
          <p>UmsatzsteuerIdentifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br> DE220831254</p>
          <h3>Streitschlichtung</h3>
          <p>Die Europäische Kommission stellt eine Plattform zur OnlineStreitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank">https://ec.europa.eu/consumers/odr</a><br>
            Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.</p>
          <h3>Haftung für Inhalte</h3>
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder
            nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
          <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
            bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
            Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
          <h3>Haftung für Links</h3>
          <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
            Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
            verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
          <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links
            umgehend entfernen.</p>
          <h3>Urheberrecht</h3>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
            der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
            Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
            gestattet.</p>
          <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
            beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
            Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
          <p>Quelle: <a href="https://www.e-recht24.de">e-recht24.de</a></p>
        </paper-card>
      </app-header-layout>
    `
  }
}

window.customElements.define(ImpressumView.is, ImpressumView)
