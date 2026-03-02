import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { RNNUnrollViz, RNN_STEPS } from '../../visualizations/deep-learning/RNNUnrollViz'

const CODE = `import torch
import torch.nn as nn

class RNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.rnn = nn.RNN(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):                   # x: (batch, seq_len, input_size)
        out, h_n = self.rnn(x)             # out: (batch, seq_len, hidden_size)
        return self.fc(out[:, -1, :])       # classify from final timestep

# Vanilla RNN suffers from vanishing gradients over long sequences.
# The same weight matrices Wh and Wx are applied at every timestep,
# so gradients decay (or explode) exponentially with sequence length.
# See LSTM and GRU for architectures that address this limitation.`

export default function RNNPage() {
  return (
    <AlgorithmLayout
      name="Vanilla RNN"
      tagline="Process sequences by passing a hidden state forward through each timestep."
      equation="h_t = \tanh\bigl(W_h h_{t-1} + W_x x_t + b\bigr)"
      equationLabel="Hidden state hₜ combines previous state and current input via shared weights"
      equationVars={[
        { sym: 'h_t',      desc: 'Hidden state at timestep t — a compressed summary of all past inputs' },
        { sym: 'h_{t-1}',  desc: 'Previous hidden state, carrying context from earlier timesteps' },
        { sym: 'x_t',      desc: 'Current input token / feature vector' },
        { sym: 'W_h',      desc: 'Recurrent weight matrix applied to the previous hidden state' },
        { sym: 'W_x',      desc: 'Input weight matrix applied to the current input' },
        { sym: 'b',        desc: 'Bias term' },
        { sym: '\\tanh',   desc: 'Squashes output to (−1, 1), keeping hidden state bounded' },
      ]}
      description="A Recurrent Neural Network (RNN) processes a sequence one token at a time. At each step it produces a new hidden state hₜ by combining the previous hidden state h_{t-1} with the current input xₜ using the same weight matrices throughout — a property called weight tying. This allows RNNs to handle variable-length sequences, but it also causes gradients to vanish or explode as they flow back through many timesteps. In practice, vanilla RNNs struggle to learn dependencies longer than ~10–20 steps. LSTM and GRU architectures were designed specifically to overcome this limitation."
      keyIdeas={[
        'Weight tying: the same Wh and Wx are reused at every timestep, giving the model a fixed parameter count regardless of sequence length.',
        'The hidden state hₜ is a lossy compression of the entire history seen so far — information from early tokens can fade over long sequences.',
        'Backpropagation through time (BPTT) unrolls the recurrence to compute gradients, but repeated multiplication by Wh causes vanishing or exploding gradients.',
        'Bidirectional RNNs stack a forward and a backward pass, giving each timestep access to both past and future context — useful for encoding tasks.',
      ]}
      code={CODE}
      citations={['goodfellow2016dl', 'olah2016attention']}
    >
      <VizPanel
        title="RNN Unrolled Through Time"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Each cell processes one token and passes its hidden state hₜ to the next cell (purple arrows). The final hidden state h₄ summarizes the entire sequence. Note how the same operation repeats at every step — and how information from step 0 must survive all the way to step 4."
        citations={['goodfellow2016dl']}
        totalSteps={RNN_STEPS}
        stepInterval={600}
      >
        {({ step, resetKey }) => <RNNUnrollViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
