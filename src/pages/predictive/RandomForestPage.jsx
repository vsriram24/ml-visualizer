import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { RandomForestViz, RANDOM_FOREST_STEPS } from '../../visualizations/predictive/RandomForestViz'

const CODE = `from sklearn.ensemble import RandomForestClassifier

# Key hyperparameters:
# n_estimators: number of trees (more = better but slower)
# max_features: features sampled per split (sqrt(d) for classification)
# max_depth: tree depth limit per tree
# bootstrap: True enables bagging (sampling with replacement)

clf = RandomForestClassifier(
    n_estimators=100,
    max_features='sqrt',
    max_depth=None,     # grow until pure leaves
    bootstrap=True,
    n_jobs=-1,          # parallel training
    random_state=42
)
clf.fit(X_train, y_train)

# Feature importances (mean decrease in Gini)
importances = clf.feature_importances_`

export default function RandomForestPage() {
  return (
    <AlgorithmLayout
      name="Random Forest"
      tagline="An ensemble of decorrelated decision trees trained on bootstrap samples with random feature subsets."
      type="supervised"
      complexity="O(k · n log n · d) training"
      equation="\hat{y} = \text{majority\_vote}\bigl(T_1(x), T_2(x), \ldots, T_k(x)\bigr)"
      equationLabel="Random forest: majority vote across k trees (classification)"
      description="Random Forest builds k decision trees on bootstrap-sampled subsets of the data, with each split considering only a random subset of features. By averaging many high-variance, decorrelated trees, the ensemble achieves low bias and low variance — far better generalization than any individual tree. It is one of the most reliable off-the-shelf algorithms."
      keyIdeas={[
        'Bagging (bootstrap aggregating): each tree trains on a sample drawn with replacement, introducing diversity.',
        'Feature subsampling: each split considers only √d features (for classification). This decorrelates trees beyond what bagging alone achieves.',
        'Out-of-bag (OOB) error: roughly 37% of samples are excluded from each tree — they serve as a free validation set.',
        'Feature importance: measured by the total decrease in Gini impurity attributable to each feature across all trees.',
      ]}
      code={CODE}
      citations={['breiman2001rf', 'hastie2009esl']}
    >
      <VizPanel
        title="Ensemble Voting"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Watch 6 decision trees activate one by one. Each tree makes its own prediction (blue = Class 0, red = Class 1) based on its bootstrap sample. The ensemble aggregates votes — the majority class wins (👑). Blue vote bars show each tree's class-0 vote ratio."
        citations={['breiman2001rf']}
        totalSteps={RANDOM_FOREST_STEPS}
        stepInterval={700}
      >
        {({ step, resetKey }) => <RandomForestViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
