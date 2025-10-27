import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw } from "lucide-react";

export const NetworkTrainer = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [weights, setWeights] = useState([0.5, 0.5, 0.5]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Simple XOR problem
  const trainingData = [
    { input: [0, 0], target: 0 },
    { input: [0, 1], target: 1 },
    { input: [1, 0], target: 1 },
    { input: [1, 1], target: 0 },
  ];

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
          Watch a neural network learn the XOR problem in real-time. Adjust learning rate and observe how it affects training.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
            <h4 className="text-sm font-semibold text-accent">How it works:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Colored dots represent training data (XOR problem)</li>
              <li>• Background shows network's current predictions</li>
              <li>• Green rings = correct predictions, Red = incorrect</li>
              <li>• Watch the decision boundary evolve as it learns</li>
            </ul>
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
