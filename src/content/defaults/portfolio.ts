import type { Engagement } from '../types';

/**
 * Selected engagements.
 *
 * Built from the real service pages (Economic, Design, MERLA), the six
 * ApproachPage proof cards and the [verify]-tagged institutional engagements.
 * One entry per engagement: where two sources describe the same work they are
 * merged and the merge is explained in `note`.
 *
 * Rules applied:
 *  - `client` is filled only where the source names one of: World Bank, Asian
 *    Development Bank (ADB), European Commission, JICA, Bangladesh Municipal
 *    Development Fund. Everything else reads 'Client to be confirmed'.
 *  - Figures (firms surveyed, model horizons, contract number) are kept only
 *    where they appear in the source copy.
 *  - No superlatives, no outcome metrics, no audit references.
 *  - 'published' = appears in live copy with specific detail.
 *    'verify' = appears only in a [verify]-tagged or uncorroborated component.
 *  - Fields that read '... to be confirmed' are gaps the owner needs to fill
 *    in the editor; they should not be shown to the public as they stand.
 */
export const portfolio: Engagement[] = [
  {
    id: 'education-feasibility-adb',
    status: 'published',
    title: 'Feasibility study for secondary and madrasah education',
    client: 'Asian Development Bank (ADB)',
    place: 'Bangladesh',
    period: '2023–2026',
    summary:
      'Economic and financial feasibility work for secondary and madrasah education projects under ADB TA-6950-BAN, part of ADB-supported feasibility and programme preparation across primary, secondary, madrasah and TVET education. The analysis covered market and demand assessment, cost-benefit assessment, risk modelling, institutional capacity, curriculum and pedagogy, digital learning, gender and inclusive access, and climate resilience.',
    services: ['economic-assessment'],
    sectors: ['education-skills'],
    note:
      'Merged from two sources: EconomicService (secondary and madrasah feasibility study, dated 2024, ADB TA-6950-BAN) and the ApproachPage proof card "Education Systems Transformation & Digital Learning" (ADB-supported, Bangladesh, 2023–2026, primary to TVET). Treated as one assignment; split into two entries if they are separate. Removed the claim "Bangladesh\'s first" (unverified superlative). Confirm: the TA number, the period, and that ADB may be named as client.',
  },
  {
    id: 'payra-seaport-advisory',
    status: 'published',
    title: 'Economic and financial advisory for Payra Seaport development',
    client: 'Client to be confirmed',
    place: 'Bangladesh',
    period: '2017',
    summary:
      'Economic and financial feasibility analysis for Payra Seaport, within a techno-economic study and master planning initiative. The work included cost-benefit assessments, a 15-year financial model and investment viability analysis.',
    services: ['economic-assessment'],
    sectors: ['private-sector', 'macroeconomic-fiscal'],
    note:
      'Source: EconomicService (2017). The source does not name the client, so none is shown. The source also calls Payra "Bangladesh\'s third seaport"; left out. Confirm the client, IP3\'s exact role in the master planning initiative, and the 15-year model horizon.',
  },
  {
    id: 'jolshiri-aqua-green-city-feasibility',
    status: 'published',
    title: 'Feasibility study for Jolshiri Aqua Green City',
    client: 'Client to be confirmed',
    place: 'Bangladesh',
    period: '2019',
    summary:
      'Economic, social, financial and market feasibility study for Jolshiri Aqua Green City, a large housing development. The work included a 10-year projection, cost-benefit analysis, financial modelling and market segmentation, and set out investment strategies, pricing models and funding options.',
    services: ['economic-assessment'],
    sectors: ['private-sector', 'cities-municipal-finance'],
    note:
      'Source: EconomicService (2019). The source describes the project as an "Army Officers Housing Scheme" development. That wording is left out of the public summary because the sponsor is not confirmed as a nameable client. Confirm whether it can be stated, and the 10-year projection horizon.',
  },
  {
    id: 'sez-equity-investment-policy',
    status: 'published',
    title: 'Equity investment policy and special economic zone advisory',
    client: 'JICA',
    place: 'Bangladesh',
    period: '2017',
    summary:
      'Technical coordination and advisory support to an infrastructure finance fund and an economic zones authority on an equity investment policy and special purpose company structures, working with JICA. The work designed an investment framework, shareholder agreements and project structuring to support special economic zone development and financing.',
    services: ['economic-assessment', 'macro-sector-policy'],
    sectors: ['private-sector', 'macroeconomic-fiscal'],
    note:
      'Source: EconomicService (2017), tagged "JICA • BEZA • BIFFL". The source says the advice went to Bangladesh Infrastructure Finance Fund Limited (BIFFL) and Bangladesh Economic Zones Authority (BEZA) and that IP3 collaborated with JICA and the Japan Development Institute (JDI). So JICA is a collaborating partner in the text, not stated as the paying client. Confirm who the client was, and whether BIFFL, BEZA and JDI may be named (they are described, not named, in the summary).',
  },
  {
    id: 'global-leap-results-based-financing',
    status: 'published',
    title: 'Clean energy financing and market development for Global LEAP',
    client: 'Client to be confirmed',
    place: 'Place to be confirmed',
    period: 'Year to be confirmed',
    summary:
      'Led the design and implementation of a results-based financing strategy for the Global Lighting and Energy Access Partnership (Global LEAP) to speed the adoption of off-grid solar home systems. The work included market matchmaking, cost-benefit analysis and a four-year monitoring and evaluation framework, aimed at closing viability gaps for clean energy companies and building commercial markets for affordable, high-quality energy products.',
    services: ['economic-assessment', 'climate-esg', 'merla'],
    sectors: ['climate-energy', 'private-sector'],
    note:
      'The same engagement appears twice in the old site with conflicting years: 2015 on the Economic page ("Global LEAP Clean Energy Financing & Market Development") and 2018 on the MERLA page ("Accelerating Clean Energy Access Through Results-Based Financing"). Merged into one entry with the year left open. Confirm the year (or whether these were two phases), where the work took place, who the client was, and whether Global LEAP may be named. The "four-year" framework length comes from the 2015 text.',
  },
  {
    id: 'esmap-astae-evaluation',
    status: 'published',
    title: 'Evaluation of World Bank ESMAP and ASTAE programmes',
    client: 'World Bank',
    place: 'Bangladesh and Nepal',
    period: '2016',
    summary:
      'Financial, economic and social impact evaluation of renewable energy projects under the World Bank Energy Sector Management Assistance Program (ESMAP) and Asia Sustainable Alternative Energy Program (ASTAE) in Bangladesh and Nepal. It covered hydroelectric, biomass, wind, geothermal and solar projects, and analysed cost-benefit performance, return on investment, and effects on poverty reduction and economic growth.',
    services: ['economic-assessment', 'climate-esg', 'merla'],
    sectors: ['climate-energy', 'monitoring-evaluation'],
    note:
      'Source: EconomicService (2016), tagged "World Bank ESMAP". Confirm the year and IP3\'s role (the source says IP3 "conducted" the evaluation).',
  },
  {
    id: 'fat-survey-bangladesh',
    status: 'published',
    title: 'Firm-Level Adoption of Technology (FAT) survey',
    client: 'World Bank',
    place: 'Bangladesh',
    period: '2019',
    summary:
      'An IP3 expert supported the World Bank Firm-Level Adoption of Technology (FAT) Survey 2019, which assessed technology adoption across 1,200 manufacturing firms in Bangladesh to identify productivity barriers and inform policy reform.',
    services: ['program-survey-design', 'macro-sector-policy'],
    sectors: ['private-sector'],
    note:
      'Source: DesignService (card titled "Surveyed 1200 Manufacturing Industries (2019)"). The source says "an expert of IP3 Consulting supported" the survey, so the wording is kept to support, not to lead. The ApproachPage proof card "Technology Adoption & Firm-Level Evidence" (World Bank) groups this with the digitalisation and informality work and lists survey design and field implementation, data quality assurance, economic analysis, stakeholder engagement and policy reporting; it is not clear which of those IP3 did on the FAT survey. Confirm the exact role and the 1,200 figure.',
  },
  {
    id: 'digital-informality-survey-bangladesh',
    status: 'published',
    title: 'Digitalisation and informality survey',
    client: 'Client to be confirmed',
    place: 'Bangladesh and South Asia',
    period: '2021',
    summary:
      'Contributed to the Bangladesh Digital and Informality Survey 2021, including a survey of 500 suppliers. The study analysed how digital technologies and new business models affect informality in South Asia and produced evidence for policy recommendations.',
    services: ['program-survey-design', 'macro-sector-policy'],
    sectors: ['private-sector'],
    note:
      'Source: DesignService (card titled "Surveyed 500 Suppliers for Digitalization & Informality Study", 2021). The source names no client. The ApproachPage proof card "Technology Adoption & Firm-Level Evidence" is labelled World Bank and mentions digitalisation and informality research, so the client may be the World Bank, but that is not stated for this survey. Confirm the client, IP3\'s role, and the 500-supplier figure.',
  },
  {
    id: 'green-industrial-transition-rmg',
    status: 'published',
    title: 'Green industrial transition in the textile and garment sector',
    client: 'Client to be confirmed',
    place: 'Bangladesh',
    period: '2023 (18-month programme)',
    summary:
      'Led an 18-month, multi-method research and advocacy programme on the green transition of the textile and ready-made garment industry. It covered barriers to green transition, green technology, renewable energy, regulation, policy reform and green finance, informed by a survey of 400 firms, 120 key informant interviews and 7 focus group discussions.',
    services: ['climate-esg', 'program-survey-design'],
    sectors: ['climate-energy', 'private-sector'],
    note:
      'Merged from DesignService (card "400 firms, 120 KIIs, and 7 FGDs for Green Transition (2023)") and the ApproachPage proof card "Green Industrial Transition" (18-month programme). The sources name no client. Confirm the client, the start and end dates, and the sample figures (400 firms, 120 KIIs, 7 FGDs).',
  },
  {
    id: 'halow-plus-worker-health',
    status: 'published',
    title: 'Health Access & Linkage for Workers (HALOW+)',
    client: 'Client to be confirmed',
    place: 'Place to be confirmed',
    period: '2019',
    summary:
      'Played a key role in HALOW+, a multi-stakeholder programme to improve health service markets and worker well-being in the ready-made garment sector.',
    services: ['merla'],
    sectors: ['private-sector', 'social-protection'],
    note:
      'Source: MerlaService (2019). The source says HALOW+ was led by Marks & Spencer, GSK, PwC-UK and CARE International, and that IP3 "played a key role". None of those are confirmed as nameable, so they are left out. The source does not describe IP3\'s role further and does not state the country (the garment sector suggests Bangladesh). Confirm the role in MERLA terms, the place, and whether any partner may be named.',
  },
  {
    id: 'dsip-me-results-framework',
    status: 'published',
    title: 'Monitoring and evaluation framework for the Dhaka Sewerage Improvement Project',
    client: 'Client to be confirmed',
    place: 'Dhaka, Bangladesh',
    period: '2020',
    summary:
      'Designed the monitoring and evaluation and results framework for the Dhaka Sewerage Improvement Project, which covers sewerage networks, wastewater treatment and non-network sanitation services.',
    services: ['merla'],
    sectors: ['cities-municipal-finance', 'monitoring-evaluation'],
    note:
      'Source: MerlaService (card "Transforming Urban Sanitation with Data-Driven M&E (2020)"). The source names no client or funder. The "data-driven" label in the old title is not carried over. Confirm the client and the year.',
  },
  {
    id: 'bmdf-municipal-finance-transformation',
    status: 'published',
    title: 'Municipal finance and institutional transformation',
    client: 'Bangladesh Municipal Development Fund',
    place: 'Bangladesh',
    period: 'Year to be confirmed',
    summary:
      'Work with the Bangladesh Municipal Development Fund on municipal infrastructure investment planning and institutional transformation. It covered GIS-informed planning, business simplification and automation, economic and financial analysis, public-private partnership (PPP) and innovative finance, a long-term financial roadmap, regulatory and institutional reform, capacity development, and KPIs with performance monitoring.',
    services: ['economic-assessment', 'macro-sector-policy'],
    sectors: ['cities-municipal-finance', 'public-governance'],
    note:
      'Merged from the ApproachPage proof card "Municipal Finance & Institutional Transformation" and the [verify]-tagged InstitutionalEngagementsSection item "Municipal Financing Institution Transformation, Bangladesh", which look like the same assignment. Only the proof card wording is used. Left out from the [verify] item: the completion year (2024), the capital-market access strategy, and the result line, which is marked "[verify before publishing any bond figure]". Confirm the period, IP3\'s role, whether the capital-market work belongs here, and that the Fund may be named.',
  },
  {
    id: 'climate-early-warning-adb',
    status: 'published',
    title: 'Climate-informed early warning systems',
    client: 'Asian Development Bank (ADB)',
    place: 'Asia and the Pacific',
    period: '2025–2026',
    summary:
      'Work under an ADB regional technical assistance on multi-hazard early-warning systems in Asia and the Pacific. It covered diagnostics, investment-pipeline design, economic and financial analysis, lifecycle operation and maintenance costing, institutional assessment, gender and inclusion, data standards and interoperability, multi-channel last-mile dissemination, results frameworks, procurement packaging and donor proposals.',
    services: ['economic-assessment', 'climate-esg'],
    sectors: ['climate-energy', 'public-governance'],
    note:
      'Source: ApproachPage proof card "Climate-Informed Early Warning Systems" only; it appears on no service page. Confirm that it is current or complete, the period, IP3\'s role (the card lists scope but not role), and that ADB may be named.',
  },
  {
    id: 'ldc-graduation-policy-reform',
    status: 'published',
    title: 'Policy reform, trade and LDC graduation',
    client: 'European Commission and World Bank',
    place: 'Place to be confirmed',
    period: 'Year to be confirmed',
    summary:
      'Policy reform and trade work linked to least developed country (LDC) graduation. It covered diagnostic gap analysis, productive-capacity analysis, market and trade assessment, investment and financing options, institutional mapping, vulnerability analysis, stakeholder coordination, and policy and reform priorities.',
    services: ['macro-sector-policy'],
    sectors: ['macroeconomic-fiscal', 'private-sector'],
    note:
      'Source: ApproachPage proof card "Policy Reform, Trade & LDC Graduation" only (context line: "European Commission and World Bank"). The card gives no country, period or role. Confirm those, and whether this was one assignment for both clients or two. Consider setting to verify until the gaps are filled.',
  },
  {
    id: 'digital-identity-civil-registry-interoperability',
    status: 'verify',
    title: 'National digital identity and civil registry interoperability',
    client: 'Client to be confirmed',
    place: 'Place to be confirmed',
    period: 'Year to be confirmed',
    summary:
      'Interoperability and data-governance architecture to connect fragmented civil registries and support integrated social-protection delivery. Outputs described as an interoperability blueprint, a data governance and privacy framework, and an implementation road map.',
    services: ['macro-sector-policy'],
    sectors: ['public-governance', 'social-protection'],
    note:
      'Source: InstitutionalEngagementsSection only, tagged [verify]; no other source corroborates it. The client is given there as "UNDP / government" and the year as 2024. UNDP is not a confirmed nameable client, and "government" is not identified. The result line ("[verify]") and the invented outcome labels (Unified, Endorsed, High-Impact) are not carried over. Confirm that this is a real IP3 engagement, then the client, country, year and IP3\'s role before changing the status to published.',
  },
  {
    id: 'secondary-stem-tvet-curriculum-modernisation',
    status: 'verify',
    title: 'Secondary STEM and TVET curriculum modernisation',
    client: 'Client to be confirmed',
    place: 'Place to be confirmed',
    period: 'Year to be confirmed',
    summary:
      'Modernisation of secondary STEM and vocational (TVET) curricula to match labour-market and climate-era skills needs, together with a teacher accreditation model. Outputs described as a curriculum framework, a modular accreditation system and an implementation plan.',
    services: ['program-survey-design', 'macro-sector-policy'],
    sectors: ['education-skills'],
    note:
      'Source: InstitutionalEngagementsSection only, tagged [verify]; no other source corroborates it. The client is given there as "UNESCO / GPE / government" and the year as 2024. UNESCO and GPE are not confirmed nameable clients. The result line ("[verify]") and the invented outcome labels are not carried over. Confirm that this is a real IP3 engagement, then the client, country, year and IP3\'s role before changing the status to published.',
  },
];
