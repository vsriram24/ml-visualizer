import { AlgorithmLayout } from '../../components/content/AlgorithmLayout'
import { VizPanel } from '../../components/viz/VizPanel'
import { RLGridWorldViz, RL_STEPS } from '../../visualizations/fundamentals/RLGridWorldViz'

export default function ReinforcementPage() {
  return (
    <AlgorithmLayout
      name="Reinforcement Learning"
      tagline="An agent learns to act by trial and error, maximizing cumulative reward over time."
      equation="Q(s,a) \leftarrow Q(s,a) + \alpha\bigl[r + \gamma \max_{a'} Q(s',a') - Q(s,a)\bigr]"
      equationLabel="Q-Learning update rule (Watkins, 1989)"
      description="In reinforcement learning, an agent interacts with an environment by taking actions and receiving scalar reward signals. It has no supervisor — it must discover which actions yield high cumulative reward through exploration. The Markov Decision Process (MDP) framework formalizes this: states S, actions A, transition dynamics P, and reward function R."
      keyIdeas={[
        'The core components are: agent, environment, state, action, reward, and policy π(a|s).',
        'The agent balances exploration (trying new actions to discover their value) vs. exploitation (using the best known action).',
        'The value function Q(s, a) estimates expected future reward from state s taking action a. Q-learning learns this without a model of the environment.',
        'Deep RL (DQN, PPO, SAC) uses neural networks to approximate Q or the policy directly, scaling to complex state spaces like images.',
      ]}
      citations={['sutton2018rl', 'mnih2015dqn']}
    >
      <VizPanel
        title="Q-Learning Grid World"
        badge="interactive"
        badgeLabel="Live RL"
        caption="The robot (🤖) learns to reach the goal (🎯) via Q-learning. Each step runs one Q-learning update. Colors show learned value estimates — green = high value. Arrows show the greedy policy direction. Click any cell to toggle walls. Press Play to train continuously."
        citations={['sutton2018rl']}
        totalSteps={RL_STEPS}
        stepInterval={120}
        loops={true}
      >
        {({ step, resetKey }) => <RLGridWorldViz step={step} resetKey={resetKey} />}
      </VizPanel>
    </AlgorithmLayout>
  )
}
