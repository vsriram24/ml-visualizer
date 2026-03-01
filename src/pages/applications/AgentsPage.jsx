import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { AgentLoopViz, AGENT_STEPS }           from '../../visualizations/applications/AgentLoopViz'
import { PlanExecuteViz, PLAN_EXECUTE_STEPS }   from '../../visualizations/applications/PlanExecuteViz'
import { ReflexionViz, REFLEXION_STEPS }        from '../../visualizations/applications/ReflexionViz'
import { TreeOfThoughtsViz, TOT_STEPS }         from '../../visualizations/applications/TreeOfThoughtsViz'
import { AgentComparisonViz }                   from '../../visualizations/applications/AgentComparisonViz'
import { MultiAgentViz, MULTI_AGENT_STEPS }     from '../../visualizations/applications/MultiAgentViz'

const CODE = `# Plan-and-Execute pattern with LangChain
from langchain_openai import ChatOpenAI
from langchain_experimental.plan_and_execute import (
    PlanAndExecute, load_agent_executor, load_chat_planner
)
from langchain.tools import DuckDuckGoSearchRun
from langchain_experimental.tools import PythonREPLTool

llm = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [DuckDuckGoSearchRun(), PythonREPLTool()]

# Planner LLM decomposes the task into ordered steps
planner   = load_chat_planner(llm)

# Executor LLM runs each step with tool access
executor  = load_agent_executor(llm, tools, verbose=True)

# Combine into Plan-and-Execute agent
agent = PlanAndExecute(planner=planner, executor=executor, verbose=True)

result = agent.run(
    "Analyze the economic impact of renewable energy adoption "
    "using recent data. Compare costs with fossil fuels and "
    "summarize findings with citations."
)
# 1. Planner produces: [search studies, extract KPIs, compare costs, synthesize]
# 2. Executor runs each step with web_search / python tools
# 3. Results feed forward into the next step's context`

