import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-spinner/paper-spinner.js'
import '@polymer/paper-dialog/paper-dialog.js'

class LoadingDialog extends PolymerElement {
  static get is() { return 'loading-dialog' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles">
        paper-dialog {
          background: rgba(37, 42, 59, 0.92);
          border-radius: 5px;
          @apply --layout-vertical;
        }
        h3 {
          color: lightgray;
          font-size: large;
        }
        div {
          @apply --layout-horizontal;
          @apply --layout-center-justified;
        }
      </style>
      <paper-dialog id="dialog" no-cancel-on-esc-key="" with-backdrop="" no-cancel-on-outside-click="" opened="[[opened]]">
        <div>
          <paper-spinner active=""></paper-spinner>
        </div>
        <div>
          <h3>[[title]]</h3>
        </div>
      </paper-dialog>
    `
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        statePath: 'loadingDialogOpened'
      },
      title: {
        type: Boolean,
        statePath: 'loadingDialogTitle'
      }
    }
  }
}

window.customElements.define(LoadingDialog.is, LoadingDialog)
