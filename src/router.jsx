import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import App from './App'

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Loading...</span>
      </div>
    </div>
  )
}

function L(importFn) {
  const C = lazy(importFn)
  return (props) => (
    <Suspense fallback={<Loading />}>
      <C {...props} />
    </Suspense>
  )
}

const HomePage        = L(() => import('./pages/HomePage'))

// Fundamentals
const FundamentalsPage    = L(() => import('./pages/fundamentals/FundamentalsPage'))
const SupervisedPage      = L(() => import('./pages/fundamentals/SupervisedPage'))
const UnsupervisedPage    = L(() => import('./pages/fundamentals/UnsupervisedPage'))
const ReinforcementPage   = L(() => import('./pages/fundamentals/ReinforcementPage'))

// Predictive
const PredictivePage      = L(() => import('./pages/predictive/PredictivePage'))
const LinearRegPage       = L(() => import('./pages/predictive/LinearRegressionPage'))
const LogisticRegPage     = L(() => import('./pages/predictive/LogisticRegressionPage'))
const DecisionTreePage    = L(() => import('./pages/predictive/DecisionTreePage'))
const RandomForestPage    = L(() => import('./pages/predictive/RandomForestPage'))
const SVMPage             = L(() => import('./pages/predictive/SVMPage'))
const KNNPage             = L(() => import('./pages/predictive/KNNPage'))
const GradBoostPage       = L(() => import('./pages/predictive/GradientBoostingPage'))

// Deep Learning
const DeepLearningPage    = L(() => import('./pages/deep-learning/DeepLearningPage'))
const FeedForwardPage     = L(() => import('./pages/deep-learning/FeedForwardPage'))
const CNNPage             = L(() => import('./pages/deep-learning/CNNPage'))
const RNNPage             = L(() => import('./pages/deep-learning/RNNPage'))
const TransformerPage     = L(() => import('./pages/deep-learning/TransformerPage'))

// Generative
const GenerativePage      = L(() => import('./pages/generative/GenerativePage'))
const GANPage             = L(() => import('./pages/generative/GANPage'))
const VAEPage             = L(() => import('./pages/generative/VAEPage'))
const DiffusionPage       = L(() => import('./pages/generative/DiffusionPage'))
const LLMPage             = L(() => import('./pages/generative/LLMPage'))

// Applications
const ApplicationsPage    = L(() => import('./pages/applications/ApplicationsPage'))
const RAGPage             = L(() => import('./pages/applications/RAGPage'))
const AgentsPage          = L(() => import('./pages/applications/AgentsPage'))

// References
const ReferencesPage      = L(() => import('./pages/ReferencesPage'))
const NotFoundPage        = L(() => import('./pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },

      // Fundamentals
      {
        path: 'fundamentals',
        element: <FundamentalsPage />,
        children: [
          { index: true, element: <Navigate to="supervised" replace /> },
          { path: 'supervised',    element: <SupervisedPage /> },
          { path: 'unsupervised',  element: <UnsupervisedPage /> },
          { path: 'reinforcement', element: <ReinforcementPage /> },
        ],
      },

      // Predictive
      {
        path: 'predictive',
        element: <PredictivePage />,
        children: [
          { index: true, element: <Navigate to="linear-regression" replace /> },
          { path: 'linear-regression',   element: <LinearRegPage /> },
          { path: 'logistic-regression', element: <LogisticRegPage /> },
          { path: 'decision-tree',       element: <DecisionTreePage /> },
          { path: 'random-forest',       element: <RandomForestPage /> },
          { path: 'svm',                 element: <SVMPage /> },
          { path: 'knn',                 element: <KNNPage /> },
          { path: 'gradient-boosting',   element: <GradBoostPage /> },
        ],
      },

      // Deep Learning
      {
        path: 'deep-learning',
        element: <DeepLearningPage />,
        children: [
          { index: true, element: <Navigate to="feedforward" replace /> },
          { path: 'feedforward', element: <FeedForwardPage /> },
          { path: 'cnn',         element: <CNNPage /> },
          { path: 'rnn',         element: <RNNPage /> },
          { path: 'transformer', element: <TransformerPage /> },
        ],
      },

      // Generative AI
      {
        path: 'generative',
        element: <GenerativePage />,
        children: [
          { index: true, element: <Navigate to="gan" replace /> },
          { path: 'gan',       element: <GANPage /> },
          { path: 'vae',       element: <VAEPage /> },
          { path: 'diffusion', element: <DiffusionPage /> },
          { path: 'llm',       element: <LLMPage /> },
        ],
      },

      // Applications
      {
        path: 'applications',
        element: <ApplicationsPage />,
        children: [
          { index: true, element: <Navigate to="rag" replace /> },
          { path: 'rag',    element: <RAGPage /> },
          { path: 'agents', element: <AgentsPage /> },
        ],
      },

      { path: 'references', element: <ReferencesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], {
  basename: '/ml-visualizer',
})
