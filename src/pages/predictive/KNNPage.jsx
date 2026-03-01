import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { KNNViz } from '../../visualizations/predictive/KNNViz'

const CODE = `import numpy as np
from collections import Counter

class KNN:
    def __init__(self, k=5, metric='euclidean'):
        self.k = k
        self.metric = metric

    def fit(self, X, y):
        self.X_train, self.y_train = X, y

    def predict(self, X):
        return np.array([self._predict_one(x) for x in X])

    def _predict_one(self, x):
        # Compute distances to all training points
        dists = np.linalg.norm(self.X_train - x, axis=1)
        # K nearest neighbors
        k_idx = np.argsort(dists)[:self.k]
        k_labels = self.y_train[k_idx]
        # Majority vote
        return Counter(k_labels).most_common(1)[0][0]`

export default function KNNPage() {
  return (
    <AlgorithmLayout
      name="K-Nearest Neighbors"
      tagline="Classify a new point by majority vote among its K closest training examples."
      type="supervised"
      complexity="O(nd) per query (brute force); O(d log n) with KD-tree"
      equation="\hat{y} = \text{majority\_vote}\bigl(\{y_i : i \in \mathcal{N}_K(x)\}\bigr), \quad \mathcal{N}_K(x) = K \text{ nearest training points}"
      equationLabel="KNN prediction: majority vote among K nearest neighbors"
      equationVars={[
        { sym: '\\hat{y}', desc: 'Predicted class label for query point x' },
        { sym: 'K', desc: 'Number of nearest neighbors to consider — smaller K = more local, larger K = smoother boundary' },
        { sym: '\\mathcal{N}_K(x)', desc: 'Set of K training points closest to query x under the chosen distance metric' },
        { sym: 'y_i', desc: 'Class label of the i-th neighbor' },
        { sym: '\\text{majority\\_vote}', desc: 'Returns the most common class label among the K neighbors' },
      ]}
      description="K-Nearest Neighbors is a non-parametric, instance-based learning algorithm. It makes no assumptions about the data distribution — it simply memorizes the training set. At inference time, it finds the K closest training points to the query (by Euclidean or other distance) and returns the majority class. KNN has no training cost but high inference cost and memory usage."
      keyIdeas={[
        'KNN is lazy — it stores the entire training set and defers all computation to inference time.',
        'The choice of K is critical: K=1 overfits; large K smooths the boundary (underfitting). Cross-validation selects optimal K.',
        'Distance metric matters: Euclidean, Manhattan, cosine, Minkowski. Features should be normalized — high-variance features dominate distance.',
        'The curse of dimensionality: in high dimensions, distances become concentrated and neighbors become less meaningful.',
      ]}
      code={CODE}
      citations={['fix1951knn', 'hastie2009esl']}
    >
      <VizPanel
        title="KNN Classification"
        badge="interactive"
        badgeLabel="Interactive"
        caption="Click anywhere to classify that point. The expanding radius shows the search area until K neighbors are found. Each neighbor is connected by a line. Adjust K to see how the decision changes — K=1 uses only the single nearest neighbor, K=15 uses a wider consensus."
        citations={['fix1951knn']}
        showControls={false}
      >
        {({ resetKey }) => <KNNViz resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
