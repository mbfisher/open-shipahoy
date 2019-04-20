import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import { microTask } from '@polymer/polymer/lib/utils/async.js'
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from './redux/store.js'

export class ContainerPrototype extends connect(store)(PolymerElement) {
  static get is() { return 'container-prototype' }

  stateChanged(state) {
    this._stateChangedDebouncer = Debouncer.debounce(
      this._stateChangedDebouncer,
      microTask,
      () => this._stateChanged(state)
    )
  }

  // override in child
  _stateChanged(state) {}
}

window.customElements.define(ContainerPrototype.is, ContainerPrototype)
