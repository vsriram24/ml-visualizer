import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { GNNViz, GNN_STEPS } from '../../visualizations/deep-learning/GNNViz'

const CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv

# Graph Convolutional Network (Kipf & Welling, 2017)
class GCN(nn.Module):
    def __init__(self, in_channels, hidden_channels, num_classes):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, num_classes)

    def forward(self, x, edge_index):
        # Layer 1: aggregate 1-hop neighbors
        x = self.conv1(x, edge_index)   # (N, hidden)
        x = F.relu(x)
        x = F.dropout(x, p=0.5, training=self.training)

        # Layer 2: aggregate 2-hop context
        x = self.conv2(x, edge_index)   # (N, num_classes)
        return x                         # node logits

# Usage: data.x = node features, data.edge_index = COO adjacency
# model = GCN(in_channels=1433, hidden_channels=64, num_classes=7)
# out = model(data.x, data.edge_index)  # classify all N nodes at once`

export default function GNNPage() {
  return (
    <AlgorithmLayout
      name="Graph Neural Networks"
      tagline="GNNs learn node and graph representations by iteratively aggregating information from local neighborhoods."
      equation="H^{(l+1)} = \sigma\!\Bigl(\hat{D}^{-\frac{1}{2}}\hat{A}\,\hat{D}^{-\frac{1}{2}}\, H^{(l)} W^{(l)}\Bigr)"
      equationLabel="GCN layer update — symmetric-normalized message passing with learned weights"
      equationVars={[
        { sym: 'H^{(l)}',              desc: 'Node feature matrix at layer l — each row hᵥ is one node\'s embedding (shape N × d)' },
        { sym: '\\hat{A} = A + I',      desc: 'Adjacency matrix with added self-loops so each node also aggregates its own features' },
        { sym: '\\hat{D}',             desc: 'Diagonal degree matrix of Â — used for symmetric normalization to prevent scale explosion' },
        { sym: 'W^{(l)}',              desc: 'Shared linear weight matrix at layer l — the same weights apply to every node' },
        { sym: '\\sigma',              desc: 'Nonlinear activation (e.g., ReLU) applied element-wise after aggregation' },
      ]}
      description="Graph Neural Networks operate directly on graph-structured data — molecules, social networks, citation graphs, knowledge bases, 3-D point clouds — where the topology itself encodes meaningful relationships. The core mechanism is message passing: at each layer, every node collects feature vectors from its neighbors, aggregates them (mean, sum, max, or attention-weighted), and applies a learned linear transformation. With L layers, each node's representation incorporates information from its L-hop neighborhood. The GCN formulation uses symmetric normalization (D̂⁻½ Â D̂⁻½) to prevent high-degree nodes from dominating aggregation."
      keyIdeas={[
        'Message passing: each GNN layer expands a node\'s receptive field by one hop. Two layers give access to 2-hop neighborhoods — analogous to how CNNs stack convolutions to grow receptive fields.',
        'Inductive vs. transductive: GCN is transductive (sees the full graph at training time). GraphSAGE and GAT generalize inductively — they can classify new nodes not seen during training.',
        'Graph Attention Networks (GAT) replace uniform aggregation with learned attention weights on each edge, allowing the model to focus on the most relevant neighbors.',
        'Graph-level tasks (e.g., molecule property prediction) use a readout function — mean or max pooling over all node embeddings — to produce a single vector representing the entire graph.',
      ]}
      code={CODE}
      citations={['kipf2017gcn', 'hamilton2017graphsage']}
    >
      <VizPanel
        title="Message Passing — Node Classification"
        badge="precomputed"
        badgeLabel="Animated"
        caption="Nodes 0, 3, and 4 start with known class labels (solid borders). Over two GCN layers, their embeddings propagate along edges to the unlabeled nodes. Watch the teal edge pulses during message passing, and the node colors shift as the graph-aware embeddings converge to final predictions."
        citations={['kipf2017gcn']}
        totalSteps={GNN_STEPS}
        stepInterval={1000}
        loops={true}
      >
        {({ step, resetKey }) => <GNNViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
