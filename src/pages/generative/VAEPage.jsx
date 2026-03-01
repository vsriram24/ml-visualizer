import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { VAELatentSpaceViz } from '../../visualizations/generative/VAELatentSpaceViz'

const CODE = `import torch
import torch.nn as nn

class VAE(nn.Module):
    def __init__(self, input_dim=784, h_dim=400, z_dim=20):
        super().__init__()
        # Encoder: maps input to latent distribution parameters
        self.fc1 = nn.Linear(input_dim, h_dim)
        self.fc_mu = nn.Linear(h_dim, z_dim)       # mean μ
        self.fc_logvar = nn.Linear(h_dim, z_dim)   # log variance log(σ²)
        # Decoder: maps latent z back to input space
        self.fc3 = nn.Linear(z_dim, h_dim)
        self.fc4 = nn.Linear(h_dim, input_dim)

    def encode(self, x):
        h = torch.relu(self.fc1(x))
        return self.fc_mu(h), self.fc_logvar(h)

    def reparameterize(self, mu, logvar):
        # z = μ + ε·σ  (ε ~ N(0,I)) — keeps gradients flowing
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def forward(self, x):
        mu, logvar = self.encode(x.view(-1, 784))
        z = self.reparameterize(mu, logvar)
        return torch.sigmoid(self.fc4(torch.relu(self.fc3(z)))), mu, logvar

# ELBO loss = reconstruction + KL divergence
def loss_fn(recon_x, x, mu, logvar, beta=1.0):
    recon = nn.functional.binary_cross_entropy(recon_x, x, reduction='sum')
    kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    return recon + beta * kl`

export default function VAEPage() {
  return (
    <AlgorithmLayout
      name="Variational Autoencoders"
      tagline="Learn a continuous, structured latent space by enforcing a probabilistic prior on the encoded representations."
      equation="\mathcal{L}_\text{ELBO} = \mathbb{E}_{q_\phi(z|x)}\!\left[\log p_\theta(x|z)\right] - D_\text{KL}\!\left(q_\phi(z|x) \;\|\; p(z)\right)"
      equationLabel="ELBO: reconstruction term (maximize) − KL divergence (regularize)"
      description="VAEs are latent variable models with a two-part objective: the encoder qφ(z|x) maps inputs to a distribution over latent variables z, and the decoder pθ(x|z) reconstructs inputs from z. The ELBO loss maximizes reconstruction quality while minimizing the KL divergence between the learned posterior and a standard Gaussian prior N(0, I). The reparameterization trick makes the stochastic sampling step differentiable."
      keyIdeas={[
        'The reparameterization trick: instead of sampling z ~ q(z|x) directly (non-differentiable), compute z = μ + ε·σ where ε ~ N(0,I). Gradients flow through μ and σ.',
        'The KL term regularizes the latent space, pushing all class clusters toward N(0,I). This creates a smooth, interpolatable space.',
        'β-VAE (Higgins et al., 2017): increasing β beyond 1 creates more disentangled latent dimensions — each z dimension captures a single generative factor.',
        'Unlike GANs, VAEs have a stable training objective (ELBO) but tend to produce blurrier reconstructions due to the Gaussian decoder assumption.',
      ]}
      code={CODE}
      citations={['kingma2013vae']}
    >
      <VizPanel
        title="VAE Latent Space"
        badge="interactive"
        badgeLabel="Interactive"
        caption="Each point is an encoded example, colored by class. The dashed circle shows the N(0,I) prior the KL term encourages. Increase β to see how stronger regularization compresses all clusters toward the origin, creating a more structured (but potentially less expressive) latent space."
        citations={['kingma2013vae']}
        showControls={false}
      >
        {({ resetKey }) => <VAELatentSpaceViz resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
