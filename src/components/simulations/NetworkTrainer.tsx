import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw } from "lucide-react";

type Operation = "XOR" | "AND" | "OR" | "NAND" | "NOR";

const operationInfo = {
  XOR: {
    description: "Exclusive OR - outputs 1 only when inputs are different",
    data: [
      { input: [0, 0], target: 0 },
      { input: [0, 1], target: 1 },
      { input: [1, 0], target: 1 },
      { input: [1, 1], target: 0 },
    ],
    explanation: "XOR is the classic non-linearly separable problem that single-layer perceptrons cannot solve. This demonstrates why we need hidden layers and non-linear activation functions."
  },
  AND: {
    description: "Logical AND - outputs 1 only when both inputs are 1",
    data: [
      { input: [0, 0], target: 0 },
      { input: [0, 1], target: 0 },
      { input: [1, 0], target: 0 },
      { input: [1, 1], target: 1 },
    ],
    explanation: "AND is linearly separable - a single neuron can learn this easily. Notice how quickly it converges compared to XOR."
  },
  OR: {
    description: "Logical OR - outputs 1 when at least one input is 1",
    data: [
      { input: [0, 0], target: 0 },
      { input: [0, 1], target: 1 },
      { input: [1, 0], target: 1 },
      { input: [1, 1], target: 1 },
    ],
    explanation: "OR is also linearly separable. The decision boundary is a straight line dividing the input space."
  },
  NAND: {
    description: "NOT AND - outputs 0 only when both inputs are 1",
    data: [
      { input: [0, 0], target: 1 },
      { input: [0, 1], target: 1 },
      { input: [1, 0], target: 1 },
      { input: [1, 1], target: 0 },
    ],
    explanation: "NAND is universal - any logical function can be built using only NAND gates. It's linearly separable and trains quickly."
  },
  NOR: {
    description: "NOT OR - outputs 1 only when both inputs are 0",
    data: [
      { input: [0, 0], target: 1 },
      { input: [0, 1], target: 0 },
      { input: [1, 0], target: 0 },
      { input: [1, 1], target: 0 },
    ],
    explanation: "NOR is also universal like NAND. Watch how the network creates a decision boundary in the bottom-left corner."
  }
};

