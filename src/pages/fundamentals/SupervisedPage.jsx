import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { SupervisedViz, SUPERVISED_STEPS } from '../../visualizations/fundamentals/SupervisedViz'

export default function SupervisedPage() {
  return (
    <AlgorithmLayout
      name="Supervised Learning"
      tagline="Learning from labeled examples to predict outputs for unseen inputs."
      type="supervised"
      equation="\hat{y} = f_\theta(x), \quad \mathcal{L} = \frac{1}{n}\sum_{i=1}^{n} \ell(y_i, \hat{y}_i)"
      equationLabel="Objective: minimize loss over labeled training pairs (x, y)"
      equationVars={[
        { sym: '\\hat{y}', desc: 'Predicted output of the model' },
        { sym: 'f_\\theta(x)', desc: 'Model function with learned parameters θ' },
        { sym: '\\mathcal{L}', desc: 'Empirical loss averaged over the training set' },
        { sym: 'n', desc: 'Number of labeled training examples' },
        { sym: 'y_i', desc: 'Ground-truth label for the i-th example' },
        { sym: '\\ell(y_i, \\hat{y}_i)', desc: 'Per-example loss (e.g., MSE for regression, cross-entropy for classification)' },
      ]}
      description="In supervised learning, a model is trained on a dataset of input-output pairs (x, y). The model learns a mapping function f_θ that minimizes prediction error (loss) over the training set. At inference time, the trained model generalizes to new, unseen inputs. Supervised learning encompasses both regression (continuous targets) and classification (discrete labels)."
      keyIdeas={[
        'Requires a labeled dataset — every training example has a known ground-truth output.',
        'The model minimizes a loss function (e.g., MSE for regression, cross-entropy for classification) via optimization.',
        'Generalization — the ability to perform well on unseen data — is the central goal. Controlled by regularization, model capacity, and data volume.',
        'Common algorithms: Linear Regression, Logistic Regression, Decision Trees, SVMs, Neural Networks.',
      ]}
      citations={['bishop2006prml', 'hastie2009esl']}
    >
      <VizPanel
        title="Supervised Classification"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Watch labeled data points appear one at a time, followed by a decision boundary that separates the two classes. A new unlabeled point is then classified based on its position relative to the boundary. Press Play or Step to advance, Reset to replay."
        citations={['bishop2006prml']}
        totalSteps={SUPERVISED_STEPS}
        stepInterval={60}
      >
        {({ step, resetKey }) => <SupervisedViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
