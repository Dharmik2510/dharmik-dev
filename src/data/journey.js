// Chapter data for the cinematic chapter cards in the Journey section.

const VIDEO_BASE = 'https://pub-578c950a826349e8b17fa0100852d7d9.r2.dev/Videos'

export const CHAPTERS = [
  {
    id: 'amd',
    code: 'AMD',
    city: 'Ahmedabad',
    chapter: '01',
    title: 'FOUNDATION',
    kineticLines: [
      'CHAPTER 01',
      'AMD · AHMEDABAD',
      'BUILT THE BASE.',
      'WEB · BACKEND · CLOUD',
    ],
    metricChips: ['B.E. ICT', 'React', 'Node.js', 'AWS', 'Java'],
    videoSrc: `${VIDEO_BASE}/chapter-01-amd.mp4`,
    posterSrc: '/videos/posters/chapter-01-amd.jpg',
  },
  {
    id: 'yhz',
    code: 'YHZ',
    city: 'Halifax',
    chapter: '02',
    title: 'ENTERPRISE AI',
    kineticLines: [
      'CHAPTER 02',
      'YHZ · HALIFAX',
      'INSURANCE-SCALE AI.',
      'DATA · MODELS · GOVERNANCE',
    ],
    metricChips: ['Intact Internship', 'ML Pipelines', 'Enterprise Data'],
    videoSrc: `${VIDEO_BASE}/chapter-02-ns.mp4`,
    posterSrc: '/videos/posters/chapter-02-ns.jpg',
  },
  {
    id: 'yul',
    code: 'YUL',
    city: 'Montréal',
    chapter: '03',
    title: 'PRODUCTION ML',
    kineticLines: [
      'CHAPTER 03',
      'YUL · MONTRÉAL',
      'MODELS IN PROD.',
      'SCALE · RELIABILITY · IMPACT',
    ],
    metricChips: ['Insurance Data', 'Pipelines', 'Delivery'],
    videoSrc: `${VIDEO_BASE}/chapter-03-mntl.mp4`,
    posterSrc: '/videos/posters/chapter-03-mntl.jpg',
  },
  {
    id: 'yyz',
    code: 'YYZ',
    city: 'Toronto',
    chapter: '04',
    title: 'PRODUCTION IMPACT',
    kineticLines: [
      'CHAPTER 04',
      'YYZ · TORONTO',
      '$500K+ SAVED.',
      'DATABRICKS · SPARK · KAFKA · MLflow',
    ],
    metricChips: ['$500K+ Saved', 'Databricks', 'Spark', 'Kafka', 'MLflow'],
    videoSrc: `${VIDEO_BASE}/chapter-04-toronto.mp4`,
    posterSrc: '/videos/posters/chapter-04-toronto.jpg',
  },
]
