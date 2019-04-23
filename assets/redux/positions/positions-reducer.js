import * as actions from '../actions.js'

const INITIAL_STATE = {
  tree: rbush().load([])
}

const positions = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.SET_POSITIONS:
    case actions.UPDATE_POSITIONS:
      var { tree } = payload
      return { ...state, tree }

    default:
      return state
  }
}

export default positions
