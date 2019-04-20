import { html } from '@polymer/polymer/polymer-element.js'
import moment from 'moment'
import { addListener } from '@polymer/polymer/lib/utils/gestures.js'
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-fab/paper-fab.js'
// import 'web-animations-js/web-animations-next.min.js'
// import '@polymer/neon-animation/neon-animations.js'
// import '@polymer/neon-animation/animations/slide-from-bottom-animation.js'
// import '@polymer/neon-animation/animations/slide-down-animation.js'
import '../../ship-ahoy-icons.js'
import '../../ship-ahoy-shared-styles.js'
import { ContainerPrototype } from '../../container-prototype.js';
import {
  selectedVesselSelector,
  followedVesselSelector,
} from '../../redux/vessels/vessels-selectors.js';
import { store } from '../../redux/store.js';
import {
  followVessel,
  selectVessel,
  unselectVessel,
  unfollowVessel,
} from '../../redux/vessels/vessels-actions.js';


class BottomSheet extends GestureEventListeners(ContainerPrototype) {
  static get is() { return 'bottom-sheet' }
  static get template() {
    return html`
      <style is="custom-style" include="shared-styles iron-flex iron-flex-alignment">
        :host {
          --condensed-dialog-height: 89px;
        }

        * {
          /* Calculations for font sizes */
          --diff: calc(var(--max-size) - var(--min-size));
          --responsive: calc((var(--min-size) * 1px) + var(--diff) * ((100vh - 320px) / (1100 - 320))); /* Ranges from 421px to 1199px */
        }

        paper-dialog {
          position: fixed;
          margin: 0;
          width: 100%;
          /*font settings*/
          font: 12px/1.3 Helvetica, sans-serif;
          --max-size: 16;
          --min-size: 12;
          font-size: var(--responsive);
          bottom: 0;
          max-height: 550px;
          height: var(--condensed-dialog-height);
          z-index: 50;
          border-left: 1px solid var(--divider-color);
          box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, .14), 0 -3px 1px -2px rgba(0, 0, 0, .2), 0 -1px 5px 0 rgba(0, 0, 0, .12);
        }

        .details {
          height: calc(66vh - 109px);
          max-height: calc(550px - 119px);
        }

        paper-button {
          vertical-align: middle;
        }

        .flex-center-justified {
          @apply --layout-horizontal;
          @apply --layout-center-justified;
        }

        .detail-actions {
          height: 62px;
          margin: 25px 0;
        }

        .right {
          text-align: right;
        }

        .left {
          text-align: left;
        }

        ul {
          list-style: none;
          margin: 0;
          padding-left: 0;
        }

        ul li {
          position: relative;
          padding: 2px 5px 2px 0;
          margin: 5px 0;
        }

        paper-fab {
          --paper-fab-background: var(--accent-color);
          margin-top: -58px;
          float: right;
          display: block
        }

        paper-fab[active] {
          --paper-fab-background: var(--primary-color);
        }

        strong {
          font: small-caps 18px/1.3 Helvetica, Verdana, sans-serif;
          --max-size: 18;
          --min-size: 16;
          font-size: var(--responsive);
        }

        .vessel-name {
          font-weight: bold;
          font-variant: small-caps;
          font-size: 135%;
        }

        .banner-bottom {
          position: relative;
          bottom: 3px;
        }

        .icon-more {
          position: relative;
          bottom: 28px;
          height: 0;
          color: #a8a8a8;
        }
      </style>

      <paper-dialog
          on-tap="_maximizeDetails"
          no-cancel-on-outside-click
          id="vesselDetailsDialog">
        <div class="content flex">
          <paper-fab active="[[active]]" on-tap="_followToggle" icon="ship-ahoy-icons:location-[[iconSuffix]]" toggles></paper-fab>
          <div class="vertical layout flex">
            <div class="flex-center-justified icon-more">
              <iron-icon icon="ship-ahoy-icons:expand-[[expandIconSuffix]]"></iron-icon>
            </div>
            <div class="horizontal layout justified">
              <div>
                <span class="vessel-name">[[vessel.name]]</span>
              </div>
              <div class="right">[[vessel.group.name]]</div>
            </div>
            <div class="horizontal layout justified">
              <div>
                Updated [[vessel.time]]
              </div>
              <div class="right">
                [[vessel.speed]]kts
              </div>
            </div>
            <div class="details">
              <div class="detail-actions flex-center-justified">
                <snap-picture></snap-picture>
              </div>
              <div class="left vertical flex">
                <ul>
                  <li>
                    <div hidden="[[!vessel.imo]]">
                      <div class="horizontal layout justified">
                        <div class="left"><strong>IMO Nr.</strong></div>
                        <div class="right">[[vessel.imo]]</div>
                      </div>
                    </div>
                    <div hidden="[[vessel.imo]]">
                      <div class="horizontal layout justified">
                        <div class="left"><strong>MMSI Nr.</strong></div>
                        <div class="right">[[vessel.mmsi]]</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="horizontal layout justified">
                      <div><strong>Size</strong></div>
                      <div class="right">[[vessel.length]]m x [[vessel.width]]m</div>
                  </div>
                  </li>
                  <li>
                    <div class="horizontal layout justified">
                      <div class="left"><strong>Draft</strong></div>
                      <div class="right">[[vessel.draft]]m</div>
                    </div>
                  </li>
                  <li hidden="[[!vessel.destination]]">
                    <div class="horizontal layout justified">
                      <div class="left"><strong>Destination</strong></div>
                      <div class="right"> [[vessel.destination]]</div>
                    </div>
                  </li>
                  <li hidden="[[!vessel.eta]]">
                    <div class="horizontal layout justified">
                      <div class="left"><strong>Planned arrival</strong></div>
                      <div class="right"> [[vessel.eta]]</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex-center-justified banner-bottom">
              <p>sponsored by <a href="http://www.seadevcon.com" target="_blank" rel="noopener">seadevcon.com</a></p>
            </div>
          </div>
        </div>

      </paper-dialog>
    `
  }

