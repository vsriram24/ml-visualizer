# Machine Learning Vista

**An interactive reference for machine learning algorithms — built with React, D3.js, and Claude Code.**

> Live site → **[vsriram24.github.io/ml-visualizer](https://vsriram24.github.io/ml-visualizer/)**

---

## What it is

Machine Learning Vista is a free, open-source visualization resource for anyone who wants stronger intuition about how ML algorithms work. Every page pairs a core equation with an interactive D3 animation, annotated variables, key conceptual ideas, a reference implementation, and citations to the original literature.

The goal is not to replace textbooks or papers — it is to make their contents *visceral*. Watching gradient descent converge in real time, dragging data points and seeing a decision boundary update instantly, or tracing message passing through a graph: these experiences build intuition that a static derivation rarely achieves.

---

## Algorithms covered

### ML Fundamentals
| Algorithm | Visualization |
|-----------|--------------|
| Supervised Learning | Labeled data → decision boundary demo |
| Unsupervised Learning | K-Means clustering animation |
| Reinforcement Learning | Q-learning grid world |

### Predictive Algorithms
| Algorithm | Complexity |
|-----------|-----------|
| Linear Regression | O(nd) |
| Logistic Regression | O(nd) |
| Decision Tree | O(n log n · d) |
| Random Forest | O(k · n log n · d) |
| Support Vector Machine | O(n²d) |
| K-Nearest Neighbors | O(nd) query |
| Gradient Boosting | O(k · n log n) |

### Deep Learning
- Feedforward Neural Networks
- Convolutional Neural Networks
- Vanilla RNN
- LSTM (Long Short-Term Memory)
- GRU (Gated Recurrent Unit)
- Graph Neural Networks
- Transformers & Attention

### Generative AI
- Generative Adversarial Networks (GAN)
- Variational Autoencoders (VAE)
- Diffusion Models
- Large Language Models

### GenAI Applications
- Retrieval-Augmented Generation (RAG)
- AI Agents (ReAct loop)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 18 |
| Build tool | Vite 6 |
| Routing | React Router v6 |
| Visualizations | D3.js v7 |
| Styling | Tailwind CSS 3 |
| Math rendering | KaTeX |
| Hosting | GitHub Pages |

All visualizations are authored in D3.js — D3 owns the SVG DOM entirely, React never touches it directly. Each algorithm page is code-split and lazy-loaded to keep the initial bundle lean.

---

## Local development

```bash
# Clone
git clone https://github.com/vsriram24/ml-visualizer.git
cd ml-visualizer

# Install dependencies
npm install

# Start dev server (hot-reload)
npm run dev
# → http://localhost:5173/ml-visualizer/

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project structure

```
src/
├── main.jsx                   # Entry point
├── App.jsx                    # Root layout (Navbar + Footer + Outlet)
├── router.jsx                 # All routes (lazy-loaded)
│
├── context/
│   └── ThemeContext.jsx        # Dark-mode context (always dark)
│
├── hooks/
│   ├── useD3.js               # React ref → D3 integration hook
│   └── useAnimationFrame.js   # rAF-based animation hook
│
├── components/
│   ├── layout/                # Navbar, Sidebar, Footer, PageWrapper
│   ├── ui/                    # MathDisplay, CitationBlock, CodeBlock, Badge, Tabs
│   ├── viz/                   # VizPanel (play/pause/reset/speed controls)
│   └── content/               # AlgorithmLayout (standard page wrapper)
│
├── pages/
│   ├── HomePage.jsx
│   ├── ReferencesPage.jsx
│   ├── AboutPage.jsx
│   ├── fundamentals/          # 3 pages
│   ├── predictive/            # 7 pages
│   ├── deep-learning/         # 7 pages
│   ├── generative/            # 4 pages
│   └── applications/          # 2 pages
│
├── visualizations/
│   ├── fundamentals/          # D3 vizzes for each fundamentals page
│   ├── predictive/            # D3 vizzes incl. drag-and-drop linear regression
│   ├── deep-learning/         # NeuralNetViz, CNNViz, RNNUnrollViz, LSTMGateViz,
│   │                          #   GRUGateViz, GNNViz, AttentionViz
│   ├── generative/            # GANTrainingViz, VAELatentSpaceViz, DiffusionViz,
│   │                          #   LLMNextTokenViz
│   └── applications/          # RAGViz, AgentLoopViz
│
└── data/
    ├── algorithms-meta.js     # Section + algorithm metadata (drives sidebar)
    └── citations-registry.js  # 27 APA-formatted citations
```

---

## Adding a new algorithm page

1. **Register** — add an entry to the appropriate `algorithms` array in `src/data/algorithms-meta.js`
2. **Route** — add a lazy import and child route in `src/router.jsx`
3. **Visualize** — create `src/visualizations/<section>/FooViz.jsx` using the `useTheme` hook for D3 color choices
4. **Page** — create `src/pages/<section>/FooPage.jsx` using `<AlgorithmLayout>` and `<VizPanel>`
5. **Cite** — add any new citations to `src/data/citations-registry.js`

```jsx
// Minimal page template
import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { FooViz, FOO_STEPS } from '../../visualizations/section/FooViz'

export default function FooPage() {
  return (
    <AlgorithmLayout
      name="Algorithm Name"
      tagline="One-sentence intuition."
      equation="f(x) = ..."
      equationLabel="What the equation computes"
      equationVars={[{ sym: 'x', desc: 'Input variable' }]}
      description="Full prose description."
      keyIdeas={['Key idea 1', 'Key idea 2']}
      code={`# Python implementation`}
      citations={['cite-key']}
    >
      <VizPanel totalSteps={FOO_STEPS} stepInterval={600} loops={true}>
        {({ step, resetKey }) => <FooViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
```

---

## How it was built

The entire site — from initial scaffolding through every interactive visualization — was developed using **[Claude Code](https://claude.ai/claude-code)**, Anthropic's agentic coding assistant. Claude Code handled component generation, D3 animation logic, routing, theming, citation management, and iterative refinement across the full codebase.

---

## Author

**Vivek Sriram** — Senior Health AI Scientist, Seattle WA
[viveksriram.com](https://viveksriram.com) · [GitHub](https://github.com/vsriram24)

---

## License

MIT — see [LICENSE](LICENSE) for details.
