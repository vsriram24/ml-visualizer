import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { LSTMGateViz, LSTM_STEPS } from '../../visualizations/deep-learning/LSTMGateViz'

const CODE = `import torch
import torch.nn as nn

class LSTM(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # LSTM returns BOTH hidden state h_n AND cell state c_n
        out, (h_n, c_n) = self.lstm(x)
        # c_n carries long-range memory that bypasses many timesteps
        return self.fc(out[:, -1, :])

# Key difference from vanilla RNN: 4 gates (forget, input, candidate, output)
# and a dedicated cell state c_t that flows with minimal interference —
# the "constant error carousel" that prevents vanishing gradients.`

export default function LSTMPage() {
  return (
    <AlgorithmLayout
      name="LSTM"
      tagline="Long Short-Term Memory networks use a gated cell state to preserve information over hundreds of timesteps."
      equation="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t"
      equationLabel="Cell state update: forget old info, write new info"
      equationVars={[
        { sym: 'c_t',             desc: 'Cell state at time t — the "memory highway" that carries long-range context' },
        { sym: 'f_t',             desc: 'Forget gate output ∈ (0,1): how much of c_{t-1} to keep (0 = forget all)' },
        { sym: 'i_t',             desc: 'Input gate output ∈ (0,1): how much of the new candidate to write' },
        { sym: '\\tilde{c}_t',    desc: 'Candidate cell values = tanh(Wc·[h_{t-1}, xₜ]), the proposed new content' },
        { sym: '\\odot',          desc: 'Element-wise (Hadamard) multiplication' },
        { sym: 'h_t',             desc: 'Hidden state output: h_t = o_t ⊙ tanh(c_t), exposed to the next layer' },
        { sym: 'o_t',             desc: 'Output gate ∈ (0,1): controls how much of the cell state to reveal as h_t' },
      ]}
      description="LSTMs solve the vanishing-gradient problem of vanilla RNNs by introducing a cell state cₜ — a separate memory vector that flows through time with minimal multiplicative interference. Four learnable gates (forget, input, candidate, output) provide fine-grained control over what is read, written, or erased from this memory. Crucially, the gradient can flow backward through the additive cell state update without being multiplied by any weight matrix, allowing the network to learn dependencies spanning hundreds or thousands of timesteps."
      keyIdeas={[
        'Two state vectors: hₜ (short-term hidden state, exposed to next layer) and cₜ (long-term cell state, internal memory highway).',
        'Forget gate fₜ = σ(Wf·[h_{t-1}, xₜ]): a sigmoid output near 1 preserves the cell state, near 0 erases it.',
        'Input gate iₜ and candidate c̃ₜ together decide what new information to write: cₜ += iₜ ⊙ c̃ₜ.',
        'The additive cell state update is the key insight: gradients can flow backward across many steps without vanishing, because the path through cₜ involves addition, not multiplication by Wh.',
      ]}
      code={CODE}
      citations={['hochreiter1997lstm', 'goodfellow2016dl']}
    >
      <VizPanel
        title="LSTM Gate Operations"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Watch each gate activate in sequence. The dashed amber line is the cell state highway — it flows with minimal interference. The forget gate erases, input+candidate write, and the output gate decides what to expose as hₜ."
        citations={['hochreiter1997lstm']}
        totalSteps={LSTM_STEPS}
        stepInterval={900}
        loops={true}
      >
        {({ step, resetKey }) => <LSTMGateViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
