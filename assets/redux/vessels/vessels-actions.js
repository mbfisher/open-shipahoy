import * as actions from '../actions.js'

export const followVessel = vessel => {
  return {
    type: actions.FOLLOW_VESSEL,
    payload: { vessel }
  }
}

export const getVessels = () => {
  return {
    type: actions.GET_VESSELS
  }
}

export const getVesselsFailure = error => {
  return {
    type: actions.GET_VESSELS_FAILURE,
    payload: { error }
  }
}

export const getVesselsRequest = () => {
  return {
    type: actions.GET_VESSELS_REQUEST
  }
}

export const getVesselsSuccess = () => {
  return {
    type: actions.GET_VESSELS_SUCCESS
  }
}

export const selectVessel = vessel => {
  return {
    type: actions.SELECT_VESSEL,
    payload: { vessel }
  }
}

export const setVessels = vessels => {
  return {
    type: actions.SET_VESSELS,
    payload: { vessels }
  }
}

export const unfollowVessel = () => {
  return {
    type: actions.UNFOLLOW_VESSEL
  }
}

export const updateVesselPosition = message => {
  return {
    type: actions.UPDATE_VESSEL_POSITION,
    payload: { message }
  }
}


export const unselectVessel = () => {
  return {
    type: actions.UNSELECT_VESSEL
  }
}

