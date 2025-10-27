import { Card } from "@/components/ui/card";
import { Brain, Layers, Zap, TrendingUp } from "lucide-react";

export const BasicsSection = () => {
  const concepts = [
    {
      icon: Brain,
      title: "What is a Neuron?",
      description: "A neuron is the fundamental building block of neural networks. It receives inputs, processes them with weights and bias, applies an activation function, and produces an output.",
    },
    {
      icon: Layers,
      title: "Network Layers",
      description: "Neural networks are organized in layers: input layer (receives data), hidden layers (process information), and output layer (produces results). Deep networks have many hidden layers.",
    },
    {
      icon: Zap,
      title: "Activation Functions",
      description: "These functions introduce non-linearity, allowing networks to learn complex patterns. Common ones include ReLU, Sigmoid, and Tanh, each with unique properties.",
    },
    {
      icon: TrendingUp,
      title: "How Training Works",
      description: "Networks learn through backpropagation: they make predictions, calculate error, and adjust weights using gradient descent to minimize mistakes over many iterations.",
    },
  ];

  return (
    <section id="basics" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Neural Network <span className="text-primary">Fundamentals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the core concepts that power artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <Card 
                key={index}
                className="p-6 border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 hover:shadow-glow-sm group"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{concept.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {concept.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 border-accent/30 bg-gradient-to-br from-card to-accent/5">
            <h3 className="text-2xl font-bold mb-4 text-accent">The Learning Process</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Forward Pass:</strong> Data flows through the network, each neuron processes inputs and passes results to the next layer until reaching the output.
              </p>
              <p>
                <strong className="text-foreground">Loss Calculation:</strong> The network's prediction is compared to the actual answer using a loss function, measuring how wrong the prediction was.
              </p>
              <p>
                <strong className="text-foreground">Backpropagation:</strong> The error signal travels backward through the network, calculating how much each weight contributed to the mistake.
              </p>
              <p>
                <strong className="text-foreground">Weight Update:</strong> Using gradient descent, weights are adjusted to reduce error. This process repeats thousands of times until the network learns the pattern.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
