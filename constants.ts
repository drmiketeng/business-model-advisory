import type { LeanCanvasDimension } from './types';

export const LEAN_CANVAS_DIMENSIONS: LeanCanvasDimension[] = [
  {
    id: 'problem',
    name: 'Problem',
    pFactor: 'Pain',
    question: 'What are your customers’ top 3 pain points or problems you are trying to solve?',
    choices: [
        "We have a general hypothesis about the problem but lack validated customer research.",
        "We've conducted initial interviews or surveys and have a good understanding of the main pain points.",
        "We have extensive, data-backed evidence of the top 3 problems and can quantify their impact on our target customers."
    ],
    ratingPrompt: 'Rate how well you understand the customer Pain.',
    ratingLabels: {
      1: 'Excellent Understanding',
      2: 'Good Understanding',
      3: 'Moderate Understanding',
      4: 'Some Gaps Exist',
      5: 'Poor Understanding / High Risk',
    }
  },
  {
    id: 'customer-segments',
    name: 'Customer Segments',
    pFactor: 'People',
    question: 'Who are your primary target customers or partners? Describe your ideal customer profile.',
    choices: [
        "Our target audience is very broad and not clearly defined.",
        "We have a good idea of our ideal customer but haven't created detailed personas or segments.",
        "We have clearly defined, well-researched customer segments and personas that guide our marketing and product decisions."
    ],
    ratingPrompt: 'Rate the clarity and focus of your target customer segments.',
    ratingLabels: {
      1: 'Very Clear & Focused',
      2: 'Clear',
      3: 'Somewhat Defined',
      4: 'Broad / Unfocused',
      5: 'Undefined / High Risk',
    }
  },
  {
    id: 'unique-value-proposition',
    name: 'Unique Value Proposition',
    pFactor: 'Proposition',
    question: 'What makes your product or service unique and valuable? Why should customers choose you over competitors?',
    choices: [
        "Our value proposition is not clearly differentiated from our competitors.",
        "We have a few unique features, but they could be replicated by competitors.",
        "We have a strong, unique value proposition that is difficult to replicate and clearly resonates with our target customers."
    ],
    ratingPrompt: 'Rate the strength and uniqueness of your value proposition.',
    ratingLabels: {
      1: 'Extremely Strong & Unique',
      2: 'Strong',
      3: 'Moderately Strong',
      4: 'Weak / Undifferentiated',
      5: 'No Clear Proposition / High Risk',
    }
  },
  {
    id: 'solution',
    name: 'Solution',
    pFactor: 'Product',
    question: 'How does your product/service solve your customers’ problems? Outline the top 3 features.',
    choices: [
        "Our solution addresses some of the customer's problems, but there are gaps.",
        "Our solution is a solid answer to the core problems, with key features that customers appreciate.",
        "Our solution not only solves the core problems effectively but also delights customers with its design and additional benefits."
    ],
    ratingPrompt: 'Rate how effectively your solution addresses the identified problems.',
    ratingLabels: {
      1: 'Very Effective Solution',
      2: 'Effective',
      3: 'Moderately Effective',
      4: 'Partially Effective',
      5: 'Ineffective / Mismatched / High Risk',
    }
  },
  {
    id: 'channels',
    name: 'Channels',
    pFactor: 'Place',
    question: 'How do you reach your customers? How do you deliver and promote your product/service?',
    choices: [
        "We rely on one or two primary channels that are not yet optimized.",
        "We use a multi-channel approach but are still figuring out which are the most effective and scalable.",
        "We have a well-integrated, scalable multi-channel strategy that effectively reaches our target segments at multiple touchpoints."
    ],
    ratingPrompt: 'Rate the effectiveness and scalability of your channels.',
    ratingLabels: {
      1: 'Highly Effective & Scalable',
      2: 'Effective',
      3: 'Moderately Effective',
      4: 'Ineffective',
      5: 'No Clear Channels / High Risk',
    }
  },
  {
    id: 'revenue-streams',
    name: 'Revenue Streams',
    pFactor: 'Profit',
    question: 'What are your main sources of revenue (e.g., sales, subscriptions, ads)? How do you price your offering?',
    choices: [
        "Our revenue model is singular and faces significant pricing pressure.",
        "We have a primary revenue stream and are exploring one or two others; our pricing is competitive.",
        "We have diverse, scalable revenue streams with a clear pricing strategy that reflects our value proposition."
    ],
    ratingPrompt: 'Rate the viability and scalability of your revenue model.',
    ratingLabels: {
      1: 'Highly Viable & Scalable',
      2: 'Viable',
      3: 'Moderately Viable',
      4: 'Questionable Viability',
      5: 'Not Viable / High Risk',
    }
  },
  {
    id: 'cost-structure',
    name: 'Cost Structure',
    pFactor: 'Processes',
    question: 'What are your key costs (e.g., salaries, marketing, hosting)? How do you manage them?',
    choices: [
        "We have a basic understanding of our costs, but they are not well-managed or optimized.",
        "We track our major costs but could be more efficient in managing our operational expenses.",
        "We have a deep understanding of our cost structure and actively manage it to optimize for scalability and profitability."
    ],
    ratingPrompt: 'Rate your understanding and management of your cost structure.',
    ratingLabels: {
      1: 'Excellent Control & Understanding',
      2: 'Good Control',
      3: 'Moderate Control',
      4: 'Some Uncontrolled Costs',
      5: 'Poor Control / High Risk',
    }
  },
  {
    id: 'key-metrics',
    name: 'Key Metrics',
    pFactor: 'Performance',
    question: 'What key indicators do you track to measure success (e.g., user growth, revenue, churn)?',
    choices: [
        "We track basic metrics like revenue, but they don't give us actionable insights.",
        "We monitor several key metrics (e.g., CAC, LTV) but don't always use them to drive decisions.",
        "We have a well-defined set of actionable metrics that we review regularly to inform our strategic and tactical decisions."
    ],
    ratingPrompt: 'Rate the relevance and effectiveness of your key metrics.',
    ratingLabels: {
      1: 'Highly Relevant & Actionable',
      2: 'Relevant',
      3: 'Somewhat Relevant',
      4: 'Vanity Metrics',
      5: 'No Clear Metrics / High Risk',
    }
  },
  {
    id: 'unfair-advantage',
    name: 'Unfair Advantage',
    pFactor: 'Protection',
    question: 'What competitive advantages protect your business from rivals (e.g., patents, brand, network effects)?',
    choices: [
        "We don't have a clear advantage that can't be easily copied by competitors.",
        "We have some advantages (e.g., a strong team, first-mover) but they are not long-term defensible.",
        "We have a strong, sustainable unfair advantage (e.g., patent, network effect, brand loyalty) that is very difficult for competitors to replicate."
    ],
    ratingPrompt: 'Rate the strength and sustainability of your unfair advantage.',
    ratingLabels: {
      1: 'Very Strong & Sustainable',
      2: 'Strong',
      3: 'Moderate',
      4: 'Weak / Easily Copied',
      5: 'No Advantage / High Risk',
    }
  }
];

export const DEFAULT_WEIGHTS: Record<string, number> = {
  pain: 12,
  people: 11,
  proposition: 11,
  product: 11,
  place: 11,
  profit: 11,
  processes: 11,
  performance: 11,
  protection: 11,
};