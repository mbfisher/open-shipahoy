import { createSelector } from 'reselect'
import { VESSEL_GROUPS } from '../../const.js'

const vessels = state => state.vessels
const mmsi = (state, mmsi) => mmsi

export const followedVesselSelector = createSelector(
  vessels,
  vessels => vessels.byMmsi[vessels.followedMmsi]
)

export const vesselSelector = createSelector(
  [vessels, mmsi],
  (vessels, mmsi) => vessels.byMmsi[mmsi]
)

export const selectedVesselSelector = createSelector(
  vessels,
  vessels => vessels.byMmsi[vessels.selectedMmsi]
)

export const vesselsSelector = createSelector(
  vessels,
  vessels => vessels.allMmsis.map(mmsi => vessels.byMmsi[mmsi])
)

export const vesselGroupsSelector = createSelector(
  vesselsSelector,
  vessels => {
    const vesselsGroups = VESSEL_GROUPS.map((group, index) => {
      return Object.assign({ index, vessels: [] }, group)
    })
    vessels.forEach(vessel => {
      vesselsGroups[vessel.group.index].vessels.push(Object.assign({}, vessel))
    })
    vesselsGroups.forEach(vesselGroup => {
      vesselGroup.vessels.sort((a, b) => a.name.localeCompare(b.name))
    })
    return vesselsGroups.filter(vesselGroup => vesselGroup.vessels.length > 0)
  }
)
