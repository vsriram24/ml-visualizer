import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { GRUGateViz, GRU_STEPS } from '../../visualizations/deep-learning/GRUGateViz'

const CODE = `import torch
import torch.nn as nn

class GRU(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.gru = nn.GRU(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # GRU returns only h_n — no separate cell state
        out, h_n = self.gru(x)
        return self.fc(out[:, -1, :])

# GRU vs LSTM parameter count (hidden_size = H, input_size = D):
#   LSTM: 4 * (H*(H+D) + H)   gates: forget, input, candidate, output
#   GRU:  3 * (H*(H+D) + H)   gates: reset, candidate, update
# GRU is ~25% smaller and trains faster, with comparable performance
# on most sequence tasks.`

export default function GRUPage() {
  return (
    <AlgorithmLayout
      name="GRU"
      tagline="Gated Recurrent Units achieve LSTM-level memory with fewer parameters by collapsing the cell state into a single hidden vector."
      equation="h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t"
      equationLabel="GRU output: interpolate between previous hidden state and candidate"
      equationVars={[
        { sym: 'h_t',          desc: 'New hidden state — the only state vector (no separate cell state)' },
        { sym: 'z_t',          desc: 'Update gate ∈ (0,1): how much of the new candidate to blend in' },
        { sym: 'h_{t-1}',      desc: 'Previous hidden state, carried forward with weight (1 − z_t)' },
        { sym: '\\tilde{h}_t', desc: 'Candidate hidden state: tanh(Wc·[r_t ⊙ h_{t-1}, xₜ])' },
        { sym: 'r_t',          desc: 'Reset gate ∈ (0,1): how much of h_{t-1} the candidate is allowed to see' },
        { sym: '\\odot',       desc: 'Element-wise (Hadamard) multiplication' },
      ]}
      description="The GRU (Gated Recurrent Unit) was introduced in 2014 as a streamlined alternative to the LSTM. The key architectural difference is the elimination of the separate cell state: the GRU merges the forget and input gates into a single update gate, and encodes everything into one hidden state hₜ. The reset gate rₜ controls how much of the past hidden state the candidate can see, allowing the network to effectively 'reset' when starting a new topic. With roughly 25% fewer parameters than an LSTM, GRUs often converge faster and perform comparably on tasks with moderate sequence lengths."
      keyIdeas={[
        'Single state vector: GRUs have only hₜ — no separate cell state cₜ. The update gate replaces the LSTM\'s forget + input gate pair.',
        'Reset gate rₜ: when rₜ ≈ 0, the candidate ignores hₜ₋₁ entirely, effectively allowing a "fresh start" at a new sentence or segment.',
        'Update gate zₜ: acts as a learned interpolation weight. When zₜ ≈ 1, hₜ ≈ c̃ₜ (full update); when zₜ ≈ 0, hₜ ≈ hₜ₋₁ (carry forward with no change).',
        'LSTM vs GRU: LSTMs tend to outperform on very long sequences where the cell state highway matters. GRUs are faster to train and competitive on shorter sequences or when compute is limited.',
      ]}
      code={CODE}
      citations={['cho2014gru', 'goodfellow2016dl']}
    >
      <VizPanel
        title="GRU Gate Operations"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Compare with the LSTM: the top bypass path carries h_{t-1} directly to the output (no separate cell highway). The reset gate gates how much h_{t-1} the candidate sees. The update gate decides how much of the candidate vs. the old state to keep."
        citations={['cho2014gru']}
        totalSteps={GRU_STEPS}
        stepInterval={900}
        loops={true}
      >
        {({ step, resetKey }) => <GRUGateViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
