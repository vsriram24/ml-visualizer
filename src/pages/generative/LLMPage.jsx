import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { LLMNextTokenViz, LLM_STEPS } from '../../visualizations/generative/LLMNextTokenViz'

const CODE = `import torch
import torch.nn as nn

# Decoder-only Transformer (GPT-style)
class GPT(nn.Module):
    def __init__(self, vocab_size, d_model=512, n_heads=8, n_layers=6, max_len=1024):
        super().__init__()
        self.tok_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_len, d_model)
        self.blocks = nn.ModuleList([TransformerBlock(d_model, n_heads) for _ in range(n_layers)])
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)

    def forward(self, idx):
        B, T = idx.shape
        tok = self.tok_emb(idx)
        pos = self.pos_emb(torch.arange(T, device=idx.device))
        x = tok + pos
        for block in self.blocks:
            x = block(x)
        logits = self.head(self.ln_f(x))  # (B, T, vocab_size)
        return logits

# Autoregressive generation with temperature + top-k sampling
def generate(model, prompt_ids, max_new_tokens=100, temperature=1.0, top_k=50):
    for _ in range(max_new_tokens):
        logits = model(prompt_ids)[:, -1, :] / temperature
        if top_k > 0:
            topk_vals, _ = torch.topk(logits, top_k)
            logits[logits < topk_vals[:, -1:]] = float('-inf')
        probs = torch.softmax(logits, dim=-1)
        next_id = torch.multinomial(probs, 1)
        prompt_ids = torch.cat([prompt_ids, next_id], dim=1)
    return prompt_ids`

export default function LLMPage() {
  return (
    <AlgorithmLayout
      name="Large Language Models"
      tagline="Autoregressive transformers that predict the next token, trained on massive text corpora."
      equation="P(x_{t+1} \mid x_1, \ldots, x_t) = \text{softmax}\!\left(\frac{W_e^\top \text{Transformer}(x_1, \ldots, x_t)}{\sqrt{d}}\right)"
      equationLabel="LLM: predict next token probability over vocabulary at each position"
      description="Large Language Models are decoder-only transformers trained with the causal language modeling objective: predict the next token given all previous tokens. Trained on internet-scale text (hundreds of billions of tokens), they develop emergent capabilities — arithmetic, reasoning, code generation, instruction following — as scale increases. Text is generated autoregressively: sample one token, append it, repeat. Sampling strategies (temperature, top-k, nucleus) control diversity vs. quality."
      keyIdeas={[
        'Causal masking ensures each position can only attend to previous positions, making the model autoregressive and enabling efficient teacher-forcing during training.',
        'Tokenization (BPE/WordPiece) maps variable-length text to a fixed vocabulary (~50k tokens). Tokens, not words, are the fundamental unit.',
        'Temperature rescales logits before softmax. T→0 = greedy (always pick the most likely token); T→∞ = uniform random. Typical generation uses T=0.7–1.0.',
        'Emergent capabilities: few-shot learning, chain-of-thought reasoning, and instruction following emerge at sufficient scale (100B+ parameters) without explicit training.',
      ]}
      code={CODE}
      citations={['vaswani2017attention', 'radford2019gpt2']}
    >
      <VizPanel
        title="Next-Token Prediction"
        badge="precomputed"
        badgeLabel="Interactive"
        caption="The context window shows tokens seen so far. The bar chart shows top-8 candidate next tokens with their softmax probabilities. Adjust Temperature: low T sharpens the distribution (confident prediction); high T flattens it (more diverse/random). Click step buttons to advance token by token."
        citations={['radford2019gpt2', 'vaswani2017attention']}
        totalSteps={LLM_STEPS}
        stepInterval={2000}
        loops={true}
      >
        {({ step, resetKey }) => <LLMNextTokenViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
