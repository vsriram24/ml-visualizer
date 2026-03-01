import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { GANTrainingViz, GAN_STEPS } from '../../visualizations/generative/GANTrainingViz'

const CODE = `import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, z_dim=100, img_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(z_dim, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 512),   nn.LeakyReLU(0.2),
            nn.Linear(512, img_dim), nn.Tanh(),
        )
    def forward(self, z): return self.net(z)

class Discriminator(nn.Module):
    def __init__(self, img_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(img_dim, 512), nn.LeakyReLU(0.2),
            nn.Linear(512, 256),     nn.LeakyReLU(0.2),
            nn.Linear(256, 1),
        )
    def forward(self, x): return self.net(x)

# Training loop (minimax game)
for batch in dataloader:
    real = batch.to(device)
    z = torch.randn(batch_size, z_dim, device=device)
    fake = G(z)

    # Train D: maximize log D(real) + log(1 - D(fake))
    d_loss = -torch.mean(torch.log(D(real) + 1e-8) + torch.log(1 - D(fake) + 1e-8))
    optimizer_D.zero_grad(); d_loss.backward(); optimizer_D.step()

    # Train G: maximize log D(G(z)) (fool the discriminator)
    g_loss = -torch.mean(torch.log(D(G(z)) + 1e-8))
    optimizer_G.zero_grad(); g_loss.backward(); optimizer_G.step()`

export default function GANPage() {
  return (
    <AlgorithmLayout
      name="Generative Adversarial Networks"
      tagline="Train a generator and discriminator in a minimax game until generated samples are indistinguishable from real data."
      equation="\min_G \max_D \; \mathbb{E}_{x \sim p_\text{data}}\!\left[\log D(x)\right] + \mathbb{E}_{z \sim p_z}\!\left[\log(1 - D(G(z)))\right]"
      equationLabel="GAN minimax objective — G minimizes, D maximizes"
      description="GANs consist of two neural networks in adversarial competition: the Generator G maps random noise z to synthetic data G(z), while the Discriminator D tries to distinguish real data from fake. Trained together, G is pushed to generate increasingly realistic outputs to fool D, while D becomes better at detection. At Nash equilibrium, G produces samples from the true data distribution and D can only guess randomly."
      keyIdeas={[
        'The minimax game: D tries to maximize the objective (correctly classify real vs. fake); G tries to minimize it (fool D).',
        'Mode collapse: G may learn to generate only a few modes of the data distribution — a common failure mode. Mitigated by minibatch discrimination, spectral normalization.',
        'Training instability: GAN training is notoriously fragile. Techniques: feature matching, gradient penalty (WGAN-GP), progressive growing (ProGAN).',
        'Modern GANs: StyleGAN2/3 produce photorealistic faces; BigGAN scales to ImageNet; Conditional GAN (cGAN) conditions on class labels.',
      ]}
      code={CODE}
      citations={['goodfellow2014gan']}
    >
      <VizPanel
        title="GAN Training — Distribution Matching"
        badge="live"
        badgeLabel="Animated"
        caption="Left: real data distribution (green). Right: generator output (red) — starts as random noise and converges toward the real distribution as training progresses. Press Play and watch the generated distribution morph to match the real one. Loss curves at bottom show G and D loss approaching parity."
        citations={['goodfellow2014gan']}
        totalSteps={GAN_STEPS}
        stepInterval={120}
        loops={true}
      >
        {({ step, resetKey }) => <GANTrainingViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