  static get properties() {
    return {
      _selectedVessel: {
        type: Object,
        observer: '_selectedVesselObserver'
      },
      _followedVessel: {
        type: Object,
        observer: '_followedVesselObserver'
      },
      vessels: {
        type: Array,
        statePath: 'vessels',
      },
      active: {
        type: Boolean,
        value: true,
      },
      iconSuffix: {
        type: String,
        value: 'on'
      },
      expandIconSuffix: {
        type: String,
        value: 'less'
      },
      vessel: {
        type: Object,
        notify: true,
      },
    }
  }

  ready() {
    super.ready();
    addListener(this.$.vesselDetailsDialog, 'track', this.handleTrack.bind(this));
    this.condensedDialogHeight = parseInt(getComputedStyle(this).getPropertyValue('--condensed-dialog-height'));
  }

  handleTrack(event) {
    switch (event.detail.state) {
      case 'start':
        break;
      case 'track':
          this.$.vesselDetailsDialog.style.setProperty('height', `calc(100% - ${event.detail.y}px)`);
        break;
      case 'end':
        switch (this._getTrackingDirection(event)) {
          case 'down':
            this.expandIconSuffix = 'less';
            let downFinalHeight = `${this.condensedDialogHeight}px`;
            if (event.detail.y > window.innerHeight - this.condensedDialogHeight) {
              downFinalHeight = 0;
              this.dispatch('updateSelectedVesel', undefined);
              this.dispatch('updateFollowedVessel', undefined);
              this.$.vesselDetailsDialog.style.setProperty('height', `${this.condensedDialogHeight}px`);
              this.$.vesselDetailsDialog.close();
            }
            this.$.vesselDetailsDialog.animate({
              height: [`calc(100% - ${event.detail.y}px)`, downFinalHeight]
            }, 300).onfinish = () => {
              if (this.$.vesselDetailsDialog.style.getPropertyValue('height') !== `${this.condensedDialogHeight}px`) {
                this.$.vesselDetailsDialog.style.setProperty('height', `${this.condensedDialogHeight}px`);
              }
            };
            setTimeout(() => {
              this.$.vesselDetailsDialog.style.setProperty('height', `${this.condensedDialogHeight}px`);
            });
            break;
          case 'up':
            this.expandIconSuffix = 'more';
            const upFinalHeight = '66vh'
            this.$.vesselDetailsDialog.animate({
              height: [`calc(100% - ${event.detail.y}px)`, upFinalHeight]
            }, 300).onfinish = () => {
              if (this.$.vesselDetailsDialog.style.getPropertyValue('height') !== upFinalHeight) {
                this.$.vesselDetailsDialog.style.setProperty('height', upFinalHeight);
              }
            };
            setTimeout(() => {
              this.$.vesselDetailsDialog.style.setProperty('height', upFinalHeight);
            });
            break;
        }
        break;
    }
  }

