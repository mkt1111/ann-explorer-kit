import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ActivationFunction = "sigmoid" | "relu" | "tanh";

export const NeuronPlayground = () => {
  const [weight1, setWeight1] = useState(0.5);
  const [weight2, setWeight2] = useState(0.3);
  const [bias, setBias] = useState(0);
  const [input1, setInput1] = useState(0.5);
  const [input2, setInput2] = useState(0.5);
  const [activation, setActivation] = useState<ActivationFunction>("sigmoid");
  const [output, setOutput] = useState(0);

  const activationFunctions = {
    sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
    relu: (x: number) => Math.max(0, x),
    tanh: (x: number) => Math.tanh(x),
  };

  useEffect(() => {
    const sum = input1 * weight1 + input2 * weight2 + bias;
    const result = activationFunctions[activation](sum);
    setOutput(result);
  }, [weight1, weight2, bias, input1, input2, activation]);

  const getNeuronColor = (value: number) => {
    const intensity = Math.abs(value);
    return `hsl(190 ${Math.min(intensity * 100, 90)}% ${50 + intensity * 20}%)`;
  };

  return (
    <Card className="p-8 border-border bg-card/50 backdrop-blur">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Single Neuron Playground</h3>
        <p className="text-muted-foreground">
          Adjust inputs, weights, bias, and activation function to see how a neuron processes information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Input 1: {input1.toFixed(2)}</Label>
              <Slider
                value={[input1]}
                onValueChange={([v]) => setInput1(v)}
                min={-1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Input 2: {input2.toFixed(2)}</Label>
              <Slider
                value={[input2]}
                onValueChange={([v]) => setInput2(v)}
                min={-1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Weight 1: {weight1.toFixed(2)}</Label>
              <Slider
                value={[weight1]}
                onValueChange={([v]) => setWeight1(v)}
                min={-2}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Weight 2: {weight2.toFixed(2)}</Label>
              <Slider
                value={[weight2]}
                onValueChange={([v]) => setWeight2(v)}
                min={-2}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Bias: {bias.toFixed(2)}</Label>
              <Slider
                value={[bias]}
                onValueChange={([v]) => setBias(v)}
                min={-2}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Activation Function</Label>
              <Select value={activation} onValueChange={(v: ActivationFunction) => setActivation(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sigmoid">Sigmoid (0 to 1)</SelectItem>
                  <SelectItem value="relu">ReLU (max(0, x))</SelectItem>
                  <SelectItem value="tanh">Tanh (-1 to 1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md h-80">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Input neurons */}
              <circle cx="50" cy="75" r="25" fill={getNeuronColor(input1)} className="transition-all duration-300" />
              <text x="50" y="80" textAnchor="middle" fill="white" className="text-xs font-semibold">I1</text>
              <text x="50" y="115" textAnchor="middle" fill="currentColor" className="text-xs">{input1.toFixed(2)}</text>

              <circle cx="50" cy="225" r="25" fill={getNeuronColor(input2)} className="transition-all duration-300" />
              <text x="50" y="230" textAnchor="middle" fill="white" className="text-xs font-semibold">I2</text>
              <text x="50" y="265" textAnchor="middle" fill="currentColor" className="text-xs">{input2.toFixed(2)}</text>

              {/* Connections */}
              <line x1="75" y1="75" x2="175" y2="150" stroke={weight1 >= 0 ? "hsl(190 90% 50%)" : "hsl(0 72% 51%)"} strokeWidth={Math.abs(weight1) * 3 + 1} opacity="0.6" />
              <text x="110" y="100" fill="currentColor" className="text-xs">{weight1.toFixed(2)}</text>

              <line x1="75" y1="225" x2="175" y2="150" stroke={weight2 >= 0 ? "hsl(190 90% 50%)" : "hsl(0 72% 51%)"} strokeWidth={Math.abs(weight2) * 3 + 1} opacity="0.6" />
              <text x="110" y="205" fill="currentColor" className="text-xs">{weight2.toFixed(2)}</text>

              {/* Main neuron */}
              <circle cx="200" cy="150" r="40" fill={getNeuronColor(output)} className="transition-all duration-300 drop-shadow-glow-md" />
              <text x="200" y="145" textAnchor="middle" fill="white" className="text-xs font-semibold">Σ + b</text>
              <text x="200" y="160" textAnchor="middle" fill="white" className="text-xs">{activation}</text>

              {/* Output connection */}
              <line x1="240" y1="150" x2="340" y2="150" stroke="hsl(190 90% 50%)" strokeWidth="3" opacity="0.8" />
              <polygon points="340,150 330,145 330,155" fill="hsl(190 90% 50%)" />

              {/* Output neuron */}
              <circle cx="350" cy="150" r="25" fill={getNeuronColor(output)} className="transition-all duration-300 animate-pulse-glow" />
              <text x="350" y="155" textAnchor="middle" fill="white" className="text-xs font-semibold">OUT</text>
              <text x="350" y="190" textAnchor="middle" fill="currentColor" className="text-sm font-bold">{output.toFixed(3)}</text>
            </svg>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Sum:</strong> {(input1 * weight1 + input2 * weight2 + bias).toFixed(3)}
              <br />
              <strong className="text-foreground">Output:</strong> {output.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
