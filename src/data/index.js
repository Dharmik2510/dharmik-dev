// ── DHARMIK SONI — All Portfolio Data ──

export const PERSONAL = {
  name: 'Dharmik Soni',
  role: 'AI Developer II',
  company: 'Intact Financial Corporation',
  location: 'Toronto, Ontario, Canada',
  phone: '+1 902-989-2923',
  email: 'dhsoni2510@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dharmik-soni-a385131a0',
  github: 'https://github.com/Dharmik2510',
  medium: 'https://medium.com/@dhsoni2510',
  summary: `AI Developer with a passion for building intelligent systems that push the boundaries of technology. Specializing in real-time data pipelines, machine learning, and distributed systems at enterprise scale.`,
}

export const ROUTE = [
  { code: 'AMD', city: 'Ahmedabad', country: 'India', flag: '🇮🇳', active: false },
  { code: 'YHZ', city: 'Halifax', country: 'Canada', flag: '🇨🇦', active: false },
  { code: 'YUL', city: 'Montréal', country: 'Canada', flag: '🇨🇦', active: false },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', flag: '🇨🇦', active: true },
]

export const WAYPOINTS = [
  {
    code: 'AMD',
    city: 'Ahmedabad, India',
    type: 'origin',
    badge: 'DEPARTURE',
    desc: 'Where it all began. B.E in Information and Communication Technology at Gujarat Technological University. First dev roles at Swaminarayan Ornaments and NovusCode. Built the foundation in React, Node, AWS, and Java.',
  },
  {
    code: 'YHZ',
    city: 'Halifax, Nova Scotia',
    type: 'transit',
    badge: 'WAYPOINT α',
    desc: "Master's in Applied Computer Science at Dalhousie University. Deepened expertise in AI/ML, distributed systems, and navigated the Canadian tech landscape.",
  },
  {
    code: 'YUL',
    city: 'Montréal, Québec',
    type: 'transit',
    badge: 'WAYPOINT β',
    desc: 'AI Developer Intern at Intact Financial Corporation (Jan–Apr 2023). First enterprise AI experience — real systems, real scale, real insurance data.',
  },
  {
    code: 'YYZ',
    city: 'Toronto, Ontario',
    type: 'dest',
    badge: 'DESTINATION',
    desc: 'AI Developer → AI Developer II at Intact Financial. 3+ years building intelligent systems. Co-founded CareerCurate. Toronto is home — permanently landed.',
  },
]

export const EXPERIENCE = [
  {
    role: 'AI Developer II',
    badge: 'current',
    company: 'Intact Financial Corporation',
    meta: 'Toronto, Ontario',
    bullets: [
      'Spearheaded the migration of complex on-premise architectures to Databricks, deeply integrating Unity Catalog and MLflow to streamline model lifecycle management.',
      'Engineered advanced Spark code optimizations and cluster tuning strategies, generating $500K+ in operational savings.',
      'Designed and deployed autonomous AI agents to intelligently automate, monitor, and debug operational data pipelines.',
    ],
  },
  {
    role: 'AI Developer',
    badge: 'past',
    company: 'Intact Financial Corporation',
    meta: 'Toronto, Ontario',
    bullets: [
      'Architected real-time data streaming pipelines for Usage-Based Insurance products using Apache Kafka, delivering instantaneous driving behavior insights to users.',
      'Built and managed highly scalable on-premise microservice architectures leveraging Spring Boot, Python, Kafka, AWS S3, and AWS Kinesis.',
      'Optimized critical system architectures and data processing pipelines to drastically reduce latency and enhance overall throughput.',
    ],
  },
  {
    role: 'AI Developer Intern',
    badge: 'past',
    company: 'Intact Financial Corporation',
    meta: 'Montréal, Québec',
    bullets: [
      'First enterprise AI role — onboarded into production systems and immediately contributed to live ML pipelines.',
      'Applied graduate-level machine learning skills to real insurance data problems at scale.',
    ],
  },
  {
    role: 'Co-Founder',
    badge: 'current',
    company: 'CareerCurate',
    meta: 'Greater Toronto Area',
    bullets: [
      'Co-founded a career development platform for immigrants and international students entering the Canadian workforce.',
      'Services: Resume & LinkedIn optimization, cover letters, job application references, and a thriving CareerCurate community.',
    ],
  },
  {
    role: 'Java Developer',
    badge: 'past',
    company: 'NovusCode',
    meta: 'Ahmedabad, India',
    bullets: [
      'Developed Auto Covid-19 Vaccine Alert Script — 100% time saving vs. manual slot hunting.',
      'Implemented OOP design patterns, reduced technical debt by 2%, improved code quality by 20%.',
      'Built REST APIs tested via Postman; leveraged MVC with AngularJS for frontend integration.',
    ],
  },
  {
    role: 'Software Developer',
    badge: 'past',
    company: 'Swaminarayan Ornaments',
    meta: 'Ahmedabad, India',
    bullets: [
      'Built jewellery e-commerce with React.js + MaterialUI + Redux — drove 10% growth in sales.',
      'AWS IaaS architecture using S3, EC2, Lambda; Node.js/Express backend with DynamoDB.',
      'Built recommendation algorithm reducing time complexity for jewellery suggestions.',
    ],
  },
]

