import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { CNNViz, CNN_STEPS } from '../../visualizations/deep-learning/CNNViz'

const CODE = `import torch
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),  # 28x28 -> 28x28
            nn.ReLU(),
            nn.MaxPool2d(2, 2),                           # 28x28 -> 14x14
            nn.Conv2d(32, 64, kernel_size=3, padding=1), # 14x14 -> 14x14
            nn.ReLU(),
            nn.MaxPool2d(2, 2),                           # 14x14 -> 7x7
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 7 * 7, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        return self.classifier(self.features(x))`

export default function CNNPage() {
  return (
    <AlgorithmLayout
      name="Convolutional Neural Networks"
      tagline="Share weights across spatial locations to learn translation-invariant local features."
      equation="(f * k)(r, c) = \sum_{i}\sum_{j} f(r+i,\, c+j) \cdot k(i,j)"
      equationLabel="2D discrete convolution: filter k slides over input f, computing dot products"
      description="CNNs exploit three properties of natural images: local connectivity (nearby pixels are correlated), parameter sharing (the same filter is applied everywhere), and spatial hierarchy (edges → textures → shapes → objects). Convolutional layers dramatically reduce parameters compared to fully-connected layers while being invariant to translation. They dominated computer vision from 2012 (AlexNet) onward."
      keyIdeas={[
        'Convolutional filters share weights across spatial positions — a filter that detects horizontal edges works anywhere in the image.',
        'Pooling (max/average) downsamples feature maps, reducing computation and providing spatial invariance.',
        'Deeper CNNs (VGG, ResNet) learn hierarchical features. Skip connections in ResNet solve the vanishing gradient problem for very deep networks.',
        'Receptive field: the region of the input that influences a given neuron. Stacking convolutions and pooling expands the receptive field.',
      ]}
      code={CODE}
      citations={['lecun1998cnn', 'goodfellow2016dl']}
    >
      <VizPanel
        title="Convolution Operation"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Left: input image (white=1, black=0). Center: the 3×3 Sobel-style kernel (blue=positive, red=negative weights). Right: resulting feature map after convolution + ReLU activation (orange=high activation). The yellow box shows the current kernel position — watch it slide across the input, computing a dot product at each location to fill the feature map."
        citations={['lecun1998cnn']}
        totalSteps={CNN_STEPS}
        stepInterval={120}
        loops={true}
      >
        {({ step, resetKey }) => <CNNViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
