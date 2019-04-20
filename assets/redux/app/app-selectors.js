import { createSelector } from 'reselect'

const app = state => state.app

export const errorsSelector = createSelector(
  app, app => app.errors
)

export const pageSelector = createSelector(
  app, app => app.page
)

export const portBBoxSelector = createSelector(
  app, app => app.portBBox
)
