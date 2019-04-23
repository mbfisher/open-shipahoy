import { VESSEL_GROUPS, VESSEL_TYPES } from './const.js'

const frameDuration = 200
// animationTimestamp = moment.utc().valueOf()
const timeAdjustmentRatio = 1 / 500

export const computePositionsTree = (oldTree, animationTimestamp) => {
  const newTreeElements = [];
  oldTree.all().forEach(element => {
    const vessel = element.vessel;
    const vesselTimestamp = vessel.animationPosition.timestamp;
    let timeStep = frameDuration;

    // try to catch up vessel to animation
    const timeDiff = animationTimestamp - vesselTimestamp;
    if (timeDiff > 0) timeStep += parseInt(timeDiff * timeAdjustmentRatio)

    // new timestamp for the vessel
    const timestamp = vesselTimestamp + timeStep;
    const positionIndex = vessel.positions.findIndex(position => position.timestamp > timestamp);
    if (positionIndex >= 0) {
      // starting AIS position from which we calculate interpolated position
      const start = vessel.positions[positionIndex - 1];
      // ending AIS position to which we calculate interpolated position
      const end = vessel.positions[positionIndex];
      // progress between start and end the vessel has done
      const progress = (timestamp - start.timestamp) / (end.timestamp - start.timestamp);
      const line = [start.coordinates, end.coordinates];
      const distance = ruler.lineDistance(line);
      // compute interpolated position properties
      let coordinates = ruler.along(line, distance * progress);
      coordinates = [
        Number.parseFloat(coordinates[0]),
        Number.parseFloat(coordinates[1])
      ]
      const speed = start.speed + (end.speed - start.speed) * progress;
      const directionDiff = computeDirectionDifference(end.heading, start.heading);
      const heading = start.heading + directionDiff * progress;

      const { polygon, center, bounds } = computePosition(vessel, coordinates, heading);

      vessel.animationPosition = {coordinates, timestamp, speed, heading, center, polygon};

      newTreeElements.push({
        minX: bounds[0],
        minY: bounds[1],
        maxX: bounds[2],
        maxY: bounds[3],
        vessel,
      });
    } else {
      newTreeElements.push(element)
    }
  });
  oldTree.clear()
  return rbush().load(newTreeElements)
}

export const mapVessel = vessel => {

  const name = _getVesselName(vessel)
  const type = _getVesselType(vessel)
  const group = _getVesselGroup(vessel)

  let a = typeof vessel.a == 'number' ? vessel.a : 20
  let b = typeof vessel.b == 'number' ? vessel.b : 20
  let c = typeof vessel.c == 'number' ? vessel.c : 5
  let d = typeof vessel.d == 'number' ? vessel.d : 5
  const length = a + b
  const width = c + d
  if (!a && !b && !c && !d) {
    a = b = 20
    c = d = 5
  }

  const newVessel = {
    imo: vessel.i,
    mmsi: vessel.m,
    name,
    length,
    width,
    a,
    b,
    c,
    d,
    eta: vessel.e,
    destination: vessel.de,
    draft: vessel.dr,
    type,
    group,
  }

  const timestamp = vessel.ts
  const coordinates = [ vessel.x, vessel.y ]
  const heading = vessel.h
  const speed = vessel.s

  const {
    polygon,
    center,
    bounds
  } = computePosition(newVessel, coordinates, heading)

  const animationPosition = {
    coordinates,
    heading,
    speed,
    timestamp,
    polygon,
    center,
    bounds,
  }

  return Object.assign({}, newVessel, {
    animationPosition,
    positions: [
      copyVesselPosition(animationPosition)
    ],
  })
}

export const computeDirectionDifference = (first, second) => {
  let diff = first - second
  if (diff > 180) {
    diff -= 360
  } else if (diff < -180)  {
    diff += 360
  }
  return diff
}

export const  findLatestTimestamp = positions => {
  return positions.reduce((latestTimestamp, position) => {
    return Math.max(latestTimestamp, position.timestamp)
  }, -Infinity)
}

export const copyVesselPosition = position => {
  return {
    coordinates: position.coordinates.slice(),
    heading: position.heading,
    speed: position.speed,
    timestamp: position.timestamp,
    center: position.center.slice(),
    polygon: position.polygon.slice(),
  }
}

export const computePosition = (vessel, coordinates, heading) => {
  const a = vessel.a
  const b = vessel.b
  const c = vessel.c
  const d = vessel.d

  const deg = 180 / Math.PI
  const acAngle = _findAngle(c, a) * deg

  const ac = ruler.destination(
    coordinates,
    Math.hypot(c, a),
    heading + acAngle
  )

  const bcAngle = _findAngle(c, b) * deg

  const bc = ruler.destination(
    coordinates,
    Math.hypot(c, b),
    heading - bcAngle + 180
  )

  const adAngle = _findAngle(d, a) * deg

  const ad = ruler.destination(
    coordinates,
    Math.hypot(d, a),
    heading - adAngle
  )

  const bdAngle = _findAngle(d, b) * deg

  const bd = ruler.destination(
    coordinates,
    Math.hypot(d, b),
    heading + bdAngle - 180
  )

  const halfWidth = vessel.width / 2

  const nose = ruler.along([ad, ac], halfWidth)
  const ac1 = ruler.along([bc, ac], vessel.length - halfWidth)
  const ad1 = ruler.along([bd, ad], vessel.length - halfWidth)

  const polygon = [nose, ac1, bc, bd, ad1]
  const diagonal = ruler.distance(ac, bd)
  const center = ruler.along([ac, bd], diagonal / 2)
  const bounds = bbox(polygon)
  return { polygon, center, bounds }
}

export const bbox = coordinates => {
  const result = [ Infinity, Infinity, -Infinity, -Infinity ]
  coordinates.forEach((coord) => {
    if (result[0] > coord[0]) result[0] = coord[0]
    if (result[1] > coord[1]) result[1] = coord[1]
    if (result[2] < coord[0]) result[2] = coord[0]
    if (result[3] < coord[1]) result[3] = coord[1]
  })
  return result
}

function _findAngle(oposite, adjacent) {
  let angle = Math.atan(oposite / adjacent)
  if (isNaN(angle)) angle = 0
  return angle
}

function _getVesselName(vessel) {
  if (!vessel.n) return 'no name available'
  return `${vessel.n.substring(0, 1)}${vessel.n.substring(1).toLowerCase()}`
}

function _getVesselType(vessel) {
  const id = vessel.t;
  let name = 'Undefined'
  if (VESSEL_TYPES[id]) name = VESSEL_TYPES[id].toLowerCase()
  return { id, name }
}

function _getVesselGroup(vessel) {
  const index = _getVesselGroupIndex(vessel.t)
  return Object.assign({ index }, VESSEL_GROUPS[index])
}

function _getVesselGroupIndex(type) {
  if (type == 30) { // fishing
    return 0
  } else if (type > 39 && type < 50) { // high speed craft
    return 1
  } else if (type > 79 && type < 90) { // tanker
    return 2
  } else if (type > 69 && type < 80) { // cargo
    return 3
  } else if (type > 59 && type < 70) { // passenger
    return 4
  } else if ([37, 36].includes(type)) { // pleasure craft
    return 5
  } else if ([52, 31, 32, 33].includes(type) || (type >= 50 && type <= 59)) { // tugs and special craft
    return 6
  }
  return 7 // other
}
