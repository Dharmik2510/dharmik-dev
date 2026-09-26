// ── DHARMIK SONI — All Portfolio Data ──

import articlesJson from './articles.json'

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

export const IMPACT_METRICS = [
  {
    value: '$500K+',
    label: 'Saved in operating costs',
    detail: 'From tuning Spark jobs and Databricks clusters.',
  },
  {
    value: 'Real-time',
    label: 'Usage-based insurance',
    detail: 'Kafka pipelines that turn live driving data into insurance insights.',
  },
  {
    value: 'On-prem → Cloud',
    label: 'Platform migration',
    detail: 'Moved on-premise systems to Databricks, with Unity Catalog and MLflow for model governance.',
  },
  {
    value: '3+ yrs',
    label: 'At Intact Financial',
    detail: 'Building ML and data systems in production since 2023.',
  },
]

export const STORY_CHAPTERS = [
  {
    code: 'AMD',
    title: 'Foundation',
    kicker: 'Ahmedabad, India',
    outcome: 'Built the engineering base across web systems, backend services, cloud infrastructure, and applied algorithms.',
    proof: ['B.E. in Information and Communication Technology', 'React, Node.js, AWS, Java, REST APIs', 'Early production exposure through e-commerce and automation work'],
  },
  {
    code: 'YHZ',
    title: 'Expansion',
    kicker: 'Halifax, Dalhousie University',
    outcome: 'Moved into applied computer science, distributed systems, ML, and the Canadian technology market.',
    proof: ['M.Sc. in Applied Computer Science', 'AI/ML, data systems, and software architecture', 'Adapted technical depth to a new country and professional context'],
  },
  {
    code: 'YUL',
    title: 'Enterprise AI',
    kicker: 'Montréal, Intact Financial',
    outcome: 'Entered insurance-scale AI systems where models, pipelines, governance, and reliability all mattered.',
    proof: ['AI Developer Internship at Intact', 'Production ML pipeline contribution', 'First exposure to real insurance data and enterprise delivery standards'],
  },
  {
    code: 'YYZ',
    title: 'Production Impact',
    kicker: 'Toronto, AI Developer II',
    outcome: 'Now building and optimizing intelligent systems that support real decisions at scale.',
    proof: ['Databricks, Spark, Kafka, MLflow, Unity Catalog', '$500K+ savings from platform optimization', 'Co-founder of CareerCurate for immigrant and student career support'],
  },
]

