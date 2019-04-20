let p // prefix
p = '[app]'
export const ERROR = `${p} ERROR`
export const NAVIGATE = `${p} NAVIGATE`
export const UPDATE_PAGE = `${p} UPDATE_PAGE`

p = '[vessels]'
export const FOLLOW_VESSEL = `${p} FOLLOW`
export const GET_VESSELS = `${p} GET_ALL`
export const GET_VESSELS_FAILURE = `${p} GET_FAILURE`
export const GET_VESSELS_REQUEST = `${p} GET_REQUEST`
export const GET_VESSELS_SUCCESS = `${p} GET_SUCCESS`
export const RESET_VESSELS = `${p} RESET_ALL`
export const SELECT_VESSEL = `${p} SELECT_ONE`
export const SET_VESSELS = `${p} SET_ALL`
export const UNFOLLOW_VESSEL = `${p} UNFOLLOW`
export const UPDATE_VESSEL_POSITION = `${p} UPDATE_POSITION`
export const UNSELECT_VESSEL = `${p} UNSELECT`

p = '[positions]'
export const GET_POSITIONS = `${p} GET`
export const SET_LATEST_POSITION_TIMESTAMP = `${p} SET_LATEST_TIMESTAMP`
export const SET_POSITIONS = `${p} SET_ALL`
export const SUBSCRIBE_POSITIONS = `${p} SUBSCRIBE`
export const UPDATE_POSITIONS = `${p} UPDATE_ALL`
