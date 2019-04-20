import '../../ship-ahoy-shared-styles.js'
import { html } from '@polymer/polymer/polymer-element.js'
import { ContainerPrototype } from '../../container-prototype.js'
import { store } from '../../redux/store.js'
import {
  getVessels,
  selectVessel,
  unselectVessel,
} from '../../redux/vessels/vessels-actions.js'
import {
  followedVesselSelector,
  selectedVesselSelector,
} from '../../redux/vessels/vessels-selectors.js'
import {
  positionsTreeSelector
} from '../../redux/positions/positions-selectors.js'
import {
  getPositions
} from '../../redux/positions/positions-actions.js'

let hiddenProperty, visibilityChangeEvent;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
  hiddenProperty = 'hidden';
  visibilityChangeEvent = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hiddenProperty = 'msHidden';
  visibilityChangeEvent = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hiddenProperty = 'webkitHidden';
  visibilityChangeEvent = 'webkitvisibilitychange';
}

class MapElement extends ContainerPrototype {
  static get is() { return 'map-element' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles mapboxgl-styles">
        #map {
          height: 100%;
          width: 100%;
        }
      </style>
      <div id="map"></div>
    `
  }


  static get properties() {
    return {
      map: Object,
      _selectedVessel: {
        type: Object,
        observer: '_selectedVesselObserver',
      },
      _followedVessel: Object,
      _positionsTree: {
        type: Object,
        observer: '_positionsTreeObserver'
      }
    }
  }

  ready() {
    super.ready()
    this.map = this._createMap()


    this.map.on('click', this._onMapClick.bind(this));
    this.map.on('load', this._onMapLoad.bind(this))
    this.map.on('moveend', this._onMapMoveEnd.bind(this))

    document.addEventListener(visibilityChangeEvent, () => {
      if (document[hiddenProperty]) return
      // the browser tab is back in user view
      store.dispatch(getVessels())
    }, false);
    // makes sure that the map resizes
    window.addEventListener('resize', () => {
      setTimeout(() => this.map.resize(), 100)
    }, false)
  }

  _positionsTreeObserver() {
    this.renderVessels();
    this.handleFollowedVessel();
  }

  // fly to followed vessel if it exists
  handleFollowedVessel() {
    if (!this._followedVessel) return
    this.map.flyTo({ center: this._followedVessel.animationPosition.coordinates })
  }

  _startAnimation() {
    clearInterval(this._animationInterval)
    this._animationInterval = setInterval(() => {
      store.dispatch(getPositions())
    }, 200)
  }

  _stopAnimation() {
    clearInterval(this._animationInterval)
  }

  _createMap() {
    return new mapboxgl.Map({
      container: this.$.map,
      style: 'mapbox://styles/wiem008/cjeyaic6a41sc2sl17vg8aogk',
      center: [ 9.97052, 53.52676 ], // Hamburg coordinates
      trackResize: true,
      zoom: 13.5,
      maxZoom: 17,
      minZoom: 8,
    })
  }

  _onMapLoad() {
    this._initializeSources(this.map)
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }))
    this.map.resize()
    this._startAnimation()
  }

  _onMapClick(event) {
    const positions = this._getNearbyPositions(event.point)
    if (!positions.length) return store.dispatch(unselectVessel())
    const coordinates = event.lngLat.toArray()
    const { vessel } = this._getClosestPosition(positions, coordinates)
    if (!vessel) return
    store.dispatch(selectVessel(vessel))
  }

  _onMapMoveEnd() {
    this.renderVessels()
    this._updateNavigationControl()
  }

  _getNearbyPositions({ x, y }) {
    const zoom = this.map.getZoom();
    const buffer = parseInt(zoom * zoom / 5);
    const [ minX, minY ] = this.map.unproject([x - buffer, y + buffer]).toArray()
    const [ maxX, maxY ] = this.map.unproject([x + buffer, y - buffer]).toArray()
    return this._positionsTree.search({ minX, minY, maxX, maxY })
  }

  _getClosestPosition(positions, coordinates) {
    return positions.reduce((prev, curr) => {
      const prevDistance = ruler.lineDistance([
        prev.vessel.animationPosition.coordinates,
        coordinates,
      ])
      const currDistance = ruler.lineDistance([
        curr.vessel.animationPosition.coordinates,
        coordinates,
      ])
      return prevDistance > currDistance ? curr : prev
    })
  }

  renderVessels() {
    if (!this.map || !this._positionsTree || !this.map.getSource('vessels')) return
    window.requestAnimationFrame(this._animationFrame.bind(this))
  }

  _animationFrame() {
    const vessels = this._positionsTree.search(this._getBounds())
    const features = vessels.map(this._mapVesselToFeature.bind(this))
    this.map.getSource('vessels').setData({ type: 'FeatureCollection', features })
  }

  _getBounds() {
    const bounds = this.map.getBounds()
    const [ minX, minY, maxX, maxY ] = ruler.bufferBBox([
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ], 1000)
    return { minX, minY, maxX, maxY }
  }

  _selectedVesselObserver(vessel) {
    if (vessel) {
      this.map.flyTo({center: vessel.animationPosition.coordinates})
    } else {
      this.map.getSource('selectedVessel').setData({
        type: 'FeatureCollection',
        features: []
      })
    }
  }

  _mapVesselToFeature({ vessel: { animationPosition, group, mmsi, name } }) {
    let color = group.color;
    if (this._selectedVessel && mmsi == this._selectedVessel.mmsi) {
      color = 'red';
      this.map.getSource('selectedVessel').setData({
        type: 'FeatureCollection',
        features:[{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: animationPosition.center,
          }
        }]
      })
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ animationPosition.polygon ],
      },
      properties: { color, name, }
    }
  }

  _updateNavigationControl() {
    if (this.map.getBearing() != 0 && !this._navigationControl) {
      this._navigationControl = new mapboxgl.NavigationControl({ showZoom: false })
      this.map.addControl(this._navigationControl)
    } else if (this.map.getBearing() == 0 && this._navigationControl) {
      this.map.removeControl(this._navigationControl)
      this._navigationControl = undefined
    }
  }

  _stateChanged(state) {
    this._followedVessel = followedVesselSelector(state)
    this._positionsTree = positionsTreeSelector(state)
    this._selectedVessel = selectedVesselSelector(state)
  }

  _initializeSources(map) {
    map.addSource('vessels', {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [],
      },
      "maxzoom": 17,
      "tolerance": 0,
    });

    map.addSource('selectedVessel', {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [],
      },
      "maxzoom": 17,
      "tolerance": 0,
    });

    map.addLayer({
      "id": "selectedVessel",
      "type": "circle",
      "source": "selectedVessel",
      "paint": {
        "circle-stroke-width": 1,
        "circle-stroke-opacity": 0.5,
        "circle-stroke-color": 'black',
        "circle-color": 'white',
        "circle-opacity": 0.5,
        "circle-radius": {
          "stops": [
            [11, 0],
            [12, 20],
            [13, 40],
            [14, 60],
            [15, 80],
            [16, 100],
            [17, 120],
          ]
        },
      },
    });

    map.addLayer({
      "id": "vessels",
      "type": "fill",
      "source": "vessels",
      "paint": {
        "fill-color": ['get', 'color'],
      },
    });

    map.addLayer({
      "id": "vesselsLabels",
      "type": "symbol",
      "source": "vessels",
      "layout": {
        "text-field": "{name}",
        "text-size": {
          "stops": [
            [13, 0],
            [14, 10],
            [15, 11],
            [16, 12],
            [17, 13],
          ],
        },
      },
      "paint": {
        "text-color": "#ffffff",
      },
    });
  }
}

window.customElements.define(MapElement.is, MapElement)
