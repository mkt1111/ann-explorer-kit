import { Card } from "@/components/ui/card";
import { Brain, Network, Sparkles } from "lucide-react";

export const AboutAISection = () => {
  return (
    <section id="about" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Understanding <span className="text-accent">AI Terminology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clarifying the differences between AI, ANNs, and LLMs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all group text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">AI</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Artificial Intelligence</strong> is the broad field of creating machines that can perform tasks requiring human intelligence. This includes reasoning, learning, perception, and problem-solving.
            </p>
          </Card>

          <Card className="p-8 border-border bg-card/50 backdrop-blur hover:border-secondary/50 transition-all group text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                <Network className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">ANNs</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Artificial Neural Networks</strong> are a specific type of AI inspired by the human brain. They're mathematical models with interconnected nodes (neurons) that learn patterns from data.
            </p>
          </Card>

          <Card className="p-8 border-border bg-card/50 backdrop-blur hover:border-accent/50 transition-all group text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                <Brain className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">LLMs</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Large Language Models</strong> are a specific application of ANNs designed for language tasks. They use transformer architectures with billions of parameters to understand and generate text.
            </p>
          </Card>
        </div>

        <Card className="p-8 border-accent/30 bg-gradient-to-br from-card to-accent/5">
          <h3 className="text-2xl font-bold mb-6 text-accent">The Relationship</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Think of it like this: <strong className="text-foreground">AI is the universe</strong> of intelligent machines. 
              <strong className="text-foreground"> ANNs are a powerful constellation</strong> within that universe - one of many approaches to achieving AI. 
              <strong className="text-foreground"> LLMs are specific stars</strong> within the ANN constellation, specialized for language understanding.
            </p>
            <p>
              Not all AI uses neural networks (older systems used rule-based logic), and not all neural networks are LLMs (many are used for image recognition, game playing, robotics, etc.). But LLMs like GPT-4 and Claude are built on neural network architectures called transformers.
            </p>
            <p>
              <strong className="text-foreground">Key takeaway:</strong> AI is the goal, ANNs are a method, and LLMs are a specific application of that method focused on language. They're all connected, like nested Russian dolls! 🎭
            </p>
          </div>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-primary/20 bg-card/30">
            <h4 className="text-lg font-semibold mb-3 text-primary">What ANNs Can Do</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Learn complex patterns from examples</li>
              <li>• Recognize images, speech, and text</li>
              <li>• Make predictions based on data</li>
              <li>• Improve with more training data</li>
              <li>• Handle noisy or incomplete information</li>
            </ul>
          </Card>

          <Card className="p-6 border-secondary/20 bg-card/30">
            <h4 className="text-lg font-semibold mb-3 text-secondary">What ANNs Can't Do (Yet)</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Truly understand context like humans</li>
              <li>• Learn from very few examples (few-shot still needs base training)</li>
              <li>• Explain their reasoning clearly</li>
              <li>• Transfer knowledge easily to new domains</li>
              <li>• Match human common sense reasoning</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
