export const SECTIONS = [
  {
    id: 'fundamentals',
    label: 'ML Fundamentals',
    path: '/fundamentals',
    color: 'emerald',
    description: 'The core learning paradigms that underpin all of machine learning.',
    algorithms: [
      { id: 'supervised', label: 'Supervised Learning', path: '/fundamentals/supervised' },
      { id: 'unsupervised', label: 'Unsupervised Learning', path: '/fundamentals/unsupervised' },
      { id: 'reinforcement', label: 'Reinforcement Learning', path: '/fundamentals/reinforcement' },
    ],
  },
  {
    id: 'predictive',
    label: 'Predictive Algorithms',
    path: '/predictive',
    color: 'cyan',
    description: 'Classical machine learning algorithms for regression, classification, and ranking.',
    algorithms: [
      { id: 'linear-regression', label: 'Linear Regression', path: '/predictive/linear-regression', complexity: 'O(nd)' },
      { id: 'logistic-regression', label: 'Logistic Regression', path: '/predictive/logistic-regression', complexity: 'O(nd)' },
      { id: 'decision-tree', label: 'Decision Tree', path: '/predictive/decision-tree', complexity: 'O(n log n · d)' },
      { id: 'random-forest', label: 'Random Forest', path: '/predictive/random-forest', complexity: 'O(k · n log n · d)' },
      { id: 'svm', label: 'Support Vector Machine', path: '/predictive/svm', complexity: 'O(n²d)' },
      { id: 'knn', label: 'K-Nearest Neighbors', path: '/predictive/knn', complexity: 'O(nd) query' },
      { id: 'gradient-boosting', label: 'Gradient Boosting', path: '/predictive/gradient-boosting', complexity: 'O(k · n log n)' },
    ],
  },
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    path: '/deep-learning',
    color: 'violet',
    description: 'Neural network architectures that learn hierarchical representations from data.',
    algorithms: [
      { id: 'feedforward', label: 'Feedforward Networks', path: '/deep-learning/feedforward' },
      { id: 'cnn', label: 'Convolutional Neural Networks', path: '/deep-learning/cnn' },
      { id: 'rnn', label: 'RNNs & LSTMs', path: '/deep-learning/rnn' },
      { id: 'transformer', label: 'Transformers & Attention', path: '/deep-learning/transformer' },
    ],
  },
  {
    id: 'generative',
    label: 'Generative AI',
    path: '/generative',
    color: 'rose',
    description: 'Models that learn to generate new data — images, text, audio — from a learned distribution.',
    algorithms: [
      { id: 'gan', label: 'Generative Adversarial Networks', path: '/generative/gan' },
      { id: 'vae', label: 'Variational Autoencoders', path: '/generative/vae' },
      { id: 'diffusion', label: 'Diffusion Models', path: '/generative/diffusion' },
      { id: 'llm', label: 'Large Language Models', path: '/generative/llm' },
    ],
  },
  {
    id: 'applications',
    label: 'GenAI Applications',
    path: '/applications',
    color: 'amber',
    description: 'Real-world systems built on top of large language models.',
    algorithms: [
      { id: 'rag', label: 'Retrieval-Augmented Generation', path: '/applications/rag' },
      { id: 'agents', label: 'AI Agents', path: '/applications/agents' },
    ],
  },
]

export const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.id, s]))

export const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  cyan:    { bg: 'bg-cyan-100 dark:bg-cyan-900/30',    text: 'text-cyan-700 dark:text-cyan-300',    border: 'border-cyan-200 dark:border-cyan-800',    dot: 'bg-cyan-500' },
  violet:  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800', dot: 'bg-violet-500' },
  rose:    { bg: 'bg-rose-100 dark:bg-rose-900/30',   text: 'text-rose-700 dark:text-rose-300',   border: 'border-rose-200 dark:border-rose-800',   dot: 'bg-rose-500' },
  amber:   { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
}
