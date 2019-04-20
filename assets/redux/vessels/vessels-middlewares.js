import {
  computePosition,
  computePositionsTree,
  copyVesselPosition,
  mapVessel,
} from '../../helpers.js'
import * as actions from '../actions.js'
// import moment from 'moment'
import { showError } from '../app/app-actions.js'
import { portBBoxSelector } from '../app/app-selectors.js'
import {
  getVesselsFailure,
  getVesselsRequest,
  getVesselsSuccess,
  setVessels,
} from './vessels-actions.js'
import {
  vesselSelector
} from './vessels-selectors.js'
import {
  setPositions,
  subscribeToPositionsUpdate
} from '../positions/positions-actions.js'

export const getVesselsMdl = ({ dispatch }) => next => action => {
  next(action)
  if (action.type !== actions.GET_VESSELS) return
  dispatch(getVesselsRequest())
  fetch('/api/v1/hamburg/vessels')
    .then(res => res.json())
    .then(vessels => {
      dispatch(getVesselsSuccess())
      dispatch(setVessels(vessels))
    })
    .catch(error => {
      debugger
      dispatch(getVesselsFailure(error))
    })
}

export const setVesselsMdl = ({ dispatch, getState }) => next => action => {
  if (action.type === actions.SET_VESSELS) {
    const state = getState()
    const bbox = portBBoxSelector(state)
    action.payload.vessels = action.payload.vessels.map(vessel => mapVessel(vessel))
      .filter(vessel => ruler.insideBBox(vessel.animationPosition.coordinates, bbox))
  }
  next(action)
  if (action.type !== actions.SET_VESSELS) return
  const { vessels } = action.payload
  dispatch(setPositions(vessels))
  dispatch(subscribeToPositionsUpdate())
}

export const updateVesselPositionMdl = ({ dispatch, getState }) => next => action => {
  next(action)
  if (action.type !== actions.UPDATE_VESSEL_POSITION) return
  const { message } = action.payload
  const parsedMessage = _parseVesselPositionMessage(message)
  const state = getState()
  const vessel = vesselSelector(state, parsedMessage.mmsi)
  if (!vessel) return
  const bbox = portBBoxSelector(state)
  if (!ruler.insideBBox(parsedMessage.coordinates, bbox)) return
  const newPosition = copyVesselPosition(Object.assign({}, parsedMessage, computePosition(vessel, parsedMessage.coordinates, parsedMessage.heading)))
  vessel.positions.push(newPosition)
  vessel.positions.sort((a, b) => a.timestamp - b.timestamp);
}


export const vesselsMdls = [
  getVesselsMdl,
  setVesselsMdl,
  updateVesselPositionMdl,
]

function _parseVesselPositionMessage(message) {
  return {
    coordinates: [message.x, message.y],
    heading: message.h,
    mmsi: message.m,
    speed: message.s,
    timestamp: message.ts,
  }
}
