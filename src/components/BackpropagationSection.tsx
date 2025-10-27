import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const BackpropagationSection = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "1. Forward Pass",
      description: "Input data flows through the network. Each neuron calculates its weighted sum and applies its activation function.",
      visual: "forward",
      details: "For example, if input is [0.5, 0.3], and weights are [0.4, 0.6] with bias 0.1, the neuron computes: (0.5 × 0.4) + (0.3 × 0.6) + 0.1 = 0.48. Then it applies an activation function like sigmoid to get the output."
    },
    {
      title: "2. Calculate Loss",
      description: "Compare the network's prediction to the actual target value. The difference is the error (loss).",
      visual: "loss",
      details: "Common loss functions include Mean Squared Error (MSE) for regression: ½(predicted - actual)², or Cross-Entropy for classification. The goal of training is to minimize this loss."
    },
    {
      title: "3. Backward Pass (Backpropagation)",
      description: "Error signals propagate backward through the network. We calculate how much each weight contributed to the error.",
      visual: "backward",
      details: "Using the chain rule from calculus, we compute gradients: ∂Loss/∂Weight. This tells us how to adjust each weight to reduce the error. The gradient flows backward from output to input."
    },
    {
      title: "4. Update Weights",
      description: "Adjust weights in the direction that reduces error. This is gradient descent.",
      visual: "update",
      details: "Weight Update Formula: New Weight = Old Weight - (Learning Rate × Gradient). The learning rate (e.g., 0.01) controls how big the steps are. Too large = unstable, too small = slow training."
    },
    {
      title: "5. Repeat",
      description: "Iterate this process thousands of times with different training examples until the network learns the pattern.",
      visual: "repeat",
      details: "Each complete pass through all training data is called an 'epoch'. Modern networks train for many epochs, gradually reducing the loss as weights converge to optimal values."
    }
  ];

  const currentStep = steps[step];

  return (
    <section id="backprop" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="text-primary">Backpropagation</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The training algorithm that powers modern neural networks
          </p>
        </div>

        <Card className="p-8 border-border bg-card/50 backdrop-blur">
          <div className="space-y-8">
            {/* Step indicator */}
            <div className="flex justify-between items-center">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center flex-1">
                  <button
                    onClick={() => setStep(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      index === step 
                        ? 'bg-primary text-primary-foreground scale-110 shadow-glow-md' 
                        : index < step
                        ? 'bg-primary/50 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                      index < step ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-2xl font-bold mb-2">{currentStep.title}</h3>
                <p className="text-lg text-muted-foreground">{currentStep.description}</p>
              </div>

              {/* Visual representation */}
              <div className="relative h-64 bg-gradient-to-br from-background to-muted/30 rounded-lg border border-border p-8 flex items-center justify-center overflow-hidden">
                {currentStep.visual === "forward" && (
                  <div className="flex items-center gap-8">
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse-glow">
                        <span className="text-sm font-bold">Input</span>
                      </div>
                    </div>
                    <ArrowRight className="w-8 h-8 text-primary animate-[pulse_2s_ease-in-out_infinite]" />
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <span className="text-xs font-bold">H1</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <span className="text-xs font-bold">H2</span>
                      </div>
                    </div>
                    <ArrowRight className="w-8 h-8 text-primary animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
                    <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center animate-pulse-glow">
                      <span className="text-sm font-bold">Output</span>
                    </div>
                  </div>
                )}

                {currentStep.visual === "loss" && (
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center mb-2">
                          <span className="text-xl font-bold">0.8</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Predicted</span>
                      </div>
                      <span className="text-3xl font-bold text-muted-foreground">-</span>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-2">
                          <span className="text-xl font-bold">1.0</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Actual</span>
                      </div>
                      <span className="text-3xl font-bold text-muted-foreground">=</span>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center mb-2 animate-pulse">
                          <span className="text-xl font-bold">0.2</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Error</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.visual === "backward" && (
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center animate-pulse">
                      <span className="text-sm font-bold">Error</span>
                    </div>
                    <ArrowLeft className="w-8 h-8 text-destructive animate-[pulse_2s_ease-in-out_infinite]" />
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <span className="text-xs font-bold">∂H1</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <span className="text-xs font-bold">∂H2</span>
                      </div>
                    </div>
                    <ArrowLeft className="w-8 h-8 text-destructive animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
                    <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <span className="text-sm font-bold">∂Input</span>
                    </div>
                  </div>
                )}

                {currentStep.visual === "update" && (
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <div className="text-sm font-mono mb-2">W<sub>new</sub> = W<sub>old</sub> - (α × ∂L/∂W)</div>
                      <div className="text-xs text-muted-foreground">
                        α = learning rate, ∂L/∂W = gradient
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center mb-2">
                          <span className="text-sm font-bold">0.50</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Old Weight</span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-primary" />
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-2 animate-pulse-glow">
                          <span className="text-sm font-bold">0.48</span>
                        </div>
                        <span className="text-xs text-muted-foreground">New Weight</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.visual === "repeat" && (
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-12 h-12 -mt-6 -ml-6"
                            style={{
                              transform: `rotate(${i * 90}deg) translateY(-60px)`,
                            }}
                          >
                            <div 
                              className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse"
                              style={{
                                animationDelay: `${i * 0.3}s`,
                              }}
                            >
                              <ArrowRight className="w-6 h-6 text-primary" style={{ transform: 'rotate(90deg)' }} />
                            </div>
                          </div>
                        ))}
                        <div className="absolute top-1/2 left-1/2 -mt-8 -ml-8 w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                          <span className="text-xs font-bold text-center">Train</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                <p className="text-sm text-muted-foreground">{currentStep.details}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                disabled={step === steps.length - 1}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-bold mb-4">Why Backpropagation is Revolutionary</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <p className="mb-2">
                Before backpropagation (popularized in the 1980s), training neural networks was extremely difficult. 
                Backprop made it possible to efficiently train networks with multiple layers by providing a systematic 
                way to calculate gradients.
              </p>
            </div>
            <div>
              <p>
                The algorithm uses the <strong className="text-foreground">chain rule from calculus</strong> to 
                decompose the gradient computation layer by layer. This enables networks with millions of parameters 
                to learn complex patterns from data - the foundation of modern AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
