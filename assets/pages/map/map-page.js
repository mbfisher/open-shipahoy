import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/app-layout/app-drawer/app-drawer.js'
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js'
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-header-layout/app-header-layout.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/paper-icon-button/paper-icon-button.js'

import './bottom-sheet.js'
import './drawer-footer.js'
import './map-element.js'
import './vessels-list.js'
import '../../ship-ahoy-icons.js'
import '../../ship-ahoy-shared-styles.js'

class MapPage extends PolymerElement {
  static get is() { return 'map-page' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles">
        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
        app-drawer-layout {
          height: 100vh ;
          margin: 0;
        }
        map-element {
          @apply --layout-flex;
        }
        iron-icon {
          --iron-icon-height: 32px;
          --iron-icon-width: 32px;
        }
        vessels-list {
          height: calc(100% - 116px);
          margin: 2px 0;
          overflow-y: auto;
        }
      </style>

      <app-drawer-layout fullbleed id="drawerLayout">

        <app-drawer slot="drawer" id="drawer" swipe-open>
          <app-toolbar>
            <iron-icon icon="ship-ahoy-icons:logo"></iron-icon>
            <div main-title>Find Vessel</div>
          </app-toolbar>
          <vessels-list></vessels-list>
          <drawer-footer></drawer-footer>
        </app-drawer>

        <app-header-layout fullbleed>

          <app-header slot="header" fixed>
            <app-toolbar>
              <paper-icon-button
                  icon="ship-ahoy-icons:menu"
                  drawer-toggle>
              </paper-icon-button>
              <div main-title>Hamburg <i>Live</i></div>
            </app-toolbar>
          </app-header>

          <map-element></map-element>

          <bottom-sheet></bottom-sheet>

        </app-header-layout>

      </app-drawer-layout>
    `
  }


  static get properties() {
    return {
      animationTimestamp: {
        type: Number,
        statePath: 'animationTimestamp',
      },
      replayMode: {
        type: Boolean,
        statePath: 'replayMode'
      },
      selectedVesselMmsi: {
        type: Number,
        statePath: 'selectedVesselMmsi',
        observer: '_selectedVesselChange',
      },
    }
  }

  static get actions() {
    return {
      rewind() {
        return { type: 'REWIND_REPLAY' }
      },
    }
  }

  _selectedVesselChange(mmsi) {
    if (!mmsi || !this.$.drawerLayout.narrow) return
    this.$.drawer.close()
  }
}

window.customElements.define(MapPage.is, MapPage)
