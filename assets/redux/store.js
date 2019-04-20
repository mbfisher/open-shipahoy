import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore
} from 'redux'
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js'

import { appMdls } from './app/app-middlewares.js'
import { positionsMdls } from './positions/positions-middlewares.js'
import { vesselsMdls } from './vessels/vessels-middlewares.js'
import app from './app/app-reducer.js'
import positions from './positions/positions-reducer.js'
import vessels from './vessels/vessels-reducer.js'

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created)
// See the "Redux and state management" section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management
export const store = createStore(
  state => state,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  devCompose(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(
      ...appMdls,
      ...positionsMdls,
      ...vesselsMdls
    )
  )
)

// Initially loaded reducers.
store.addReducers({
  app,
  positions,
  vessels,
})