export const EXPERIENCE = [
  {
    role: 'AI Developer II',
    badge: 'current',
    company: 'Intact Financial Corporation',
    meta: 'Toronto, Ontario',
    bullets: [
      'Moved on-premise systems onto Databricks, with Unity Catalog and MLflow now managing the model lifecycle.',
      'Tuned Spark jobs and Databricks clusters, saving over $500K in operating costs.',
      'Built dashboards the team uses to monitor and debug production data pipelines.',
    ],
  },
  {
    role: 'AI Developer',
    badge: 'past',
    company: 'Intact Financial Corporation',
    meta: 'Toronto, Ontario',
    bullets: [
      'Built the real-time Kafka pipelines behind usage-based insurance, turning driving data into feedback for customers.',
      'Ran on-premise microservices in Spring Boot and Python, connected through Kafka, S3 and Kinesis.',
      'Cut latency and raised throughput across the data processing pipelines.',
    ],
  },
  {
    role: 'AI Developer Intern',
    badge: 'past',
    company: 'Intact Financial Corporation',
    meta: 'Montréal, Québec',
    bullets: [
      'My first enterprise AI role: I worked on live ML pipelines from the first weeks.',
      'Applied what I learned at Dalhousie to real insurance data.',
    ],
  },
  {
    role: 'Co-Founder',
    badge: 'current',
    company: 'CareerCurate',
    meta: 'Greater Toronto Area',
    bullets: [
      'Co-founded a career platform for immigrants and international students starting out in Canada.',
      'We help with résumés, LinkedIn profiles, cover letters and referrals, and run a community for job seekers.',
    ],
  },
  {
    role: 'Java Developer',
    badge: 'past',
    company: 'NovusCode',
    meta: 'Ahmedabad, India',
    bullets: [
      'Wrote a script that alerted people when Covid-19 vaccine slots opened, so no one had to keep checking by hand.',
      'Refactored with object-oriented design patterns, improving code quality by 20%.',
      'Built REST APIs and connected them to an AngularJS front end.',
    ],
  },
  {
    role: 'Software Developer',
    badge: 'past',
    company: 'Swaminarayan Ornaments',
    meta: 'Ahmedabad, India',
    bullets: [
      'Built the jewellery store\'s online shop in React and Redux; sales grew 10%.',
      'Set up the AWS back end: Node.js and Express on EC2 and Lambda, with S3 and DynamoDB.',
      'Wrote a faster recommendation algorithm for jewellery suggestions.',
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

export const CAPABILITY_GROUPS = [
  {
    title: 'Production AI Systems',
    level: 'Primary',
    items: ['MLflow', 'Unity Catalog', 'Deep Learning', 'NLP', 'LLMs', 'Model Lifecycle'],
  },
  {
    title: 'Real-time Data Platforms',
    level: 'Primary',
    items: ['Apache Kafka', 'Spark', 'Databricks', 'AWS Kinesis', 'S3', 'Pipeline Observability'],
  },
  {
    title: 'Backend Engineering',
    level: 'Production',
    items: ['Python', 'Java', 'Spring Boot', 'Flask', 'Node.js', 'REST APIs'],
  },
  {
    title: 'AI Agents & Product Work',
    level: 'Applied',
    items: ['CrewAI', 'LangChain', 'LangGraph', 'OpenAI', 'React', 'FastAPI'],
  },
]

export const CERTIFICATIONS = [
  { name: 'Databricks Certified Associate', org: 'Apache Spark 3.0' },
  { name: 'Oracle Certified Professional', org: 'Java SE 6 Programmer' },
  { name: 'Kafka Basics', org: 'Apache Kafka' },
  { name: 'Neural Networks & Deep Learning', org: 'Deep Learning AI' },
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
    desc: 'Interactive platform where two AI agents, a bull and a bear, debate stock day-trading viability using real-time data, technical indicators (RSI, MACD, Bollinger Bands), and GPT-powered news sentiment — culminating in a Chief Risk Officer verdict.',
    problem: 'Retail market decisions are noisy and emotionally biased.',
    approach: 'Two specialist agents debate opposing theses before a risk agent issues a verdict.',
    outcome: 'A transparent decision flow that exposes signal, uncertainty, and risk tradeoffs.',
    stack: ['Python', 'FastAPI', 'CrewAI', 'React', 'OpenAI', 'SSE Streaming'],
    link: 'https://github.com/Dharmik2510/ai-trading-debate-poc',
  },
  {
    id: '002',
    name: 'OrnateOS',
    featured: true,
    desc: 'Multilingual voice-to-ledger SaaS for jewellery businesses — owners get a private workspace for memos, inventory, maker orders, and per-karigar dashboards. Record via voice, receipt photo, or text in Gujarati, Hindi, or English.',
    problem: 'Traditional jewellery shops run on paper memos, verbal orders, and scattered maker tracking.',
    approach: 'Multi-tenant Supabase backend with Whisper STT, vision OCR, and GPT-structured intake into a unified ledger.',
    outcome: 'Real-time inventory visibility, maker turnaround tracking, and multilingual capture without changing how owners work.',
    stack: ['React', 'Vite', 'Supabase', 'Whisper', 'GPT', 'Cloudflare R2'],
    link: 'https://github.com/Dharmik2510/ornateos',
  },
  {
    id: '003',
    name: 'Swaminarayan Ornaments',
    featured: false,
    desc: 'Luxury digital showroom for a heritage jewellery brand — immersive browsing without transactional clutter. Curated collections, 3D product presentation, and brand-focused storytelling with emerald-and-cream identity and custom Swaminarayan Tilak motifs.',
    problem: 'High-end jewellery brands need a digital presence that feels like a showroom, not a discount storefront.',
    approach: 'Next.js showroom with GSAP animations, Three.js product views, and Firebase-backed catalog management.',
    outcome: 'A premium brand experience that lets customers explore craftsmanship without buy-button noise.',
    stack: ['Next.js', 'React', 'Three.js', 'GSAP', 'Firebase', 'Tailwind CSS'],
    link: 'https://github.com/Dharmik2510/swaminarayan-ornaments',
  },
]

export const ARTICLES = articlesJson

export const TICKER_ITEMS = [
  ['ROLE', 'AI Developer II'],
  ['IMPACT', '$500K+ operational savings'],
  ['PLATFORM', 'Databricks · Spark · Kafka'],
  ['GOVERNANCE', 'MLflow · Unity Catalog'],
  ['SYSTEMS', 'Streaming · Backend · Observability'],
  ['PRODUCT', 'CareerCurate co-founder'],
  ['STACK', 'Python · Java · React · FastAPI'],
  ['CERTS', 'Databricks · Oracle Java · Kafka · Deep Learning'],
]
