import * as actions from '../actions.js'

export const navigate = path => {
  return {
    type: actions.NAVIGATE,
    payload: { path }
  }
}

export const showError = error => {
  return {
    type: actions.ERROR,
    payload: { error }
  }
}

export const updatePage = page => {
  return {
    type: actions.UPDATE_PAGE,
    payload: { page }
  }
}
