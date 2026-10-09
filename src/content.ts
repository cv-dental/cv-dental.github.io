// All page text lives here so it can be edited without touching the layout.

export const site = {
  title: 'Computer Vision for Oral & Maxillofacial Surgical Applications',
  tagline: 'AI-assisted 3D planning for jaw reconstruction surgery',
  affiliation: 'Department of Electrical & Electronic Engineering · University of Peradeniya',
  email: 'e21016@eng.pdn.ac.lk',
}

export const overview = [
  'Oral and maxillofacial surgery involves some of the most spatially complex procedures in modern medicine. Conditions such as jaw cancer, osteomyelitis and severe trauma can result in significant bone loss that demands intricate surgical reconstruction.',
  'This project explores computer vision and medical image processing to support surgeons in planning and executing these reconstructions, with a focus on the mandible (lower jaw). The aim is to reduce reliance on time-intensive manual workflows and closed-source commercial software.',
]

export const exploring = [
  {
    title: 'Segmentation',
    text: 'Automatically identifying anatomical structures, such as the mandible and pathological regions, in CT and CBCT scans.',
  },
  {
    title: 'Defect localization',
    text: 'Detecting and localizing regions of bone defect or disease, laying the groundwork for automated surgical boundary identification.',
  },
  {
    title: 'Clinical data',
    text: 'Working with the Faculty of Dental Sciences to collect and annotate real clinical imaging data that is locally relevant.',
  },
]

export const outputs = [
  'Segmentation algorithms validated against publicly available clinical imaging data.',
  'A curated and annotated collection of clinical dental images from the local dental faculty.',
  'A prototype for identifying and localizing regions of mandibular defect from imaging data.',
]

export type Student = { name: string; photo: string }

export const students: Student[] = [
  { name: 'S.L. Adams', photo: '/img/team-adams.webp' },
  { name: 'S.K.M.D.T. Ganegoda', photo: '/img/team-ganegoda.webp' },
  { name: 'S.D. Peterson', photo: '/img/team-peterson.webp' },
]

export type Supervisor = { name: string; dept: string; url: string }

export const supervisors: Supervisor[] = [
  {
    name: 'Prof. Parakrama Ekanayake',
    dept: 'Dept. of Electrical and Electronic Engineering',
    url: 'https://web2.ee.pdn.ac.lk/people/ParakramaE',
  },
  {
    name: 'Prof. Roshan Godaliyadda',
    dept: 'Dept. of Electrical and Electronic Engineering',
    url: 'https://web2.ee.pdn.ac.lk/people/RoshanG',
  },
]

export const externalSupervisors: Supervisor[] = [
  {
    name: 'Prof. R.G. Ragel',
    dept: 'Dept. of Computer Engineering',
    url: 'https://people.ce.pdn.ac.lk/staff/academic/roshan-ragel/',
  },
  {
    name: 'Dr. C.D. Senanayake',
    dept: 'Dept. of Manufacturing and Industrial Engineering',
    url: 'https://eng.pdn.ac.lk/dmie/staff/DrCDSenanayake.html',
  },
  {
    name: 'Prof. A.M. Attygalla',
    dept: 'Oral & Maxillofacial Surgery, Faculty of Dental Sciences',
    url: 'https://dental.pdn.ac.lk/portfolio/prof-am-attygalla/',
  },
]
