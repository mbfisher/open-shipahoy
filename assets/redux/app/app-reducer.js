import * as actions from '../actions.js'

const INITIAL_STATE = {
  errors: [],
  page: 'map',
  portBBox: ruler.bufferPoint([9.97052, 53.52676], 50000) // hamburg
}

const appReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.UPDATE_PAGE:
      var { page } = payload
      return { ...state, page }

    case actions.ERROR:
      var { error } = payload
      var errors = state.errors.slice()
      errors.push(error)
      return { ...state, errors }

    default:
      return state
  }
}

export default appReducer
