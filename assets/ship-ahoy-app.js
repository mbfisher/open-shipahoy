import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import { installRouter } from 'pwa-helpers/router.js'
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js'
import { updateMetadata } from 'pwa-helpers/metadata.js'
import '@polymer/iron-flex-layout/iron-flex-layout.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/iron-selector/iron-selector.js'
import '@polymer/paper-toast/paper-toast.js'

import './ship-ahoy-icons.js'
import './ship-ahoy-shared-styles.js'
import { errorsSelector, pageSelector } from './redux/app/app-selectors.js'
import { showError, navigate } from './redux/app/app-actions.js'
import { ContainerPrototype } from './container-prototype.js'
import { store } from './redux/store.js'

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true)

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(ShipAhoyAppGlobals.rootPath)

class ShipAhoyApp extends ContainerPrototype {
  static get is() { return 'ship-ahoy-app' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles">
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          --primary-color: #4285f4;
          --light-primary-color: #7baaf7;
          --dark-primary-color: #3367d6;
        }
        iron-pages > * {
          height: 100%;
          @apply --layout-horizontal;
        }
        paper-toast {
          max-width: 340px;
        }
      </style>

      <iron-pages selected="[[_page]]" attr-for-selected="name" role="main">
        <about-page name="about"></about-page>
        <map-page name="map"></map-page>
        <impressum-page name="impressum"></impressum-page>
        <ship-ahoy-404-page name="shipahoy404"></ship-ahoy-404-page>
      </iron-pages>

      <paper-toast
          id="toast"
          duration="5000"
          horizontal-align="center">
      </paper-toast>
    `
  }


  static get properties() {
    return {
      appTitle: String,
      _errors: {
        type: String,
        observer: '_errorsChanged'
      },
      _page: {
        type: String,
        observer: '_pageChanged'
      },
    }
  }

  constructor() {
    super()
    this._boundErrorListener = this._error.bind(this)
  }

  ready() {
    super.ready()
    this.addEventListener('error', this._boundErrorListener, { passive: true })
    installRouter(location => store.dispatch(navigate(decodeURIComponent(location.pathname))))
  }

  _error(event) {
    store.dispatch(showError(event.detail.error))
  }

  _pageChanged(_page) {
    if (!_page) return
    const pageTitle = 'Hamburg Live'
    updateMetadata({
      title: pageTitle,
      description: pageTitle
      // This object also takes an image property, that points to an img src.
    })
  }

  _errorsChanged(errors) {
    if (!errors || !errors.length) return
    let error = errors[errors.length - 1]
    if (error.toString) error = error.toString()
    this.$.toast.show(error)
  }

  _stateChanged(state) {
    this._page = pageSelector(state)
    const errors = errorsSelector(state)
    if (this._errors && this._errors.length == errors) return
    this._errors = errors
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('error', this._boundErrorListener, { passive: true })
  }
}

window.customElements.define(ShipAhoyApp.is, ShipAhoyApp)