export default function AgentsPage() {
  const sectionHdr = 'text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3'

  return (
    <AlgorithmLayout
      name="AI Agents"
      tagline="LLMs that reason, plan, self-correct, and coordinate — autonomously completing complex tasks."
      equation="\text{ReAct}: (o_t, r_t, a_t)_{t=1}^T \quad \text{Reflexion}: a^* = \arg\max_a V\!\left(r_\theta\!\left(a,\, f_{\text{reflect}}\right)\right)"
      equationLabel="ReAct interleaves Observe–Think–Act steps; Reflexion maximises a verbal-reinforcement value over reflected actions."
      description="AI agents extend LLMs beyond single-turn Q&A into autonomous, multi-step task execution. The ReAct framework grounds reasoning in real tool calls. Plan-and-Execute separates a planner LLM (task decomposition) from an executor LLM (step-by-step tool use), enabling parallel subtasks. Reflexion adds verbal self-critique: the agent evaluates its own output, writes a reflection, and retries with that reflection in context. Tree of Thoughts explores multiple reasoning paths simultaneously — scoring, pruning, and backtracking like a search algorithm. Multi-agent systems decompose hard problems further by delegating to specialist subagents that coordinate via hierarchical, pipeline, or peer-to-peer patterns."
      keyIdeas={[
        'ReAct: the model generates a "Thought" before each "Action", grounding reasoning in real tool results (web search, code execution, APIs). The accumulating scratchpad keeps all prior observations in context.',
        'Plan-and-Execute: a dedicated planner LLM decomposes the task once; a separate executor LLM runs each step with tools. Decoupling planning from execution allows parallel execution of independent subtasks.',
        'Reflexion: after each attempt the agent scores its output, writes a natural-language critique (missing citations, incorrect facts, weak structure), and re-runs the task with that reflection prepended — verbal reinforcement learning without gradient updates.',
        'Tree of Thoughts: BFS/DFS over candidate reasoning steps. Each node is scored by a verifier LLM; low-scoring branches are pruned; the best path is extended. Enables deliberate, search-based problem solving.',
        'Multi-agent coordination: hierarchical (manager delegates to specialist workers), pipeline (output of each agent feeds the next), and peer-to-peer (agents debate or vote for consensus). Each pattern suits different task structures.',
      ]}
      code={CODE}
      citations={['yao2022react', 'shinn2023reflexion', 'yao2023tot', 'wang2023plansolve', 'hong2023metagpt', 'schick2023toolformer']}
    >
      <div className="space-y-8">

        {/* ── SECTION 1: Single-Agent Frameworks ── */}
        <section>
          <h3 className={sectionHdr}>Single-Agent Frameworks</h3>
          <div className="space-y-4">

            <VizPanel
              title="ReAct: Reason + Act"
              badge="precomputed"
              badgeLabel="Animated"
              caption="A ReAct agent interleaves Thought → Action → Observation cycles. Watch the agent observe a question, reason about which tool to call, invoke web_search, observe the result, and reason again until it has enough information to answer."
              citations={['yao2022react']}
              totalSteps={AGENT_STEPS}
              stepInterval={1200}
              loops={false}
            >
              {({ step, resetKey }) => <AgentLoopViz step={step} resetKey={resetKey} />}
            </VizPanel>

            <VizPanel
              title="Plan-and-Execute"
              badge="precomputed"
              badgeLabel="Animated"
              caption="A planner LLM decomposes the task into an ordered plan (step 1). The executor LLM then completes each step one by one (steps 2–5), calling the appropriate tool (web_search, code_exec) and feeding results forward. Independent steps can run in parallel."
              citations={['wang2023plansolve']}
              totalSteps={PLAN_EXECUTE_STEPS}
              stepInterval={1000}
              loops={false}
            >
              {({ step, resetKey }) => <PlanExecuteViz step={step} resetKey={resetKey} />}
            </VizPanel>

            <VizPanel
              title="Reflexion: Verbal Self-Correction"
              badge="precomputed"
              badgeLabel="Animated"
              caption="The agent produces an initial answer (step 0), receives a low score (step 1), writes a natural-language reflection identifying errors (step 2), then retries with that reflection in context (step 3) and earns a much higher score (step 4) — no gradient updates required."
              citations={['shinn2023reflexion']}
              totalSteps={REFLEXION_STEPS}
              stepInterval={1200}
              loops={false}
            >
              {({ step, resetKey }) => <ReflexionViz step={step} resetKey={resetKey} />}
            </VizPanel>

            <VizPanel
              title="Tree of Thoughts"
              badge="precomputed"
              badgeLabel="Animated"
              caption="The agent explores multiple reasoning branches simultaneously. At step 4, a verifier LLM scores each branch — low-scoring paths (By country, By gas type) are pruned in red. The best branch (Energy sector first) expands further until the solution node is reached."
              citations={['yao2023tot']}
              totalSteps={TOT_STEPS}
              stepInterval={900}
              loops={false}
            >
              {({ step, resetKey }) => <TreeOfThoughtsViz step={step} resetKey={resetKey} />}
            </VizPanel>

          </div>
        </section>

        {/* ── SECTION 2: Framework Comparison ── */}
        <section>
          <h3 className={sectionHdr}>Framework Comparison</h3>
          <VizPanel
            title="Single-Agent Framework Comparison"
            showControls={false}
            caption="Comparison of four agentic frameworks across five dimensions. ● = yes, ◑ = partial, ○ = no. ReAct excels at tool-grounded factual lookup; Plan-and-Execute handles complex parallelisable tasks; Reflexion maximises output quality via self-critique; Tree of Thoughts is best for hard multi-step reasoning."
            citations={['yao2022react', 'shinn2023reflexion', 'yao2023tot', 'wang2023plansolve']}
          >
            {({ resetKey }) => <AgentComparisonViz resetKey={resetKey} />}
          </VizPanel>
        </section>

        {/* ── SECTION 3: Multi-Agent Coordination ── */}
        <section>
          <h3 className={sectionHdr}>Multi-Agent Coordination Patterns</h3>
          <VizPanel
            title="Agent Coordination Patterns"
            badge="precomputed"
            badgeLabel="Animated"
            caption="Three coordination topologies: Hierarchical (steps 0–2) — a Manager LLM delegates subtasks to specialist Workers, collects results, and synthesises. Pipeline (steps 3–5) — output of each specialist agent feeds directly into the next. Peer-to-Peer (steps 6–8) — agents communicate laterally, debating and revising until consensus. Amber highlights show the active message flow."
            citations={['hong2023metagpt']}
            totalSteps={MULTI_AGENT_STEPS}
            stepInterval={900}
            loops={true}
          >
            {({ step, resetKey }) => <MultiAgentViz step={step} resetKey={resetKey} />}
          </VizPanel>
        </section>

      </div>
    </AlgorithmLayout>
  )
}
