import { createSelector } from 'reselect'

const positions = state => state.positions

export const positionsTreeSelector = createSelector(
  positions,
  positions => positions.tree
)

export const latestPostionTimestampSelector = createSelector(
  positions,
  positions => positions.latestTimestamp
)
