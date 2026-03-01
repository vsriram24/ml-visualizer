import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { GradientBoostingViz } from '../../visualizations/predictive/GradientBoostingViz'

const CODE = `from sklearn.ensemble import GradientBoostingRegressor
import numpy as np

# Gradient boosting builds trees sequentially.
# Each tree fits the negative gradient of the loss (residuals for MSE).
gbm = GradientBoostingRegressor(
    n_estimators=100,   # number of boosting rounds
    learning_rate=0.1,  # shrinkage: smaller = more regularization
    max_depth=3,        # shallow trees (stumps to depth 5 are common)
    subsample=0.8,      # stochastic GBM: row subsampling per tree
    random_state=42
)
gbm.fit(X_train, y_train)

# XGBoost (faster, regularized)
import xgboost as xgb
xgb_model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=4)
xgb_model.fit(X_train, y_train)`

export default function GradientBoostingPage() {
  return (
    <AlgorithmLayout
      name="Gradient Boosting"
      tagline="Build a strong predictor by sequentially fitting shallow trees to the residuals of the current ensemble."
      type="supervised"
      complexity="O(k · n log n · d) training"
      equation="F_m(x) = F_{m-1}(x) + \eta \cdot h_m(x), \quad h_m = \underset{h}{\arg\min} \sum_{i=1}^n \left[-g_i - h(x_i)\right]^2"
      equationLabel="Gradient boosting update: each tree hₘ fits negative gradients gᵢ = ∂L/∂F(xᵢ)"
      description="Gradient Boosting builds an additive model by training trees one at a time, where each tree corrects the errors of all previous trees. For MSE loss, this means each tree fits the residuals of the current ensemble. The learning rate η controls how much each tree contributes, providing regularization. Modern variants (XGBoost, LightGBM, CatBoost) add additional regularization and speed."
      keyIdeas={[
        'Sequential fitting: tree m corrects the errors of the ensemble F_{m-1}. This is fundamentally different from Random Forest\'s parallel training.',
        'For MSE loss, the negative gradient equals the residual: −gᵢ = yᵢ − F_{m-1}(xᵢ). Other losses yield different pseudo-residuals.',
        'The learning rate η (shrinkage) scales each tree\'s contribution. Small η + many trees often outperforms large η + few trees.',
        'XGBoost adds second-order Taylor expansion of the loss + explicit regularization (L1/L2 on leaf weights). LightGBM uses leaf-wise growth for speed.',
      ]}
      code={CODE}
      citations={['friedman2001gbm', 'hastie2009esl']}
    >
      <VizPanel
        title="Gradient Boosting — Residual Reduction"
        badge="interactive"
        badgeLabel="Interactive"
        caption="Adjust the number of trees and watch the ensemble prediction (purple) converge to the true function (green). Colored arrows show residuals — the signal each new tree must fit. More trees reduce MSE but risk overfitting. Note: with too many trees and no learning rate, the ensemble begins to interpolate noise."
        citations={['friedman2001gbm']}
        showControls={false}
      >
        {({ resetKey }) => <GradientBoostingViz resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
