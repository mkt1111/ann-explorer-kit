import { NeuronPlayground } from "./simulations/NeuronPlayground";
import { NetworkTrainer } from "./simulations/NetworkTrainer";
import { CartPoleSimulation } from "./simulations/CartPoleSimulation";

export const SimulationsSection = () => {
  return (
    <section id="simulations" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Interactive <span className="text-primary">Simulations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience neural networks in action with hands-on experiments
          </p>
        </div>

        <div className="space-y-12 max-w-7xl mx-auto">
          <NeuronPlayground />
          <NetworkTrainer />
          <CartPoleSimulation />
        </div>
      </div>
    </section>
  );
};
