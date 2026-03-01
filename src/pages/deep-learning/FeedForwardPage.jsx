import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { NeuralNetViz, NEURAL_NET_STEPS } from '../../visualizations/deep-learning/NeuralNetViz'

const CODE = `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dims, output_dim):
        super().__init__()
        dims = [input_dim] + hidden_dims + [output_dim]
        layers = []
        for i in range(len(dims) - 1):
            layers.append(nn.Linear(dims[i], dims[i+1]))
            if i < len(dims) - 2:
                layers.append(nn.ReLU())
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

model = MLP(input_dim=2, hidden_dims=[64, 64], output_dim=1)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.BCEWithLogitsLoss()

# Training loop
for epoch in range(100):
    logits = model(X_train).squeeze()
    loss = loss_fn(logits, y_train.float())
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`

export default function FeedForwardPage() {
  return (
    <AlgorithmLayout
      name="Feedforward Neural Networks"
      tagline="Stack layers of linear transformations and non-linear activations to learn hierarchical representations."
      equation="h^{(l)} = \sigma\bigl(W^{(l)} h^{(l-1)} + b^{(l)}\bigr), \quad \hat{y} = h^{(L)}"
      equationLabel="Layer-by-layer forward pass with activation function σ"
      description="A feedforward network (multilayer perceptron, MLP) computes predictions by passing input through successive layers of affine transformations and non-linear activations. The Universal Approximation Theorem guarantees that a network with one hidden layer of sufficient width can approximate any continuous function — but depth enables more efficient representations. Training uses backpropagation to compute gradients via the chain rule."
      keyIdeas={[
        'Each layer learns increasingly abstract representations: early layers detect edges/patterns, later layers combine them into concepts.',
        'Activation functions (ReLU, GELU, Swish) introduce non-linearity. ReLU dominates due to its simplicity and gradient flow properties.',
        'Backpropagation computes ∂L/∂W for every layer via the chain rule. Automatic differentiation (PyTorch/JAX) handles this transparently.',
        'Regularization: dropout randomly zeros activations during training; weight decay (L2) penalizes large weights. Batch normalization stabilizes training.',
      ]}
      code={CODE}
      citations={['rumelhart1986backprop', 'goodfellow2016dl']}
    >
      <VizPanel
        title="Forward Pass Visualization"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Press Play to activate the network with a random input. Activations propagate left to right — node brightness reflects activation strength. Edge thickness and color (blue=positive, red=negative) encode weight magnitude and sign. Each forward pass uses different random inputs."
        citations={['goodfellow2016dl']}
        totalSteps={NEURAL_NET_STEPS}
        stepInterval={600}
        loops={true}
      >
        {({ step, resetKey }) => <NeuralNetViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
