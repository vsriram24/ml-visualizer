import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { DecisionTreeViz, DECISION_TREE_STEPS } from '../../visualizations/predictive/DecisionTreeViz'

const CODE = `from sklearn.tree import DecisionTreeClassifier
import numpy as np

# Gini impurity of a node
def gini(y):
    n = len(y)
    if n == 0: return 0
    classes, counts = np.unique(y, return_counts=True)
    p = counts / n
    return 1 - np.sum(p ** 2)

# Weighted Gini after a split
def gini_split(y_left, y_right):
    n = len(y_left) + len(y_right)
    return (len(y_left)/n)*gini(y_left) + (len(y_right)/n)*gini(y_right)

# sklearn usage
clf = DecisionTreeClassifier(max_depth=4, min_samples_leaf=5)
clf.fit(X_train, y_train)
predictions = clf.predict(X_test)`

export default function DecisionTreePage() {
  return (
    <AlgorithmLayout
      name="Decision Tree"
      tagline="Recursively partition the feature space to separate classes using axis-aligned splits."
      type="supervised"
      complexity="O(n log n · d) training; O(depth) inference"
      equation="\text{Gini}(t) = 1 - \sum_{k=1}^{K} p_k^2, \quad \text{split} = \underset{f,v}{\arg\min}\; \text{Gini}(t_{left}) \cdot \frac{n_l}{n} + \text{Gini}(t_{right}) \cdot \frac{n_r}{n}"
      equationLabel="Split criterion: minimize weighted Gini impurity"
      description="A decision tree recursively splits the training data by choosing the feature and threshold that minimizes impurity (Gini or entropy) in the resulting child nodes. Each leaf holds a majority-vote prediction. Trees are highly interpretable but prone to overfitting — controlled by limiting depth, minimum samples per leaf, or pruning."
      keyIdeas={[
        'Each internal node tests one feature against a threshold. Every split is axis-aligned (perpendicular to a feature axis).',
        'Gini impurity (CART algorithm) and information gain/entropy (ID3, C4.5) are the most common split criteria.',
        'Decision trees have low bias but high variance — they overfit easily. Max-depth and min-samples-leaf are key hyperparameters.',
        'Tree structure is fully interpretable: you can trace any prediction from root to leaf and read off the decision rules.',
      ]}
      code={CODE}
      citations={['quinlan1986id3', 'hastie2009esl']}
    >
      <VizPanel
        title="Decision Tree Structure"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Each internal node shows a feature split and its Gini impurity. Leaf nodes show the predicted class (colored). The tree builds top-down, adding nodes one at a time. Note how each split partitions the remaining data into purer subgroups."
        citations={['quinlan1986id3']}
        totalSteps={DECISION_TREE_STEPS}
        stepInterval={400}
      >
        {({ step, resetKey }) => <DecisionTreeViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
