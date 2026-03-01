import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { DiffusionViz, DIFFUSION_STEPS } from '../../visualizations/generative/DiffusionViz'

const CODE = `import torch
import torch.nn as nn

# DDPM: forward process adds Gaussian noise
def forward_diffusion(x0, t, noise_schedule):
    alpha_bar_t = noise_schedule['alpha_bar'][t]
    eps = torch.randn_like(x0)
    xt = torch.sqrt(alpha_bar_t) * x0 + torch.sqrt(1 - alpha_bar_t) * eps
    return xt, eps

# U-Net denoising model (simplified)
class DenoisingUNet(nn.Module):
    def __init__(self, channels=64):
        super().__init__()
        # Encoder
        self.enc = nn.Sequential(nn.Conv2d(1, channels, 3, padding=1), nn.SiLU())
        # Timestep embedding
        self.time_emb = nn.Embedding(1000, channels)
        # Decoder (predicts noise)
        self.dec = nn.Conv2d(channels, 1, 3, padding=1)

    def forward(self, xt, t):
        h = self.enc(xt) + self.time_emb(t).view(-1, -1, 1, 1)
        return self.dec(h)

# Reverse process: iteratively denoise
@torch.no_grad()
def sample(model, noise_schedule, T=1000, img_size=(1,28,28)):
    x = torch.randn(1, *img_size)
    for t in reversed(range(T)):
        t_tensor = torch.tensor([t])
        eps_pred = model(x, t_tensor)
        # DDPM reverse step
        alpha_t = noise_schedule['alpha'][t]
        alpha_bar_t = noise_schedule['alpha_bar'][t]
        beta_t = noise_schedule['beta'][t]
        x = (x - beta_t / torch.sqrt(1 - alpha_bar_t) * eps_pred) / torch.sqrt(alpha_t)
        if t > 0:
            x += torch.sqrt(beta_t) * torch.randn_like(x)
    return x`

export default function DiffusionPage() {
  return (
    <AlgorithmLayout
      name="Diffusion Models"
      tagline="Learn to reverse a gradual noising process, generating data by iteratively denoising pure noise."
      equation="q(x_t | x_0) = \mathcal{N}\!\left(x_t;\, \sqrt{\bar\alpha_t}\, x_0,\; (1-\bar\alpha_t)\mathbf{I}\right)"
      equationLabel="Forward process: xₜ is a noisy version of x₀ controlled by noise schedule ᾱₜ"
      equationVars={[
        { sym: 'q(x_t \\mid x_0)', desc: 'Forward (noising) process — distribution of the noisy sample xₜ given the clean original x₀' },
        { sym: 'x_0', desc: 'Original clean data (e.g., a real image)' },
        { sym: 'x_t', desc: 'Noisy version of the data at timestep t — increasingly corrupted as t grows' },
        { sym: 't', desc: 'Diffusion timestep — ranges from 0 (clean) to T (pure noise, typically T = 1000)' },
        { sym: '\\bar{\\alpha}_t', desc: 'Cumulative noise schedule coefficient — controls how much signal is retained at step t; approaches 0 as t → T' },
        { sym: '\\mathcal{N}(\\mu, \\sigma^2 \\mathbf{I})', desc: 'Isotropic Gaussian distribution with mean μ and variance σ²' },
        { sym: '\\mathbf{I}', desc: 'Identity matrix — noise is added independently to each dimension' },
      ]}
      description="Diffusion models define a forward Markov chain that gradually adds Gaussian noise to data over T timesteps until the signal becomes pure noise. A neural network (typically a U-Net) is trained to reverse this process — predicting the noise ε added at each step, so it can iteratively denoise from pure noise to a clean sample. DDPM (Ho et al., 2020) showed this matches or exceeds GAN quality on images. Score-based models (Song & Ermon) provide a continuous-time perspective."
      keyIdeas={[
        'Forward process qφ(xₜ|x₀) is fixed: each step adds a small Gaussian noise. After T=1000 steps, the data is completely isotropic Gaussian noise.',
        'The model learns the reverse: pθ(xₜ₋₁|xₜ). Rather than directly modeling the posterior, it predicts the noise ε added (Ho et al.) or the score ∇log p(xₜ).',
        'DDIM (Song et al.) enables deterministic sampling with 10-50 steps instead of 1000, using an implicit ODE formulation.',
        'Latent diffusion (Rombach et al. / Stable Diffusion) applies diffusion in a compressed VAE latent space rather than pixel space, dramatically reducing compute.',
      ]}
      code={CODE}
      citations={['ho2020ddpm', 'song2020score', 'weng2021diffusion']}
    >
      <VizPanel
        title="Forward & Reverse Diffusion Process"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Toggle between Forward (clean → noise) and Reverse (noise → clean) modes. Each frame shows a different timestep. Press Play to animate through timesteps automatically. The noise schedule at bottom shows how noise accumulates over 1000 steps."
        citations={['ho2020ddpm', 'weng2021diffusion']}
        totalSteps={DIFFUSION_STEPS}
        stepInterval={700}
        loops={true}
      >
        {({ step, resetKey }) => <DiffusionViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
