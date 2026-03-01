import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { RAGViz, RAG_STEPS } from '../../visualizations/applications/RAGViz'

const CODE = `from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# 1. Index documents
docs = load_documents("./knowledge_base/")
splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=64)
chunks = splitter.split_documents(docs)

# 2. Embed chunks and store in vector database
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)

# 3. Build RAG chain
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
rag_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(temperature=0),
    chain_type="stuff",        # "map_reduce" or "refine" for long contexts
    retriever=retriever,
    return_source_documents=True,
)

# 4. Query
result = rag_chain({"query": "What causes climate change?"})
answer = result["result"]
sources = result["source_documents"]`

export default function RAGPage() {
  return (
    <AlgorithmLayout
      name="Retrieval-Augmented Generation"
      tagline="Ground LLM responses in specific documents by retrieving relevant passages and including them in the prompt."
      equation="\hat{y} = \text{LLM}(q,\, \text{retrieve}(q, \mathcal{D})), \quad \text{retrieve}(q) = \text{top-}k \arg\max_{d \in \mathcal{D}} \text{sim}(\text{emb}(q), \text{emb}(d))"
      equationLabel="RAG: generate conditioned on query q and top-k retrieved documents from corpus 𝒟"
      equationVars={[
        { sym: '\\hat{y}', desc: 'Generated answer from the LLM, grounded in retrieved context' },
        { sym: 'q', desc: 'User query (natural language question)' },
        { sym: '\\mathcal{D}', desc: 'Document corpus — the external knowledge base indexed at retrieval time' },
        { sym: 'k', desc: 'Number of top documents to retrieve and inject into the LLM prompt' },
        { sym: '\\text{emb}(\\cdot)', desc: 'Embedding function — maps text to a dense vector in semantic space' },
        { sym: '\\text{sim}(\\cdot, \\cdot)', desc: 'Similarity function (typically cosine similarity) between query and document embeddings' },
      ]}
      description="Retrieval-Augmented Generation (RAG) combines parametric knowledge (stored in LLM weights) with non-parametric knowledge (retrieved from an external document store). Documents are pre-embedded into a vector database; at query time, the query is embedded and the k most similar chunks are retrieved and prepended to the LLM's prompt as context. This enables accurate, up-to-date, and verifiable responses grounded in specific sources."
      keyIdeas={[
        'Indexing pipeline: chunk documents → embed with dense retriever (e.g., OpenAI ada-002, BGE, E5) → store in vector database (FAISS, Pinecone, Chroma).',
        'Retrieval: cosine similarity between query embedding and chunk embeddings. Hybrid search (dense + BM25 sparse) often outperforms dense-only retrieval.',
        'Augmentation: retrieved chunks are prepended as context in the LLM prompt. Context window size limits how many chunks can fit.',
        'Failure modes: retrieval misses (query-document vocabulary mismatch), lost-in-the-middle (LLMs ignore middle-context chunks), hallucination despite context.',
      ]}
      code={CODE}
      citations={['lewis2020rag', 'karpukhin2020dpr']}
    >
      <VizPanel
        title="RAG Pipeline"
        badge="interactive"
        badgeLabel="Animated"
        caption="Press Play to step through the RAG pipeline: (1) query is embedded into vector space, (2) nearest-neighbor search expands the search radius, (3) top-K most similar chunks are retrieved (gold), (4) retrieved chunks are injected into the LLM prompt for grounded generation. Adjust K to see how retrieval breadth affects what gets included."
        citations={['lewis2020rag']}
        totalSteps={RAG_STEPS}
        stepInterval={800}
      >
        {({ step, resetKey }) => <RAGViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
