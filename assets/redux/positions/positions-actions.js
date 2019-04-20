import * as actions from '../actions.js'

export const getPositions = () => {
  return {
    type: actions.GET_POSITIONS
  }
}

// export const setLatestPositionTimestamp = timestamp => {
//   return {
//     type: actions.SET_LATEST_POSITION_TIMESTAMP,
//     payload: { timestamp }
//   }
// }

export const setPositions = vessels => {
  return {
    type: actions.SET_POSITIONS,
    payload: { vessels }
  }
}

export const subscribeToPositionsUpdate = () => {
  return {
    type: actions.SUBSCRIBE_POSITIONS
  }
}

export const updatePositions = tree => {
  return {
    type: actions.UPDATE_POSITIONS,
    payload: { tree }
  }
}
