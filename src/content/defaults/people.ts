import type { Person } from '../types';

/**
 * People shown on the About and People pages.
 *
 * Source: the IP3 team pack supplied on 2 October 2026: the expertise matrix (names, IP3 positions and
 * practice areas), each person's CV (affiliation, degrees and profile) and their own portrait photos.
 * Personal contact details in the pack are never published. Profiles avoid pronouns on purpose.
 *
 * Four portraits are missing or could not be matched to a name with confidence (Prof. Asadullah,
 * Prof. Mannan, Dr. Sadek, Dr. Esraz-Ul-Zannat); a monogram is drawn until IP3 supplies them.
 */
export const people: Person[] = [
  {
    slug: 'mohammad-syful-hoque',
    name: 'Mohammad Syful Hoque',
    role: 'Founding Director & Executive Chairman',
    group: 'leadership',
    practice: [
      'Climate finance',
      'Climate adaptation and mitigation',
      'ESG and circular economy strategy',
      'Biodiversity conservation',
      'Trade and logistics',
      'Industrial growth',
      'Technology adoption',
      'Economic, social and environmental feasibility studies',
      'Impact evaluation',
      'MERLA',
    ],
    summary:
      'Economist and costing and financing specialist with 20 years of experience in programme costing, economic and financial analysis, feasibility assessment and financing strategy for the World Bank, ADB, IFC, the European Commission and government.',
    affiliation: 'Executive Chairman, IP3 Consulting Limited',
    bio: [
      'Has led or contributed to feasibility studies for ADB\'s NextGen education programmes in Bangladesh, the green transition of the garment sector for the Embassy of Sweden and the Centre for Policy Dialogue, the World Bank\'s firm-level technology adoption survey, and the European Commission\'s analysis of Bangladesh\'s LDC graduation. Currently works on ADB\'s regional facility for early warning systems in ten countries.',
      'Designs and manages nationwide and multi-country household and enterprise surveys, and works in Python, R, Stata and ArcGIS. Publications cover property-tax valuation, financial soundness indicators (ADB) and technology adoption by firms (World Bank).',
    ],
    education: [
      'MSc in Economics, University of Surrey, UK (2012)',
      'MSS in Economics, University of Dhaka (2006)',
      'BSS in Economics, University of Dhaka (2005)',
    ],
    portrait: '/people/mohammad-syful-hoque-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'prof-dr-shafiun-shimul',
    name: 'Prof. Dr. Shafiun Nahin Shimul',
    role: 'Founding Director & Lead Economist',
    group: 'leadership',
    practice: ['Public health policy', 'Healthcare systems', 'Health economics'],
    summary:
      'Professor at the Institute of Health Economics, University of Dhaka, working on health financing, tobacco taxation, social health protection and economic evaluation.',
    affiliation: 'Professor, Institute of Health Economics, University of Dhaka',
    bio: [
      'Principal investigator on tobacco taxation research funded through Johns Hopkins University, the University of Illinois Chicago and the CDC Foundation, and health economist for ADB on a policy-based loan for social security, financial inclusion and health. CDC Foundation Fellow at Georgia State University (2022–2024).',
      'Other work includes a World Bank randomised trial on motivating social service workers, the outpatient benefit package for Bangladesh\'s social health protection scheme (SSK), and a cost-benefit analysis of adolescent nutrition interventions for the World Bank.',
    ],
    education: [
      'Postdoctoral fellowship, Georgia State University, USA (2022–2024)',
      'PhD in Economics, University of Nebraska-Lincoln, USA (2017)',
      'MSS in Health Economics, University of Dhaka (2004)',
      'MSS and BSS in Economics, University of Dhaka (2003, 2002)',
    ],
    portrait: '/people/prof-dr-shafiun-nahin-shimul-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'barr-zareen-rahman',
    name: 'Barr. Zareen Rahman',
    role: 'Founding Director',
    group: 'leadership',
    practice: ['Regulatory compliance', 'Public-private partnerships (PPP)', 'Legal framework development'],
    summary:
      'Barrister and advocate of the Supreme Court of Bangladesh, advising on regulation, public-private partnerships, foreign investment and urban development law.',
    affiliation: 'Advocate, Supreme Court of Bangladesh',
    bio: [
      'Called to the Bar of England and Wales at Lincoln\'s Inn (2010) and practising before the High Court Division since 2015. Panel lawyer for RAJUK, AB Bank and Biman Bangladesh Airlines, and retainer counsel to United Group on power, energy, real estate and commercial matters.',
      'As a JICA consultant, advised on the Dhaka rapid pass project with the Dhaka Transport Coordination Authority, and supported the Bangladesh Economic Zones Authority and BIFFL on economic zones and special purpose companies under JICA\'s Foreign Direct Investment Promotion Programme.',
    ],
    education: ['Bar Vocational Course, City University London (2010)', 'LLB (Hons), University of London (2009)'],
    portrait: '/people/barr-zareen-rahman-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'adj-prof-harun-rashid',
    name: 'Adj. Prof. Harun Rashid',
    role: 'Founding Director',
    group: 'leadership',
    practice: ['Comparative politics', 'Public policy analysis', 'Conflict resolution and management'],
    summary: 'Political scientist and Adjunct Professor at Kent State University, USA, teaching comparative and Asian politics, world politics and conflict management.',
    affiliation: 'Adjunct Professor, Department of Political Science, Kent State University, USA',
    bio: [
      'Senior Lecturer at BRAC University (2010–2016) in the MA in Governance and Development, a programme for mid-level civil servants from across South Asia. Has also taught at the Asian University for Women and the Pontifical Catholic University of Paraná, Brazil.',
      'Trained in negotiation and conflict management at the Kroc School, University of San Diego, and in environmental management and governance at the University of Manitoba.',
    ],
    education: [
      'PhD candidate (ABD) in Political Science, Kent State University',
      'MS in Political Science, Kent State University (2020)',
      'MS and BS in Political Science, University of Dhaka (2008, 2007)',
    ],
    portrait: '/people/adj-prof-harun-rashid-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'prof-dr-imran-mahmud',
    name: 'Prof. Dr. Imran Mahmud',
    role: 'Founding Director',
    group: 'leadership',
    practice: ['Technology management', 'Digital governance and training', 'MIS and database systems', 'IT training'],
    summary:
      'Professor and Head of the Department of Software Engineering at Daffodil International University, researching technology adoption, information systems and applied AI.',
    affiliation: 'Professor and Head, Department of Software Engineering, Daffodil International University',
    bio: [
      'Author of more than 90 publications, with over 2,300 Google Scholar citations, on technology adoption, enterprise systems, e-waste and machine learning. Visiting researcher at Thuongmai University, Vietnam, and adviser to BRAC Business School.',
    ],
    education: [
      'PhD in Technology Management, Universiti Sains Malaysia (2017)',
      'MSc in Software Engineering, University of Hertfordshire, UK (2009)',
      'BSc in Computer Science, BRAC University (2006)',
    ],
    portrait: '/people/prof-dr-imran-mahmud-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'nizam-uddin-ahmed',
    name: 'Nizam Uddin Ahmed',
    role: 'Founding Director',
    group: 'leadership',
    practice: ['Data governance', 'Financial systems', 'Digital transformation and implementation'],
    summary:
      'Capital-market technology specialist who has led stock exchange projects in Bangladesh and the region, from matching-engine replacement and demutualisation to data interoperability standards.',
    affiliation: 'Short-term consultant, World Bank Group Joint Capital Market Program (J-CAP)',
    bio: [
      'National consultant on the World Bank\'s capital market systems interoperability standards for Bangladesh\'s securities regulator, stock exchanges and central depository. Formerly head of market development at the Dhaka Stock Exchange and senior project manager at FlexTrade Systems.',
    ],
    education: ['MBA, Lahore University of Management Sciences (2007)', 'MA in Physics, Indiana University of Pennsylvania, USA (2002)'],
    portrait: '/people/nizam-uddin-ahmed-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'md-shefatul-islam',
    name: 'Md Shefatul Islam',
    role: 'Founding Director',
    group: 'leadership',
    practice: ['Education system development', 'EdTech', 'Blended learning', 'Curriculum design'],
    summary:
      'Education technology and capacity development expert at the Aspire to Innovate (a2i) programme, managing Noipunno, Bangladesh\'s national assessment platform.',
    affiliation: 'Capacity Development Expert, Aspire to Innovate (a2i), ICT Division',
    bio: [
      'A member of the Bangladesh Civil Service (General Education) since 2017. Has worked on the Blended Education Master Plan technical committee, the National AI Policy and AI guidelines, and the national curriculum reform committee, and has written textbooks for the National Curriculum and Textbook Board.',
    ],
    education: ['MSS and BSS (Hons) in Economics, University of Dhaka'],
    portrait: '/people/md-shefatul-islam-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'prof-dr-niaz-asadullah',
    name: 'Prof. Dr. M Niaz Asadullah',
    role: 'Chief Economic Advisor',
    group: 'advisors',
    practice: ['Education policy', 'Health economics', 'Demography', 'Social protection strategy'],
    summary: 'Professor of Economics at Monash University Malaysia and a development economist working on education, labour, gender and poverty.',
    affiliation: 'Professor of Economics, Monash University (Malaysia)',
    bio: [
      'Previously professor at the University of Malaya (2013–2022) and deputy director of its Poverty Studies Centre; earlier, assistant professor at the University of Reading, UK, and lecturer in economics at the University of Dhaka.',
      'More than 75 peer-reviewed journal papers and over 4,400 Google Scholar citations. Heads the Southeast Asia cluster of the Global Labor Organization and has held senior advisory appointments with the Government of Malaysia.',
    ],
    education: [
      'DPhil in Economics, University of Oxford (2005)',
      'MSc in Development Economics, University of Oxford (2000)',
      'BA in Economics, Aligarh Muslim University, India (1996)',
    ],
    portrait: '',
    status: 'published',
    note: 'Portrait: the pack has "Niaz.jpg", but it does not appear to show Prof. Asadullah. Supply a photo to replace the monogram.',
  },
  {
    slug: 'prof-dr-m-a-mannan',
    name: 'Prof. Dr. Muhammad Abdul Mannan',
    role: 'Senior Consulting Advisor',
    group: 'advisors',
    practice: ['Institutional economics', 'Poverty alleviation', 'Labour market analysis', 'Gender and development', 'Social protection'],
    summary:
      'Economist and demographer, formerly Senior Research Fellow at the Bangladesh Institute of Development Studies (BIDS), with decades of research on social protection, governance, gender, poverty and primary health care.',
    affiliation: 'Former Senior Research Fellow, Bangladesh Institute of Development Studies',
    bio: [
      'Has led research and evaluations for UNFPA, UNICEF, UNDP, the World Bank, USAID, CARE, Save the Children, The Asia Foundation and government ministries, including impact analyses of Bangladesh\'s food-for-work, VGD, VGF and maternity allowance programmes and household surveys under the South Asia WASH Results Programme.',
    ],
    education: ['PhD in Economics', 'MSc in Demography', 'MA in Economics'],
    portrait: '',
    status: 'published',
    note: 'No portrait in the pack. Universities for the degrees are not in the CV supplied.',
  },
  {
    slug: 'prof-dr-tat-thanh-tran',
    name: 'Prof. Dr. Tat Thanh Tran',
    role: 'Deputy Director (Practice Area Lead)',
    group: 'practice',
    practice: ['Corporate finance', 'Strategic investment', 'Financial markets', 'R&D policy'],
    summary:
      'Finance economist at the School of Banking and Finance, National Economics University, Vietnam, working on corporate finance, project appraisal and industrial organisation.',
    affiliation: 'School of Banking and Finance, National Economics University, Vietnam',
    bio: [
      'Research covers project discount rates, university financing and R&D networks, with project work for Vietnam\'s Ministry of Agriculture and Rural Development and Ministry of Education and Training, and the ADB-financed Agriculture Sector Development Project.',
    ],
    education: [
      'PhD in Economics and Finance, University of Surrey, UK (2014)',
      'BSc in Economics and Finance (first class), National Economics University, Vietnam (2002)',
    ],
    portrait: '/people/prof-dr-tat-thanh-tran-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'dr-md-abu-zafor-sadek',
    name: 'Dr. Md. Abu Zafor Sadek',
    role: 'Deputy Director (Practice Area Lead)',
    group: 'practice',
    practice: ['Pharmaceutical industry strategy', 'Biosimilars development', 'Market and product innovation'],
    summary:
      'Pharmacist and business leader with 19 years in pharmaceutical product management; Deputy General Manager, Marketing, at UniMed UniHealth Pharmaceuticals.',
    affiliation: 'Deputy General Manager, Marketing, UniMed UniHealth Pharmaceuticals Ltd.',
    bio: [
      'Previously in product management at Renata Limited and Orion Pharmaceuticals, short-term consultant to the World Bank (2019), and adjunct faculty at the Canadian University of Bangladesh. Doctoral research examined the growth potential of biosimilar products in Bangladesh.',
    ],
    education: [
      'Doctor of Business Administration, Institute of Business Administration, University of Dhaka (2020)',
      'MBA in International Business, University of Dhaka (2014)',
      'MSc in Pharmacy, University of Asia Pacific (2008)',
    ],
    portrait: '',
    status: 'published',
    note: 'Portrait: the pack has "ABU Bakar Sadek.jpeg"; the first name differs, so it was not used. Confirm and upload.',
  },
  {
    slug: 'zahidur-rahman',
    name: 'Zahidur Rahman',
    role: 'Practice Area Manager',
    group: 'practice',
    practice: ['Digital communication strategy', 'Data visualisation', 'Presentation design'],
    summary:
      'Communications and information design professional with more than ten years of experience in digital communication, data visualisation and knowledge management for UN agencies and multinational clients.',
    affiliation: '',
    bio: [],
    education: ['MBA in Human Resource Management, University of Dhaka', 'BSS, University of Dhaka'],
    portrait: '/people/zahidur-rahman-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'sazia-ahmed',
    name: 'Asst. Prof. Sazia Ahmed',
    role: 'Affiliated Research Scholar',
    group: 'scholars',
    practice: ['Agricultural economics', 'Environmental economics', 'Health economics'],
    summary:
      'Assistant Professor of Economics at Khulna University (on study leave) and PhD candidate at the University of Waikato, New Zealand, researching how weather shocks affect agriculture.',
    affiliation: 'Assistant Professor, Economics Discipline, Khulna University',
    bio: [
      'Specialises in econometric modelling, time series and panel data. Doctoral research examines the effect of weather shocks on horticulture and agribusiness, including the kiwifruit, grape and livestock industries.',
    ],
    education: [
      'PhD in Economics (in progress), University of Waikato, New Zealand',
      'MSS in Economics, Khulna University (2017)',
      'BSS (Hons) in Economics, Khulna University (2016)',
    ],
    portrait: '/people/sazia-ahmed-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'dr-sibbir-ahmad',
    name: 'Dr. Sibbir Ahmad',
    role: 'Affiliated Research Scholar',
    group: 'scholars',
    practice: ['Applied microeconomics', 'Development, agriculture, labour and health', 'Experimental economics'],
    summary:
      'Postdoctoral Research Associate in Economics at the University of Virginia, working on development, labour, agriculture and health with experimental methods.',
    affiliation: 'Postdoctoral Research Associate, Department of Economics, University of Virginia',
    bio: [
      'Research includes labour-market discrimination and elite colleges as signals in Bangladesh, input subsidies and crop diversity on family farms in Burkina Faso (Journal of Agricultural Economics, 2023), and vaccine hesitancy.',
    ],
    education: [
      'PhD in Applied Economics, Michigan State University (2024)',
      'MA in Economics and MA in Mathematics, Central Michigan University (2019)',
      'MSS and BSS in Economics, University of Dhaka (2012, 2011)',
    ],
    portrait: '/people/dr-sibbir-ahmad-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'dr-md-latiful-haque',
    name: 'Dr. Md. Latiful Haque',
    role: 'Affiliated Research Scholar',
    group: 'scholars',
    practice: ['Food systems policy', 'Agricultural policy', 'Environmental governance'],
    summary:
      'Researcher in environmental policy and food systems at Wageningen University & Research, the Netherlands, with 13 years in food policy, agricultural economics and urban-rural development.',
    affiliation: 'Wageningen University & Research, the Netherlands',
    bio: [
      'Doctoral research studied the food-safety concerns and coping strategies of the urban poor in Bangladesh\'s retail food environments. Previously a research analyst at the International Food Policy Research Institute (IFPRI) in Bangladesh (2016–2018).',
    ],
    education: [
      'PhD in Environmental Policy, Wageningen University & Research (2025)',
      'MSc in Economics (2011)',
      'BSc in Economics, University of Dhaka (2009)',
    ],
    portrait: '/people/dr-md-latiful-haque-480.webp',
    status: 'published',
    note: '',
  },
  {
    slug: 'siban-shahana',
    name: 'Asst. Prof. Siban Shahana',
    role: 'Affiliated Research Scholar',
    group: 'scholars',
    practice: ['Public policy economics', 'Education reform', 'Human resource development'],
    summary:
      'Research Fellow at the Bangladesh Institute of Development Studies (BIDS) and an applied microeconomist working on education and labour-market transitions.',
    affiliation: 'Research Fellow, Bangladesh Institute of Development Studies',
    bio: [
      'Uses large-scale surveys and randomised controlled trials to evaluate education programmes and labour-market outcomes. Publications include new evidence on Bangladesh\'s primary education stipend programme and a chapter on building resilience in education systems (ADB Institute, 2024).',
    ],
    education: [
      'MA in Policy Economics, Williams College, USA (2016)',
      'MSS and BSS in Economics, University of Dhaka (2010, 2009)',
    ],
    portrait: '/people/siban-shahana-480.webp',
    status: 'published',
    note: 'The matrix gives "Asst. Prof."; the CV gives Research Fellow, BIDS. Confirm the title.',
  },
  {
    slug: 'dr-md-esraz-ul-zannat',
    name: 'Dr. Md. Esraz-Ul-Zannat',
    role: 'Affiliated Research Scholar',
    group: 'scholars',
    practice: ['Disaster risk reduction', 'Water and climate policy', 'Urban planning'],
    summary:
      'Urban planner and GIS and remote-sensing specialist at the Department of Urban and Regional Planning, Khulna University of Engineering & Technology (KUET).',
    affiliation: 'Department of Urban and Regional Planning, Khulna University of Engineering & Technology',
    bio: [
      'Works on GIS and remote sensing for disaster management, water, climate change and land-use planning, including urban flood-resilience research and land-use policy for the Khulna Structure Plan under climate-induced flood scenarios.',
    ],
    education: ['Master of Urban and Regional Planning, BUET', 'Bachelor of Urban and Regional Planning, BUET'],
    portrait: '',
    status: 'published',
    note: 'No portrait in the pack. The CV supplied dates from 2015; the doctorate is not listed in it.',
  },

  /* ---- Hidden: on the old site but not in the team pack supplied in October 2026. ---- */
  ...(
    [
      ['dr-tahmina-rahman', 'Dr. Tahmina Rahman', 'Senior Fellow, Environmental Economics & Climate'],
      ['kazi-farhan-ahmed', 'Kazi Farhan Ahmed', 'Head of Data & Digital Governance'],
      ['shirin-akhter-chowdhury', 'Shirin Akhter Chowdhury', 'Lead Specialist, Educational Innovation'],
      ['barrister-ashique-rahman', 'Barrister Ashique Rahman', 'Senior Legal & Policy Counsel'],
    ] as const
  ).map(
    ([slug, name, role]): Person => ({
      slug,
      name,
      role,
      group: 'practice',
      practice: [],
      summary: '',
      affiliation: '',
      bio: [],
      education: [],
      portrait: '',
      status: 'verify',
      note: 'Listed on the old site but not in the team pack (expertise matrix and CVs) supplied in October 2026. Confirm before publishing.',
    }),
  ),
];