export const NetworkTrainer = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [weights, setWeights] = useState([0.5, 0.5, 0.5]);
  const [operation, setOperation] = useState<Operation>("XOR");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const trainingData = operationInfo[operation].data;

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const forward = (input: number[], w: number[]) => {
    const sum = input[0] * w[0] + input[1] * w[1] + w[2];
    return sigmoid(sum);
  };

  const trainStep = () => {
    let totalLoss = 0;
    const newWeights = [...weights];

    trainingData.forEach(({ input, target }) => {
      const prediction = forward(input, newWeights);
      const error = target - prediction;
      totalLoss += Math.abs(error);

      // Simple gradient descent update
      const gradient = error * prediction * (1 - prediction);
      newWeights[0] += learningRate * gradient * input[0];
      newWeights[1] += learningRate * gradient * input[1];
      newWeights[2] += learningRate * gradient;
    });

    setWeights(newWeights);
    setLoss(totalLoss / trainingData.length);
    setEpoch((e) => e + 1);
  };

  useEffect(() => {
    if (isTraining && loss > 0.01) {
      const timer = setTimeout(trainStep, 50);
      return () => clearTimeout(timer);
    } else if (loss <= 0.01) {
      setIsTraining(false);
    }
  }, [isTraining, loss, weights, learningRate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      const gridSize = 20;
      ctx.strokeStyle = "rgba(100, 100, 100, 0.2)";
      for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw decision boundary (prediction contour)
      const resolution = 5;
      for (let x = 0; x < canvas.width; x += resolution) {
        for (let y = 0; y < canvas.height; y += resolution) {
          const input = [x / canvas.width, y / canvas.height];
          const prediction = forward(input, weights);
          
          const hue = prediction > 0.5 ? 190 : 260;
          const saturation = 70;
          const lightness = 30 + prediction * 30;
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(x, y, resolution, resolution);
        }
      }

      // Draw training points
      trainingData.forEach(({ input, target }) => {
        const x = input[0] * canvas.width;
        const y = input[1] * canvas.height;
        const prediction = forward(input, weights);
        const correct = Math.abs(prediction - target) < 0.5;

        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = target === 1 ? "hsl(190, 90%, 50%)" : "hsl(260, 70%, 60%)";
        ctx.fill();
        ctx.strokeStyle = correct ? "hsl(120, 70%, 50%)" : "hsl(0, 70%, 50%)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Label
        ctx.fillStyle = "white";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(target.toString(), x, y + 4);
      });
    };

    draw();
  }, [weights]);

  const handleReset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(1.0);
    setWeights([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
  };

  return (
    <Card className="p-8 border-border bg-card/50 backdrop-blur">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Network Training Visualizer</h3>
        <p className="text-muted-foreground">
          Watch a neural network learn logical operations in real-time. Select different operations to see how the network adapts.
        </p>
      </div>

      <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
        <h4 className="text-sm font-semibold text-primary mb-2">What you're seeing:</h4>
        <p className="text-xs text-muted-foreground mb-3">
          The <strong>colored background</strong> represents the network's predictions across the entire input space (0 to 1 for each input). 
          The <strong>colored dots</strong> are training examples with their expected outputs. 
          <strong className="text-primary"> Green rings</strong> indicate correct predictions, <strong className="text-destructive">red rings</strong> show errors.
        </p>
        <p className="text-xs text-muted-foreground">
          As training progresses, you'll see the background colors shift as the network adjusts its <strong>decision boundary</strong> to correctly classify all training points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Operation</Label>
            <Select 
              value={operation} 
              onValueChange={(v: Operation) => {
                setOperation(v);
                handleReset();
              }}
              disabled={isTraining}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(operationInfo) as Operation[]).map(op => (
                  <SelectItem key={op} value={op}>
                    {op} - {operationInfo[op].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">{operation}:</strong> {operationInfo[operation].explanation}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Learning Rate: {learningRate.toFixed(2)}
            </Label>
            <Slider
              value={[learningRate]}
              onValueChange={([v]) => setLearningRate(v)}
              min={0.01}
              max={0.5}
              step={0.01}
              className="w-full"
              disabled={isTraining}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setIsTraining(!isTraining)}
              disabled={loss <= 0.01}
              className="flex-1 gap-2"
            >
              {isTraining ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {epoch === 0 ? "Start Training" : "Resume"}
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Epoch:</span>
              <span className="text-lg font-bold text-primary">{epoch}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Loss:</span>
              <span className="text-lg font-bold text-secondary">{loss.toFixed(4)}</span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {loss > 0.5 ? "Network is learning..." : loss > 0.01 ? "Almost there!" : "Training complete! ✨"}
              </span>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <h4 className="text-sm font-semibold text-accent">Training Process:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong>Forward Pass:</strong> Network makes predictions for all training examples</li>
              <li>• <strong>Calculate Error:</strong> Compare predictions to expected outputs</li>
              <li>• <strong>Backpropagation:</strong> Calculate how much each weight contributed to the error</li>
              <li>• <strong>Update Weights:</strong> Adjust weights using gradient descent (learning rate × gradient)</li>
              <li>• <strong>Repeat:</strong> Process continues until error is minimized</li>
            </ul>
          </div>

          <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="text-sm font-semibold">Expected Outputs:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {trainingData.map((data, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-background/50 rounded">
                  <span className="text-muted-foreground">
                    [{data.input[0]}, {data.input[1]}]
                  </span>
                  <span className="text-foreground">→</span>
                  <span className="font-bold text-primary">{data.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-md border border-border rounded-lg shadow-glow-sm"
          />
        </div>
      </div>
    </Card>
  );
};
