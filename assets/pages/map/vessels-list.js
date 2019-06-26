import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-item/paper-item.js";
import "../../ship-ahoy-icons.js";
import "../../ship-ahoy-shared-styles.js";
import { html } from "@polymer/polymer/polymer-element.js";
import { ContainerPrototype } from "../../container-prototype.js";
import { store } from "../../redux/store.js";
import {
  vesselsSelector,
  vesselGroupsSelector,
  selectedVesselSelector
} from "../../redux/vessels/vessels-selectors.js";
import { selectVessel } from "../../redux/vessels/vessels-actions.js";

class VesselsList extends ContainerPrototype {
  static get is() {
    return "vessels-list";
  }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles">
        :host {
          @apply --layout-flex;
          @apply --layout-vertical;
        }
        iron-list {
          max-height: 60vh;
          --iron-list-items-container: {
            @apply --layout-horizontal;
            @apply --layout-center-justified;
          }
        }
        paper-button {
          color: white;
          margin: 0.2em 0.29em;
          text-transform: none;
          min-height: 2em;
        }
        paper-item {
          border-bottom: 2px solid rgb(138, 174, 228);
          font-size: 14px;
          width: 80%;
          @apply --layout-center;
          @apply --layout-horizontal;
          @apply --layout-justified;
          --paper-item: {
            padding: 0px 8px;
          }
        }
        paper-item[active] {
          background-color: var(--paper-grey-300);
        }
        iron-list paper-item:last-child {
          border-bottom: none;
        }
        .length {
          color: gray;
          font-size: 10px;
          margin-top: 3px;
        }
      </style>

      <template is="dom-repeat" items="[[_vesselGroups]]" as="group">
        <paper-button
          style$="[[_computeColorAndShow(group)]]"
          on-tap="_toggleCollapse"
        >
          [[group.name]]
        </paper-button>
        <iron-collapse
          id$="collapse[[group.index]]"
          opened="[[_isGroupOpen(group.index)]]"
        >
          <iron-list
            id$="vesselList[[group.index]]"
            items="[[group.vessels]]"
            as="vessel"
            selection-enabled
          >
            <template>
              <paper-item toggles active="[[selected]]" on-tap="_selectVessel">
                <div>[[vessel.name]]</div>
                <div class="length">[[vessel.length]]m x [[vessel.width]]m</div>
              </paper-item>
            </template>
          </iron-list>
        </iron-collapse>
      </template>
    `;
  }

  static get properties() {
    return {
      _vesselGroups: Array,
      _vessels: Array,
      _selectedGroupIndex: Number,
      _selectedVessel: {
        type: Object,
        observer: "_selectedVesselObserver"
      },
      _previouslySelectedGroupIndex: Number
    };
  }

  _computeColorAndShow(group) {
    return `background-color: ${group.color};`;
  }

  _toggleCollapse(event) {
    const isCurrentlySelected =
      this._selectedGroupIndex === event.model.group.index;

    if (isCurrentlySelected) {
      return (this._selectedGroupIndex = null);
    }

    this._selectGroup(event.model.group.index);
  }

  _selectGroup(groupIndex) {
    this._selectedGroupIndex = groupIndex;
  }

  _isGroupOpen(groupIndex) {
    return groupIndex === this._selectedGroupIndex;
  }

  _selectGroupCollapseElement(index) {
    return this.shadowRoot.querySelector(`#collapse${index}`);
  }

  _selectGroupVesselsListElement(index) {
    return this.shadowRoot.querySelector(`#vesselList${index}`);
  }

  _selectVessel(event) {
    event.preventDefault();
    event.stopPropagation();
    const vessel = event.model.vessel;
    if (vessel.mmsi == this.selectedVesselMmsi) return;
    store.dispatch(selectVessel(vessel));
  }

  _selectedVesselObserver(selectedVessel) {
    const groupIndex = selectedVessel.group.index;
    const group = this._vesselGroups.find(group => group.index === groupIndex);
    const vesselIndex = group.vessels.findIndex(
      vessel => vessel.mmsi === selectedVessel.mmsi
    );

    this._selectGroup(groupIndex);

    const listElement = this._selectGroupVesselsListElement(groupIndex);
    listElement.scrollToIndex(vesselIndex);
    listElement.selectIndex(vesselIndex);
  }

  _stateChanged(state) {
    this._selectedVessel = selectedVesselSelector(state);
    this._vesselGroups = vesselGroupsSelector(state);
    this._vessels = vesselsSelector(state);
  }
}

customElements.define(VesselsList.is, VesselsList);
