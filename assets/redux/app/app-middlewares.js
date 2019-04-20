import * as actions from '../actions.js'
import { updatePage } from './app-actions.js'
import { getVessels } from '../vessels/vessels-actions.js'

export const loggerMdl = () => next => action => {
  // console.log(action.type)
  next(action)
}

export const navigateMdl = ({ dispatch }) => next => action => {
  next(action)
  if (action.type !== actions.NAVIGATE) return
  const routeLevels = _parsePath(action.payload.path)
  _loadPage(routeLevels)
  dispatch(updatePage(routeLevels[0]))
  if (routeLevels[0] == 'map') dispatch(getVessels())
}

export const appMdls = [
  // loggerMdl,
  navigateMdl,
]

const _parsePath = path => {
  switch(path) {
    case '/':
      window.history.replaceState({}, 'Hamburg - Live', '/map')
      return [ 'map' ]
      break
    default:
      return path.split('/').slice(1)
      break
  }
}

const _loadPage = routeLevels => {
  switch(routeLevels[0]) {
    case 'map':
      import('../../pages/map/map-page.js')
      break
    case 'about':
      import('../../pages/about-page.js')
      break
    case 'impressum':
      import('../../pages/impressum-page.js')
      break
    default:
      routeLevels[0] = 'shipahoy404'
      import('../../pages/ship-ahoy-404-page.js')
      break
  }
}