export const SKILLS = [
  {
    label: 'AI / ML',
    cls: 'c1',
    skills: ['Apache Kafka', 'Databricks', 'Deep Learning', 'Neural Networks', 'NLP', 'LLMs', 'CrewAI', 'LangChain', 'LangGraph', 'Google ADK'],
  },
  {
    label: 'Backend',
    cls: 'c2',
    skills: ['Python', 'Flask', 'Java', 'Node.js', 'Express.js', 'REST APIs', 'AngularJS'],
  },
  {
    label: 'Cloud & Data',
    cls: 'c3',
    skills: ['AWS EC2', 'S3', 'Lambda', 'DynamoDB', 'PostgreSQL', 'Redux', 'Docker'],
  },
  {
    label: 'Languages',
    cls: 'c4',
    skills: ['English (Professional)', 'Gujarati (Native)', 'Hindi (Professional)'],
  },
]

export const CERTIFICATIONS = [
  { icon: '⚡', name: 'Databricks Certified Associate', org: 'Apache Spark 3.0' },
  { icon: '☕', name: 'Oracle Certified Professional', org: 'Java SE 6 Programmer' },
  { icon: '📡', name: 'Kafka Basics', org: 'Apache Kafka' },
  { icon: '🧠', name: 'Neural Networks & Deep Learning', org: 'Deep Learning AI' },
]

export const EDUCATION = [
  {
    degree: "M.Sc",
    title: "Applied Computer Science",
    institution: "Dalhousie University",
    location: "Halifax, NS",
  },
  {
    degree: "B.E",
    title: "Information and Communication Technology",
    institution: "Gujarat Technological University",
    location: "Ahmedabad, India",
  },
]

export const PROJECTS = [
  {
    id: '001',
    name: 'AI Trading Debate Platform',
    featured: true,
    desc: 'Interactive platform where two AI agents (Bull 🐂 vs Bear 🐻) debate stock day-trading viability using real-time data, technical indicators (RSI, MACD, Bollinger Bands), and GPT-powered news sentiment — culminating in a Chief Risk Officer verdict.',
    stack: ['Python', 'FastAPI', 'CrewAI', 'React', 'OpenAI', 'SSE Streaming'],
    link: 'https://github.com/Dharmik2510/ai-trading-debate-poc',
  },
  {
    id: '002',
    name: 'Databricks Plan Optimizer',
    featured: true,
    desc: 'Developer tool that analyzes Spark DataFrame execution plans and surfaces potential optimizations — from inefficient joins to missing partitions. Built for the Spark community to debug and tune Databricks workloads.',
    stack: ['TypeScript', 'Databricks', 'Apache Spark', 'React'],
    link: 'https://github.com/Dharmik2510/databricks-plan-optimizer',
  },
]

export const ARTICLES = [
  {
    type: 'tech',
    title: 'The Trap of Delta Lake Time Travel: Why Your Structured Streaming Queries Keep Crashing',
    excerpt: 'Understanding the real relationship between VACUUM, startingTimestamp, and Parquet files in Databricks to prevent streaming crashes.',
    link: 'https://medium.com/@dhsoni2510/the-trap-of-delta-lake-time-travel-why-your-structured-streaming-queries-keep-crashing-dd12f7013868',
  },
  {
    type: 'tech',
    title: 'How We Slashed Structured Streaming Costs by 80% — And Made Batches Lightning Fast',
    excerpt: 'A case study on optimizing Databricks streaming pipelines for massive cost savings and performance gains at enterprise scale.',
    link: 'https://medium.com/@dhsoni2510/how-we-slashed-structured-streaming-costs-by-80-and-made-batches-lightning-fast-fc30a6df34bf',
  },
  {
    type: 'tech',
    title: 'Taming the Beast: Understanding and Preventing AttributeReference Memory Leaks in Apache Spark',
    excerpt: 'How AttributeReference objects can cause silent but deadly memory accumulation and OutOfMemoryError in production Spark jobs.',
    link: 'https://medium.com/@dhsoni2510/taming-the-beast-understanding-and-preventing-attributereference-memory-leaks-in-apache-spark-f99f3553afa0',
  },
  {
    type: 'tech',
    title: 'The Hidden Cost of Clean Code: Method Boundaries vs Performance in Databricks Streaming',
    excerpt: 'Analyzing the performance trade-offs between modular clean code and monolithic optimized chains in Spark streaming pipelines.',
    link: 'https://medium.com/@dhsoni2510/the-hidden-cost-of-clean-code-method-boundaries-vs-performance-in-databricks-streaming-27d8e46950e2',
  },
]

export const TICKER_ITEMS = [
  ['ORIGIN', 'Ahmedabad, India'],
  ['MASTERS', 'Dalhousie University · Halifax'],
  ['INTERNSHIP', 'Intact Financial · Montréal'],
  ['CURRENT', 'AI Developer II · Toronto'],
  ['COMPANY', 'Intact Financial Corporation'],
  ['CO-FOUNDER', 'CareerCurate'],
  ['STACK', 'Python · Kafka · Spark · Databricks · Flask'],
  ['CERTS', 'Databricks · Oracle Java · Kafka · Deep Learning'],
]
