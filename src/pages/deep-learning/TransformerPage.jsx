import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { AttentionViz, ATTN_STEPS } from '../../visualizations/deep-learning/AttentionViz'

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.d_k = d_model // n_heads
        self.n_heads = n_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, T, D = x.shape
        H = self.n_heads
        Q = self.W_q(x).view(B, T, H, self.d_k).transpose(1, 2)  # (B,H,T,dk)
        K = self.W_k(x).view(B, T, H, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(B, T, H, self.d_k).transpose(1, 2)
        # Scaled dot-product attention
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        attn = F.softmax(scores, dim=-1)
        out = (attn @ V).transpose(1, 2).contiguous().view(B, T, D)
        return self.W_o(out), attn`

export default function TransformerPage() {
  return (
    <AlgorithmLayout
      name="Transformers & Attention"
      tagline="Replace sequential processing with parallel self-attention, letting each token attend to every other."
      equation="\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V"
      equationLabel="Scaled dot-product attention — queries Q attend to keys K, retrieve values V"
      equationVars={[
        { sym: 'Q', desc: 'Query matrix — encodes what each token is looking for' },
        { sym: 'K', desc: 'Key matrix — encodes what each token offers to other queries' },
        { sym: 'V', desc: 'Value matrix — the actual content retrieved when a key is matched' },
        { sym: 'd_k', desc: 'Dimension of queries and keys — used to scale dot products and prevent vanishing gradients' },
        { sym: 'QK^\\top', desc: 'Raw attention scores — dot product similarity between every query-key pair' },
        { sym: '\\text{softmax}', desc: 'Normalizes scores to a probability distribution over positions' },
      ]}
      description="The Transformer architecture (Vaswani et al., 2017) replaces recurrence with self-attention, allowing all positions to attend to each other in parallel. This eliminates the sequential bottleneck of RNNs and enables efficient parallelization on GPUs. Multi-head attention runs h attention functions in parallel, each learning different relationship patterns (syntactic, semantic, positional). Combined with positional encodings and feedforward sublayers, Transformers are the foundation of GPT, BERT, T5, and virtually all modern large language models."
      keyIdeas={[
        'Self-attention: each position computes queries (what am I looking for?), keys (what do I offer?), and values (what do I provide?). Attention weights are softmax(QKᵀ/√dₖ).',
        'Multi-head attention: h parallel attention functions capture different relationship types simultaneously. Outputs are concatenated and projected.',
        'Positional encoding: since attention is permutation-invariant, position information is injected via sinusoidal or learned embeddings added to token embeddings.',
        'Quadratic complexity: attention over sequence length T costs O(T²d). Efficient variants (Flash Attention, linear attention) address this for long sequences.',
      ]}
      code={CODE}
      citations={['vaswani2017attention', 'olah2016attention']}
    >
      <VizPanel
        title="Multi-Head Attention Weights"
        badge="precomputed"
        badgeLabel="Precomputed"
        caption="Each cell (row i, col j) shows how much attention token i pays to token j. The highlighted row (purple border) is the active query token — play to cycle through each token's attention pattern. Switch between 4 attention heads to see how each head specializes: Head 1 captures subject-verb agreement, Head 2 semantic similarity, Head 3 long-range dependencies, Head 4 positional patterns. Darker = stronger attention."
        citations={['vaswani2017attention']}
        totalSteps={ATTN_STEPS}
        stepInterval={1200}
        loops={true}
      >
        {({ step, resetKey }) => <AttentionViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