  _getTrackingDirection(event) {
    const verticalChangeSinceFirstTrackEvent = event.detail.dy;
    return verticalChangeSinceFirstTrackEvent < 0 ? 'up' : 'down';
  }

  _maximizeDetails() {
    const currentHeight = parseInt(this.$.vesselDetailsDialog.getComputedStyleValue('height'));
    if (currentHeight > 89) return;
    const upFinalHeight = '66vh';
    this.$.vesselDetailsDialog.animate({
      height: [`${this.condensedDialogHeight}px`, upFinalHeight]
    }, 300).onfinish = () => {
      if (this.$.vesselDetailsDialog.style.getPropertyValue('height') != upFinalHeight) {
        this.$.vesselDetailsDialog.style.setProperty('height', upFinalHeight);
      }
    };
    setTimeout(() => {
      this.$.vesselDetailsDialog.style.setProperty('height', upFinalHeight);
    });
    this.expandIconSuffix = 'more';
  }

  _selectedVesselObserver(vessel) {
    // if (this._interval) clearInterval(this._interval)
    if (!vessel || !vessel.mmsi) return this.$.vesselDetailsDialog.close()
    this.$.vesselDetailsDialog.open();
    this._updateVessel(vessel);
    // this._interval = setInterval(() => this._updateVessel(vessel), 1000)
  }

  _followedVesselObserver(vessel) {
    if (vessel && vessel.mmsi) {
      this.iconSuffix = 'off'
      this.active = false
    } else {
      this.iconSuffix = 'on'
      this.active = true
    }
  }

  _updateVessel(selectedVessel) {
    const eta = moment(selectedVessel.eta, 'DD.MM').fromNow()
    const etaDisplayed = eta !== 'Invalid date' ? eta : ''
    this.vessel = {
      name: selectedVessel.name,
      mmsi: selectedVessel.mmsi,
      imo: selectedVessel.imo,
      group: selectedVessel.group,
      length: selectedVessel.length,
      width: selectedVessel.width,
      eta: etaDisplayed,
      destination: selectedVessel.destination,
      draft: selectedVessel.draft,
      speed: Math.round(selectedVessel.animationPosition.speed * 10) / 10,
      time: moment(selectedVessel.animationPosition.timestamp).fromNow(),
    }
  }

  _followToggle(event) {
    event.preventDefault()
    event.stopPropagation()
    if (!this._followedVessel) {
      store.dispatch(followVessel(this._selectedVessel))
    } else {
      store.dispatch(unfollowVessel())
    }
  }

  _stateChanged(state) {
    this._selectedVessel = selectedVesselSelector(state)
    this._followedVessel = followedVesselSelector(state)
  }
}

window.customElements.define(BottomSheet.is, BottomSheet);
