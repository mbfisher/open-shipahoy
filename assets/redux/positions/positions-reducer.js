import * as actions from '../actions.js'
// import moment from 'moment'

const INITIAL_STATE = {
  // latestTimestamp: moment.utc().valueOf(),
  tree: rbush().load([])
}

const positions = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.SET_POSITIONS:
    case actions.UPDATE_POSITIONS:
      var { tree } = payload
      return { ...state, tree }

    // case actions.SET_LATEST_POSITION_TIMESTAMP:
    //   var { timstamp } = payload
    //   return { ...state,
    //     latestTimestamp: timestamp
    //   }

    default:
      return state
  }
}

export default positions
