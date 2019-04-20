import * as actions from '../actions.js'

const INITIAL_STATE = {
  byMmsi: {},
  allMmsis: [],
  selectedMmsi: null,
  followedMmsi: null,
  isFetching: false,
}

const vesselsByMmsi = (state = INITIAL_STATE.byMmsi, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.RESET_VESSELS:
      return {}

    case actions.SET_VESSELS:
      var { vessels } = payload
      var newState = {}
      vessels.forEach(vessel => newState[vessel.mmsi] = vessel)
      return newState

    default:
      return state
  }
}

const vesselsAllMmsis = (state = INITIAL_STATE.allMmsis, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.RESET_VESSELS:
      return []

    case actions.SET_VESSELS:
      var { vessels } = payload
      return vessels.map(vessel => vessel.mmsi)

    default:
      return state
  }
}

const isFetchingVessels = (state = INITIAL_STATE.isFetching, action) => {
  switch (action.type) {
    case actions.GET_VESSELS_REQUEST:
      return true

    case actions.GET_VESSELS_FAILURE:
    case actions.GET_VESSELS_SUCCESS:
      return false
      break

    default:
      return state
  }
}

const selectedVessel = (state = INITIAL_STATE.selectedMmsi, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.SELECT_VESSEL:
      var { vessel } = payload
      return vessel.mmsi

    case actions.UNSELECT_VESSEL:
      return null

    default:
      return state
  }
}

const followedVessel = (state = INITIAL_STATE.followedMmsi, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.FOLLOW_VESSEL:
      var { vessel } = payload
      return vessel.mmsi

    case actions.UNFOLLOW_VESSEL:
      return null

    default:
      return state
  }
}


const vessels = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return {
        byMmsi: vesselsByMmsi(state.byMmsi, action),
        allMmsis: vesselsAllMmsis(state.allMmsis, action),
        isFetching: isFetchingVessels(state.isFetching, action),
        selectedMmsi: selectedVessel(state.selectedMmsi, action),
        followedMmsi: followedVessel(state.followedMmsi, action),
      }
  }
}

export default vessels

