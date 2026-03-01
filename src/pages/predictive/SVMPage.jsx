import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { SVMViz, SVM_STEPS } from '../../visualizations/predictive/SVMViz'

const CODE = `from sklearn.svm import SVC

# Linear SVM
clf_linear = SVC(kernel='linear', C=1.0)

# RBF kernel SVM (handles non-linear boundaries)
clf_rbf = SVC(kernel='rbf', C=1.0, gamma='scale')

# Polynomial kernel
clf_poly = SVC(kernel='poly', degree=3, C=1.0)

clf_rbf.fit(X_train, y_train)
predictions = clf_rbf.predict(X_test)

# Support vectors (the critical points)
print(f"Support vectors: {clf_rbf.support_vectors_.shape[0]}")`

export default function SVMPage() {
  return (
    <AlgorithmLayout
      name="Support Vector Machine"
      tagline="Find the maximum-margin hyperplane that best separates classes, using only the support vectors."
      type="supervised"
      complexity="O(n²d) to O(n³d) training; O(n_sv · d) inference"
      equation="\max_{w, b} \frac{2}{\|w\|} \quad \text{s.t.} \quad y_i(w^\top x_i + b) \geq 1 \;\forall i"
      equationLabel="Hard-margin SVM: maximize the margin 2/‖w‖ subject to correct classification"
      description="SVMs find the hyperplane that maximizes the margin between classes. Only the training points closest to the boundary — the support vectors — determine the solution. This makes SVMs memory-efficient and robust to outliers far from the boundary. The kernel trick allows SVMs to learn non-linear boundaries without explicitly computing features in high-dimensional space."
      keyIdeas={[
        'The maximum-margin hyperplane is the unique solution that maximizes the geometric distance between classes.',
        'Support vectors are the training points that lie on the margin boundaries. Remove any other point and the solution is unchanged.',
        'Soft-margin SVM (parameter C) allows some misclassifications. High C → hard margin (may overfit); low C → soft margin (underfitting).',
        'Kernel trick: K(x, x\') = φ(x)ᵀφ(x\') computes dot products in feature space without materializing φ(x). Enables RBF, polynomial, sigmoid kernels.',
      ]}
      code={CODE}
      citations={['cortes1995svm', 'bishop2006prml']}
    >
      <VizPanel
        title="Maximum Margin Hyperplane"
        badge="precomputed"
        badgeLabel="Animated"
        caption="The purple line is the decision boundary. Dashed cyan and red lines mark the margin boundaries. Highlighted points (gold rings) are support vectors — they define and constrain the margin. All other points could be removed without changing the solution."
        citations={['cortes1995svm']}
        totalSteps={SVM_STEPS}
        stepInterval={800}
      >
        {({ step, resetKey }) => <SVMViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
