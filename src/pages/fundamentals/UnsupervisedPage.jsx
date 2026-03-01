import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { UnsupervisedViz, UNSUPERVISED_STEPS } from '../../visualizations/fundamentals/UnsupervisedViz'

export default function UnsupervisedPage() {
  return (
    <AlgorithmLayout
      name="Unsupervised Learning"
      tagline="Discovering hidden structure in data without any labeled examples."
      type="unsupervised"
      equation="\underset{\mu_1,\ldots,\mu_k}{\arg\min} \sum_{i=1}^n \min_j \|x_i - \mu_j\|^2"
      equationLabel="K-Means objective: minimize within-cluster sum of squared distances"
      description="Unsupervised learning finds patterns, structure, and representations in unlabeled data. The model receives only inputs X — no labels — and must discover clusters, manifolds, densities, or latent factors on its own. This makes it applicable to any dataset and useful for exploratory analysis, compression, and anomaly detection."
      keyIdeas={[
        'No ground-truth labels are needed — the model learns from the data distribution itself.',
        'Clustering (K-Means, DBSCAN) groups similar examples; dimensionality reduction (PCA, UMAP) finds compact representations.',
        'Autoencoders and VAEs learn compressed latent spaces that capture the data\'s generative factors.',
        'Evaluation is intrinsically harder than supervised learning — there is no single right answer.',
      ]}
      citations={['bishop2006prml', 'hastie2009esl']}
    >
      <VizPanel
        title="K-Means Clustering"
        badge="interactive"
        badgeLabel="Interactive"
        caption="Adjust K and step through K-means iterations. Centroids (✕) initialize randomly at step 0, then iteratively refine by assigning each point to the nearest centroid and moving centroids to the cluster mean. Press Play or Step to advance."
        citations={['bishop2006prml']}
        totalSteps={UNSUPERVISED_STEPS}
        stepInterval={700}
      >
        {({ step, resetKey }) => <UnsupervisedViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
