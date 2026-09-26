// About → "What I carried": one place per city.
//
// ADD YOUR PHOTOS HERE. Put files in /public/about/ and list them below, e.g.
//   photos: ['/about/amd-1.jpg', '/about/amd-2.jpg']
// Optional short clip (5–10s, landscape) that plays as you scroll:
//   video: '/about/yhz-walk.mp4'
// Until a place has photos, it falls back to that city's frame from the Journey film.

export const PLACES = {
  AMD: {
    place: 'L.J. Institute of Engineering & Technology',
    where: 'B.E. in Information & Communication Technology, LJIET',
    first: 'First jobs: an online store for a jewellery business, Java at NovusCode',
    photos: ['/about/amd-1.jpg', '/about/amd-2.jpg'],
    video: null,
    doc: {
      kind: 'Student card',
      org: 'L.J. Institute of Engineering & Technology',
      line: 'B.E. · Information & Communication Technology',
      city: 'Ahmedabad, India',
    },
  },
  YHZ: {
    place: 'Dalhousie University',
    where: "Master's in Applied Computer Science, Dalhousie University",
    first: 'Went deep on machine learning and distributed systems',
    photos: ['/about/yhz-1.jpg', '/about/yhz-2.jpg', '/about/yhz-3.jpg'],
    video: null,
    doc: {
      kind: 'Student card',
      org: 'Dalhousie University',
      line: 'Master of Applied Computer Science',
      city: 'Halifax, Nova Scotia',
    },
  },
  YUL: {
    place: 'Intact Financial, Montréal office',
    where: 'AI Developer Intern, Intact Financial',
    first: 'First time shipping ML into production',
    photos: ['/about/yul-1.jpg', '/about/yul-2.jpg'],
    video: null,
    doc: {
      kind: 'Intern badge',
      org: 'Intact Financial',
      line: 'AI Developer Intern · Jan–Apr 2023',
      city: 'Montréal, Québec',
    },
  },
  YYZ: {
    place: 'Intact Financial, Toronto office',
    where: 'AI Developer → AI Developer II, Intact Financial',
    first: 'Streaming pipelines, platform migration, $500K+ saved',
    photos: ['/about/yyz-1.jpg', '/about/yyz-2.jpg'],
    video: null,
    doc: {
      kind: 'Employee badge',
      org: 'Intact Financial',
      line: 'AI Developer II',
      city: 'Toronto, Ontario',
    },
  },
}
