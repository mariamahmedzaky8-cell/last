export type MissionId = 'opportunity' | 'insight' | 'apollo'

export type Mission = {
  id: MissionId
  index: string
  name: string
  site: string
  body: string
  image: string
  imageAlt: string
  locked: boolean
  blurb?: string
}

export const MISSIONS: Mission[] = [
  {
    id: 'insight',
    index: 'MISSION 02',
    name: 'InSight',
    site: 'Elysium Planitia',
    body: 'Mars',
    image: '/images/archives/insight.png',
    imageAlt: 'Artistic render of a stationary lander with round solar arrays on a flat Martian plain',
    locked: false,
  },
  {
    id: 'opportunity',
    index: 'MISSION 01',
    name: 'Opportunity',
    site: 'Meridiani Planum',
    body: 'Mars',
    image: '/images/archives/opportunity.png',
    imageAlt: 'Artistic render of a six-wheeled rover on the dusty orange plains of Mars at sunset',
    locked: false,
    blurb:
      'Fourteen years after touching down, the rover’s transmissions fell silent during a planet-wide dust storm. Trace the final signals and reconstruct what it saw in its last days on the plains.',
  },
  {
    id: 'apollo',
    index: 'MISSION 03',
    name: 'Apollo',
    site: 'Tranquility Base',
    body: 'Moon',
    image: '/images/archives/apollo.png',
    imageAlt: 'Artistic render of a lunar module and an astronaut on the grey lunar surface with Earth in the sky',
    locked: false,
  },
]

/** Publicly documented NASA/JPL mission history for the Mars Exploration Rover Opportunity (MER-B). */
export const OPPORTUNITY_FACTS = [
  { label: 'Launch', value: 'July 7, 2003' },
  { label: 'Landing', value: 'January 25, 2004' },
  { label: 'Last communication', value: 'June 10, 2018' },
  { label: 'Planned mission', value: '90 sols' },
]

export const OPPORTUNITY_OVERVIEW =
  'Opportunity was the second of NASA’s twin Mars Exploration Rovers. It launched from Cape Canaveral aboard a Delta II rocket, landed inside Eagle crater on Meridiani Planum, and was designed for a 90-sol mission. It kept operating for more than fourteen years, until a planet-encircling dust storm in 2018 cut off its solar power.'

export const OPPORTUNITY_OBJECTIVES = [
  'Search for rocks and soils that hold clues to past water activity on Mars.',
  'Determine the distribution and composition of minerals, rocks, and soils near the landing site.',
  'Study the geologic processes that shaped the local terrain.',
  'Assess whether past environments could have been suitable for life.',
]

export const OPPORTUNITY_ROVER = [
  { label: 'Designation', value: 'MER-B' },
  { label: 'Mission', value: 'Mars Exploration Rover' },
  { label: 'Power', value: 'Solar arrays + batteries' },
  { label: 'Mobility', value: 'Six-wheel rocker-bogie' },
  { label: 'Operated by', value: 'NASA / JPL' },
  { label: 'Mission end', value: 'Declared Feb 13, 2019' },
]

export const OPPORTUNITY_INSTRUMENTS = [
  { name: 'Pancam', detail: 'Panoramic stereo color cameras on the mast for landscape and geology imaging.' },
  { name: 'Mini-TES', detail: 'Miniature Thermal Emission Spectrometer for identifying minerals from a distance.' },
  { name: 'Mössbauer Spectrometer', detail: 'Arm-mounted instrument for identifying iron-bearing minerals.' },
  { name: 'APXS', detail: 'Alpha Particle X-ray Spectrometer for measuring elemental composition.' },
  { name: 'Microscopic Imager', detail: 'Close-up camera for examining fine-scale rock and soil textures.' },
  { name: 'Rock Abrasion Tool', detail: 'Grinder that exposed fresh rock interiors for study.' },
]

export const OPPORTUNITY_CONTEXT =
  'Opportunity and its twin, Spirit, followed Sojourner (1997) as NASA’s next rovers on Mars. Opportunity’s discovery of hematite-rich spherules, nicknamed “blueberries,” helped establish that liquid water once existed at Meridiani Planum. Its endurance set the record for the longest distance driven on another world at the time.'

export type TraverseStop = {
  year: string
  site: string
  note: string
}

export const TRAVERSE: TraverseStop[] = [
  { year: '2004', site: 'Eagle crater', note: 'Landing site. Layered outcrop and hematite spherules observed.' },
  { year: '2004', site: 'Endurance crater', note: 'Months spent studying exposed sedimentary layers.' },
  { year: '2005', site: 'Purgatory dune', note: 'Rover embedded in a sand ripple for weeks before driving free.' },
  { year: '2006–2008', site: 'Victoria crater', note: 'Explored the rim and descended into the crater.' },
  { year: '2011', site: 'Endeavour crater', note: 'Arrived after a multi-year drive across the plains.' },
  { year: '2018', site: 'Perseverance Valley', note: 'Final work site on Endeavour’s western rim.' },
]

export const TRAVERSE_DISTANCE = '45.16 km (28.06 mi)'

export type SignalLog = {
  id: string
  stamp: string
  kind: 'history' | 'fiction'
  title: string
  body: string
}

export const SIGNAL_LOGS: SignalLog[] = [
  {
    id: 'landing',
    stamp: '2004-01-25',
    kind: 'history',
    title: 'Landing confirmed',
    body: 'Opportunity bounced to a stop inside Eagle crater on Meridiani Planum. Its first images showed exposed bedrock close to the landing site.',
  },
  {
    id: 'storm',
    stamp: '2018-06',
    kind: 'history',
    title: 'Dust storm intensifies',
    body: 'A dust storm that eventually encircled the planet blocked sunlight at Perseverance Valley. The rover entered a low-power state.',
  },
  {
    id: 'last',
    stamp: '2018-06-10',
    kind: 'history',
    title: 'Last communication',
    body: 'Mission controllers received the final transmission from Opportunity. Recovery attempts continued for months.',
  },
  {
    id: 'end',
    stamp: '2019-02-13',
    kind: 'history',
    title: 'Mission declared complete',
    body: 'NASA announced the end of the mission after more than a thousand unanswered commands.',
  },
  {
    id: 'm07-echo',
    stamp: 'M-07 // CYCLE 0',
    kind: 'fiction',
    title: 'Echo detected',
    body: 'Outpost M-07 picks up a faint pattern on a channel once used by the rover. Origin unknown. Investigation authorized.',
  },
]

export type MediaItem = {
  src: string
  title: string
  caption: string
  credit: string
}

export const MEDIA: MediaItem[] = [
  {
    src: '/images/archives/opportunity.png',
    title: 'Rover on the plains',
    caption: 'An interpretive scene of a Mars Exploration Rover on Meridiani Planum at sunset.',
    credit: 'Artistic render, not a NASA photograph',
  },
  {
    src: '/images/archives/chamber.png',
    title: 'Outpost M-07 archive vault',
    caption: 'The fictional research chamber where the investigation takes place.',
    credit: 'Fictional environment art',
  },
  {
    src: '/images/mars-outpost-bg.png',
    title: 'Outpost exterior',
    caption: 'Fictional Mars outpost used as the game’s main setting.',
    credit: 'Fictional environment art',
  },
]
