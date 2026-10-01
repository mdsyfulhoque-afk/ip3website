import type { MethodContent } from '../types';

/**
 * How IP3 works: six movements, each ending in a named output, and six
 * principles.
 *
 * Wording is tightened from the old Approach page. The DR/PS/FB/DA/IS/LS step
 * codes from the old methodology data are not used: they described the same six
 * stages a second time. The movement outputs keep their exact original titles.
 * Scale belongs here (Learn & Scale), not in the capabilities list.
 */
export const method: MethodContent = {
  heading: 'Reform is a movement, not a moment.',
  intro: [
    'Complex challenges rarely fail for want of another recommendation. They fail when evidence is disconnected from decisions, strategy from financing, technology from users, and reform from the institutions that must own it.',
    'IP3 works through six movements, and each ends in a named output. Solutions are understood before they are designed, tested before they are scaled, implemented with the people who must operate them, and improved through evidence.',
  ],
  movements: [
    {
      slug: 'sense-diagnose',
      title: 'Sense & Diagnose',
      text: 'Understand the system before treating the symptom. A visible problem is rarely the whole problem. We run a current-state diagnostic of how policies, institutions, incentives, markets, people, technology, finance, infrastructure, data and behaviours interact. It separates what drives the problem from what is only a symptom, and shows where intervention has the most leverage.',
      output: 'Current-State Diagnostic & Transformation Baseline',
    },
    {
      slug: 'build-intelligence',
      title: 'Build Intelligence',
      text: 'Turn information into decision intelligence. Not every evidence gap needs another large study. We identify what must be known to change a decision, combine existing evidence with new primary research where it is needed, and link quantitative analysis to institutional, behavioural and user insight. The evidence is then translated into a practical target state.',
      output: 'Evidence & Target-State Blueprint',
    },
    {
      slug: 'co-design-test',
      title: 'Co-Design & Test',
      text: 'Turn evidence into something that can operate. Policies, programmes, operating models, digital systems, regulations, financial mechanisms and services are designed with the institutions and people who must use them. They are then prototyped and tested before anyone commits institutional resources.',
      output: 'Tested Solution Architecture',
    },
    {
      slug: 'mobilise',
      title: 'Mobilise',
      text: 'A good design cannot implement itself. Mobilisation is broader than financing. It means aligning the mandate, leadership, stakeholders, people, capabilities, technology, data, financing and implementation resources needed to move from design into operation. We do this jointly with the finance, policy, IT, programme and leadership teams of the client, not through a downstream consultant.',
      output: 'Mobilisation & Implementation Readiness Plan',
    },
    {
      slug: 'implement-transfer',
      title: 'Implement & Transfer',
      text: 'Implementation is part of consulting, not what happens after consulting. We work alongside clients as strategy becomes operating reality, and we treat change management and stakeholder engagement as implementation disciplines, not communication exercises. The aim is institutional capability, transferred deliberately as the work proceeds, not consultant dependency.',
      output: 'Operational Delivery System & Capability Transfer Plan',
    },
    {
      slug: 'learn-scale',
      title: 'Learn & Scale',
      text: 'Measure in time to change something. Our MERLA approach (monitoring, evaluation, research, learning and adaptation) asks what decision-makers need to know while implementation is still under way. Decision thresholds and feedback loops are agreed before implementation starts, so evidence can change the programme rather than only report on it. Scale is earned, not assumed: it follows evidence on effectiveness, adoption, affordability and institutional capacity.',
      output: 'MERLA, Adaptation & Scale Architecture',
    },
  ],
  principles: [
    {
      title: 'Evidence before assumption',
      text: 'We generate and use evidence to change decisions. Research is the start of the work, not automatically its final product.',
    },
    {
      title: 'Systems before symptoms',
      text: 'Connected problems need connected responses. We examine how policies, institutions, finance, markets, technology, users and implementation relate to one another before we define the intervention.',
    },
    {
      title: 'Co-creation, not prescription',
      text: 'We bring together government, markets, development partners, researchers, implementers, technology teams and communities. Solutions are stronger when the people who must operate and experience them help shape them.',
    },
    {
      title: 'Test before scale',
      text: 'Strategies are useful when they survive contact with reality. Where uncertainty makes early scale risky, we prototype, pilot, test and iterate.',
    },
    {
      title: 'Implementation alongside strategy',
      text: 'Policy, research, finance, digital design, programme management and evaluation should not become disconnected workstreams. We work across the value chain, from diagnosis to implementation and adaptation.',
    },
    {
      title: 'Capability beyond the assignment',
      text: 'The strongest sign of success is not that IP3 remains indispensable. It is that the client has stronger systems, people, data and capacity to keep improving after the engagement.',
    },
  ],
};
