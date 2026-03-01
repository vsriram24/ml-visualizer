import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { RNNUnrollViz, RNN_STEPS } from '../../visualizations/deep-learning/RNNUnrollViz'

const CODE = `import torch
import torch.nn as nn

# Vanilla RNN
class RNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.rnn = nn.RNN(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):                   # x: (batch, seq_len, input_size)
        out, h_n = self.rnn(x)             # out: (batch, seq_len, hidden_size)
        return self.fc(out[:, -1, :])       # last timestep only

# LSTM — adds cell state c_t for long-term memory
class LSTM(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, (h_n, c_n) = self.lstm(x)
        return self.fc(out[:, -1, :])       # c_n carries long-range context`

export default function RNNPage() {
  return (
    <AlgorithmLayout
      name="RNNs & LSTMs"
      tagline="Process sequences by maintaining a hidden state that accumulates information over time."
      equation="h_t = \tanh\bigl(W_h h_{t-1} + W_x x_t + b\bigr)"
      equationLabel="Vanilla RNN: hidden state hₜ combines previous state and current input"
      description="Recurrent Neural Networks process sequences by maintaining a hidden state that is updated at each timestep. The same set of weights is applied at every step (weight tying), allowing RNNs to handle variable-length sequences. However, vanilla RNNs struggle with long-range dependencies due to vanishing/exploding gradients. LSTMs solve this with a gating mechanism: forget, input, and output gates selectively read, write, and erase a cell state cₜ, allowing gradients to flow over hundreds of timesteps."
      keyIdeas={[
        'The hidden state hₜ is a summary of all information seen up to timestep t. Information from early timesteps can decay exponentially.',
        'LSTM gates: forget gate decides what to erase from cell state; input gate decides what to add; output gate decides what to expose as hₜ.',
        'Bidirectional RNNs process sequences in both directions, giving each timestep access to both past and future context.',
        'Transformers have largely replaced RNNs for NLP (parallelizable, no sequential bottleneck), but RNNs still dominate in streaming/online settings.',
      ]}
      code={CODE}
      citations={['hochreiter1997lstm', 'goodfellow2016dl']}
    >
      <VizPanel
        title="RNN Unrolled Through Time"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Each cell processes one token and passes its hidden state hₜ to the next cell (purple arrows). The final hidden state h₄ summarizes the entire sequence and is used for prediction. Press Reset to replay the animation."
        citations={['hochreiter1997lstm']}
        totalSteps={RNN_STEPS}
        stepInterval={600}
      >
        {({ step, resetKey }) => <RNNUnrollViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
