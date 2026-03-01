import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { LogisticRegressionViz, LOGISTIC_STEPS } from '../../visualizations/predictive/LogisticRegressionViz'

const CODE = `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def fit(X, y, lr=0.1, epochs=1000):
    X_b = np.c_[np.ones(len(X)), X]
    theta = np.zeros(X_b.shape[1])
    n = len(y)
    for _ in range(epochs):
        h = sigmoid(X_b @ theta)
        grad = (1/n) * X_b.T @ (h - y)
        theta -= lr * grad
    return theta

def predict_proba(X, theta):
    X_b = np.c_[np.ones(len(X)), X]
    return sigmoid(X_b @ theta)

def predict(X, theta, threshold=0.5):
    return (predict_proba(X, theta) >= threshold).astype(int)`

export default function LogisticRegressionPage() {
  return (
    <AlgorithmLayout
      name="Logistic Regression"
      tagline="Model binary classification probabilities with a learned linear decision boundary."
      type="supervised"
      complexity="O(nd) per gradient step"
      equation="P(y=1\mid x) = \sigma(\mathbf{x}^\top \boldsymbol{\theta}) = \frac{1}{1 + e^{-\mathbf{x}^\top\boldsymbol{\theta}}}"
      equationLabel="Logistic function — maps any linear score to a probability in [0, 1]"
      description="Logistic regression predicts the probability that an input belongs to the positive class by passing a linear score through the sigmoid function. It is trained by maximizing the log-likelihood (equivalent to minimizing binary cross-entropy) via gradient descent. Despite its name, it is a classification model, not a regression model."
      keyIdeas={[
        'The sigmoid σ(z) = 1/(1+e⁻ᶻ) squashes any real-valued score into a probability [0, 1].',
        'The decision boundary is where P(y=1|x) = 0.5, i.e., xᵀθ = 0 — a hyperplane in feature space.',
        'Binary cross-entropy loss: −[y log(p) + (1−y) log(1−p)]. This is convex → gradient descent finds the global optimum.',
        'Multiclass extension uses Softmax regression (one-vs-rest or multinomial). Regularization (L1/L2) prevents overfitting.',
      ]}
      code={CODE}
      citations={['bishop2006prml', 'hastie2009esl']}
    >
      <VizPanel
        title="Logistic Regression Decision Boundary"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Gradient descent convergence: the decision boundary starts at a poor initialization and iteratively shifts to separate the two classes. The background gradient sharpens each step as the model grows more confident. The final boundary sits at P(y=1|x) = 0.5."
        citations={['bishop2006prml']}
        totalSteps={LOGISTIC_STEPS}
        stepInterval={600}
      >
        {({ step, resetKey }) => <LogisticRegressionViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
