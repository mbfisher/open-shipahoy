import * as actions from '../actions.js'
import moment from 'moment'
import { updateVesselPosition } from '../vessels/vessels-actions.js'
import { showError } from '../app/app-actions.js'
import { updatePositions } from './positions-actions.js'
import { positionsTreeSelector } from './positions-selectors.js'
import { computePositionsTree } from '../../helpers.js'
const socket = io()

export const getPositionsMdl = ({ dispatch, getState }) => next => action => {
  if (action.type === actions.GET_POSITIONS) {
    const state = getState()
    const oldTree = positionsTreeSelector(state)
    if (!oldTree || !oldTree.all() || !oldTree.all().length) return
  }
  next(action)
  if (action.type !== actions.GET_POSITIONS) return
  const state = getState()
  const oldTree = positionsTreeSelector(state)
  const newTree = computePositionsTree(oldTree, moment().unix() * 1000)
  dispatch(updatePositions(newTree))
}

export const setPositionsMdl = ({ dispatch }) => next => action => {
  if (action.type === actions.SET_POSITIONS) {
    const { vessels } = action.payload
    const vesselPositions = vessels.map(vessel => vessel.animationPosition);
    const tree = rbush().load(vessels.map(vessel => {
      const [ minX, minY, maxX, maxY ] = vessel.animationPosition.bounds
      return { minX, minY, maxX, maxY, vessel }
    }))
    action.payload = { tree }
  }
  next(action)
}

export const subscribePositionsMdl = ({ dispatch, getState }) => next => action => {
  if (action.type === actions.SUBSCRIBE_POSITIONS) {
    const state = getState()
    const oldTree = positionsTreeSelector(state)
    if (!oldTree) return
  }
  next(action)
  if (action.type !== actions.SUBSCRIBE_POSITIONS) return
  socket.on('connect_error', () => dispatch(showError(new Error("Couldn't subscribe to vessel positions updates"))))
  socket.on('connect', () => console.log('connect'))
  socket.on('reconnect', () => console.log('reconnect'))
  socket.on('message', message => dispatch(updateVesselPosition(message)))
}

export const positionsMdls = [
  getPositionsMdl,
  setPositionsMdl,
  subscribePositionsMdl
]
