import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { LinearRegressionViz } from '../../visualizations/predictive/LinearRegressionViz'

const CODE = `import numpy as np

# Ordinary Least Squares via the normal equation
def fit(X, y):
    # Add bias column
    X_b = np.c_[np.ones(len(X)), X]
    # θ = (XᵀX)⁻¹ Xᵀy
    return np.linalg.pinv(X_b.T @ X_b) @ X_b.T @ y

def predict(X, theta):
    X_b = np.c_[np.ones(len(X)), X]
    return X_b @ theta

# Gradient descent alternative
def fit_gd(X, y, lr=0.01, epochs=1000):
    X_b = np.c_[np.ones(len(X)), X]
    theta = np.zeros(X_b.shape[1])
    n = len(y)
    for _ in range(epochs):
        grad = (2/n) * X_b.T @ (X_b @ theta - y)
        theta -= lr * grad
    return theta`

export default function LinearRegressionPage() {
  return (
    <AlgorithmLayout
      name="Linear Regression"
      tagline="Fit a linear function to data by minimizing the sum of squared residuals."
      type="supervised"
      complexity="O(nd) per gradient step; O(nd²) closed form"
      equation="\hat{y} = \theta_0 + \theta_1 x_1 + \cdots + \theta_d x_d = \mathbf{x}^\top \boldsymbol{\theta}"
      equationLabel="Prediction equation"
      description="Linear regression models the relationship between a continuous target y and features x as a linear function. Parameters θ are estimated by minimizing the Mean Squared Error (MSE) loss — equivalent to finding the ordinary least squares solution. The closed-form normal equation gives the exact solution; gradient descent is preferred for large-scale data."
      keyIdeas={[
        'Assumes a linear relationship between inputs and output. Non-linearity requires feature engineering (polynomial features) or non-linear models.',
        'The normal equation θ = (XᵀX)⁻¹Xᵀy gives the exact OLS solution but has O(nd²) cost. Gradient descent scales better.',
        'Regularization (Ridge = L2, Lasso = L1) shrinks θ to reduce overfitting. Ridge has a closed form; Lasso promotes sparsity.',
        'Residuals = actual − predicted. Inspecting residual plots reveals heteroskedasticity, non-linearity, or influential outliers.',
      ]}
      code={CODE}
      citations={['hastie2009esl', 'bishop2006prml']}
    >
      <VizPanel
        title="Interactive Linear Regression"
        badge="interactive"
        badgeLabel="Interactive"
        caption="Drag data points or click to add new ones. The regression line and MSE loss update in real time. Red lines show residuals (prediction errors). The optimal line minimizes the total squared residual length."
        citations={['hastie2009esl']}
        showControls={false}
      >
        {({ resetKey }) => <LinearRegressionViz resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
