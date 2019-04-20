import * as actions from '../actions.js'
import moment from 'moment'
import {
  updateVesselPosition,
} from '../vessels/vessels-actions.js'
import {
  // setLatestPositionTimestamp,
  updatePositions,
} from './positions-actions.js'
import {
  positionsTreeSelector,
} from './positions-selectors.js'
import {
  computePositionsTree
} from '../../helpers.js'
const socket = io()

socket.on('connect_error', () => {
  console.log('connect_error')
  // const text = 'Oops. Check your internet connection.'
  // if (this.$.toast.text == text) return
  // this.$.toast.text = text
  // this.$.toast.open()
})
socket.on('connect', () => {
  console.log('connect')
});
socket.on('reconnect', () => {
  console.log('reconnect')
  // this.$.toast.show('Reconnecting...');
  // this.dispatch('updateSelectTimestamp', moment().unix() * 1000);
});

export const getPositionsMdl = ({ dispatch, getState }) => next => action => {
  next(action)
  if (action.type !== actions.GET_POSITIONS) return
  const state = getState()
  const oldTree = positionsTreeSelector(state)
  if (!oldTree) return
  const newTree = computePositionsTree(oldTree, moment().unix() * 1000)
  dispatch(updatePositions(newTree))
}

// export const setLatestPositionTimestampMdl = ({ dispatch, getState }) => next => action => {
//   if (action.type === actions.SET_LATEST_POSITION_TIMESTAMP) {
//     const { timestamp } = action.payload
//     const state = getState()
//     if (timestamp <= latestPositionTimestampSelector(state)) return
//     next(action)
//   } else {
//     next(action)
//   }
// }

export const setPositionsMdl = ({ dispatch }) => next => action => {
  if (action.type === actions.SET_POSITIONS) {
    const { vessels } = action.payload
    const vesselPositions = vessels.map(vessel => vessel.animationPosition);
    // const latestTimestamp = _findLatestTimestamp(vesselPositions);
    // dispatch(setLatestPositionTimestamp(latestTimestamp))
    const tree = rbush().load(vessels.map(vessel => {
      const [ minX, minY, maxX, maxY ] = vessel.animationPosition.bounds
      return { minX, minY, maxX, maxY, vessel }
    }))
    action.payload = { tree }
  }
  next(action)
}

export const subscribePositionsMdl = ({ dispatch }) => next => action => {
  next(action)
  if (action.type !== actions.SUBSCRIBE_POSITIONS) return
  socket.on('message', message => dispatch(updateVesselPosition(message)))
}


export const positionsMdls = [
  getPositionsMdl,
  setPositionsMdl,
  subscribePositionsMdl
]


function _findLatestTimestamp(positions) {
  return positions.reduce((latestTimestamp, position) => {
    return Math.max(latestTimestamp, position.timestamp)
  }, -Infinity);
}
