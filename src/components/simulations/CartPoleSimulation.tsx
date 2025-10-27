import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export const CartPoleSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingIterations, setTrainingIterations] = useState(100);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [angle, setAngle] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [cartPosition, setCartPosition] = useState(200);
  const [cartVelocity, setCartVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const animationRef = useRef<number>();
  const mouseDownRef = useRef(false);
  const mouseXRef = useRef(0);
  
  // Use refs to store current values for physics simulation
  const angleRef = useRef(0);
  const angularVelocityRef = useRef(0);
  const cartPositionRef = useRef(200);
  const cartVelocityRef = useRef(0);

  // Neural network weights - will be trained
  const [weights, setWeights] = useState({
    w1: [0.1, 0.2, -0.1, 0.15],  // Input to hidden layer weights
    w2: [0.5],                    // Hidden to output weight
    bias1: [0, 0, 0, 0],          // Hidden layer biases
    bias2: 0                      // Output bias
  });

  // Neural network forward pass
  const neuralNetworkDecision = (state: number[], currentWeights = weights) => {
    const [angle, angularVelocity, cartPos, cartVel] = state;
    
    // Normalize inputs (cartPos is already normalized when passed in)
    const normalizedState = [
      angle / (Math.PI / 3),           // Normalize angle
      angularVelocity / 2,              // Normalize angular velocity
      cartPos,                          // Already normalized (-1 to 1)
      cartVel / 5                       // Normalize velocity
    ];
    
    // Hidden layer with tanh activation
    const hidden = normalizedState.map((input, i) => 
      Math.tanh(input * currentWeights.w1[i] + currentWeights.bias1[i])
    );
    
    // Output layer - sum of hidden activations
    const output = hidden.reduce((sum, h, i) => sum + h * currentWeights.w2[0], 0) + currentWeights.bias2;
    
    // Return value between -1 and 1
    return Math.tanh(output);
  };

  // Training function using evolutionary strategy
  const trainNetwork = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    let bestWeights = { ...weights };
    let bestFitness = 0;
    
    for (let iteration = 0; iteration < trainingIterations; iteration++) {
      // Generate candidate solutions by mutating current best
      const candidates = [];
      const learningRate = 0.5 * (1 - iteration / trainingIterations); // Decay learning rate
      
      for (let c = 0; c < 10; c++) {
        const mutatedWeights = {
          w1: bestWeights.w1.map(w => w + (Math.random() - 0.5) * learningRate),
          w2: [bestWeights.w2[0] + (Math.random() - 0.5) * learningRate],
          bias1: bestWeights.bias1.map(b => b + (Math.random() - 0.5) * learningRate),
          bias2: bestWeights.bias2 + (Math.random() - 0.5) * learningRate
        };
        
        // Evaluate this candidate
        const fitness = evaluatePolicy(mutatedWeights);
        candidates.push({ weights: mutatedWeights, fitness });
      }
      
      // Keep best candidate
      candidates.sort((a, b) => b.fitness - a.fitness);
      if (candidates[0].fitness > bestFitness) {
        bestFitness = candidates[0].fitness;
        bestWeights = candidates[0].weights;
      }
      
      setTrainingProgress(((iteration + 1) / trainingIterations) * 100);
      
      // Yield to UI
      if (iteration % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    setWeights(bestWeights);
    setBestScore(Math.floor(bestFitness));
    setIsTraining(false);
  };

  // Evaluate a policy by running a simulation episode
  const evaluatePolicy = (testWeights: typeof weights): number => {
    let simAngle = (Math.random() - 0.5) * 0.3;
    let simAngularVel = 0;
    let simCartPos = 200;
    let simCartVel = 0;
    let steps = 0;
    const maxSteps = 1000;
    
    while (steps < maxSteps) {
      const state = [simAngle, simAngularVel, (simCartPos - 200) / 200, simCartVel];
      const decision = neuralNetworkDecision(state, testWeights);
      const force = decision * 500;
      
      // Physics
      const gravity = 9.81;
      const massCart = 1.0;
      const massPole = 0.1;
      const length = 1.0;
      const dt = 0.016;
      const totalMass = massCart + massPole;
      const poleMassLength = massPole * length;
      
      const temp = (force + poleMassLength * simAngularVel * simAngularVel * Math.sin(simAngle)) / totalMass;
      const angularAccel = (gravity * Math.sin(simAngle) - Math.cos(simAngle) * temp) /
        (length * (4.0 / 3.0 - (massPole * Math.cos(simAngle) * Math.cos(simAngle)) / totalMass));
      const cartAccel = temp - (poleMassLength * angularAccel * Math.cos(simAngle)) / totalMass;
      
      simAngularVel += angularAccel * dt;
      simAngle += simAngularVel * dt;
      simCartVel += cartAccel * dt;
      simCartPos += simCartVel * dt;
      
      // Check failure - canvas is 400px, cart is 40px wide
      if (Math.abs(simAngle) > Math.PI / 3 || simCartPos < 20 || simCartPos > 380) {
        break;
      }
      
      steps++;
    }
    
    return steps; // Fitness = how many steps it survived
  };

  const update = () => {
    if (failed) return;

    // Get current values from refs
    const prevAngle = angleRef.current;
    const prevAngularVelocity = angularVelocityRef.current;
    const prevCartPosition = cartPositionRef.current;
    const prevCartVelocity = cartVelocityRef.current;

    // Neural network makes decision
    const state = [prevAngle, prevAngularVelocity, (prevCartPosition - 200) / 200, prevCartVelocity];
    const decision = neuralNetworkDecision(state);
    
    // Apply force based on network decision
    const force = decision * 500; // Strong force for visible cart movement

    // Physics simulation (standard cart-pole parameters)
    const gravity = 9.81;
    const massCart = 1.0;
    const massPole = 0.1;
    const length = 1.0; // Longer pole = easier to balance visually
    const dt = 0.016; // ~60fps

    const totalMass = massCart + massPole;
    const poleMassLength = massPole * length;

    const temp = (force + poleMassLength * prevAngularVelocity * prevAngularVelocity * Math.sin(prevAngle)) / totalMass;
    const angularAcceleration =
      (gravity * Math.sin(prevAngle) - Math.cos(prevAngle) * temp) /
      (length * (4.0 / 3.0 - (massPole * Math.cos(prevAngle) * Math.cos(prevAngle)) / totalMass));
    
    const cartAcceleration = temp - (poleMassLength * angularAcceleration * Math.cos(prevAngle)) / totalMass;

    // Calculate new values
    const newAngularVelocity = prevAngularVelocity + angularAcceleration * dt;
    const newAngle = prevAngle + newAngularVelocity * dt;
    const newCartVelocity = prevCartVelocity + cartAcceleration * dt;
    const newCartPosition = prevCartPosition + newCartVelocity * dt;

    // Check failure conditions - canvas is 400px, cart is 40px wide
    if (Math.abs(newAngle) > Math.PI / 3 || newCartPosition < 20 || newCartPosition > 380) {
      setFailed(true);
      setIsRunning(false);
      return;
    }

    // Update refs with new values
    angleRef.current = newAngle;
    angularVelocityRef.current = newAngularVelocity;
    cartPositionRef.current = newCartPosition;
    cartVelocityRef.current = newCartVelocity;

    // Update state for rendering
    setAngle(newAngle);
    setAngularVelocity(newAngularVelocity);
    setCartPosition(newCartPosition);
    setCartVelocity(newCartVelocity);
    setScore(s => s + 1);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning && !failed) {
      intervalId = setInterval(() => {
        update();
      }, 20);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, failed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = "hsl(var(--muted))";
      ctx.fillRect(0, 250, 400, 10);

      // Track limits
      ctx.strokeStyle = "hsl(var(--destructive))";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 240);
      ctx.lineTo(50, 260);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(350, 240);
      ctx.lineTo(350, 260);
      ctx.stroke();

      // Cart
      ctx.fillStyle = failed ? "hsl(var(--destructive))" : "hsl(var(--primary))";
      ctx.fillRect(cartPosition - 20, 230, 40, 20);
      ctx.strokeStyle = "hsl(var(--primary-foreground))";
      ctx.lineWidth = 2;
      ctx.strokeRect(cartPosition - 20, 230, 40, 20);

      // Pole
      const poleLength = 100;
      const poleEndX = cartPosition + Math.sin(angle) * poleLength;
      const poleEndY = 230 - Math.cos(angle) * poleLength;

      ctx.strokeStyle = failed ? "hsl(var(--destructive))" : "hsl(var(--accent))";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cartPosition, 230);
      ctx.lineTo(poleEndX, poleEndY);
      ctx.stroke();

      // Pole bob
      ctx.fillStyle = failed ? "hsl(var(--destructive))" : "hsl(var(--accent))";
      ctx.beginPath();
      ctx.arc(poleEndX, poleEndY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Angle indicator
      ctx.strokeStyle = "hsl(var(--muted-foreground))";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cartPosition, 230);
      ctx.lineTo(cartPosition, 130);
      ctx.stroke();
      ctx.setLineDash([]);

      // Network decision indicator (force arrow)
      const state = [angle, angularVelocity, (cartPosition - 200) / 200, cartVelocity];
      const decision = neuralNetworkDecision(state);
      if (isRunning && !failed) {
        ctx.fillStyle = decision > 0 ? "hsl(190 90% 50%)" : "hsl(260 70% 60%)";
        const arrowLength = Math.abs(decision) * 30;
        const arrowX = cartPosition + (decision > 0 ? arrowLength : -arrowLength);
        ctx.beginPath();
        ctx.moveTo(cartPosition, 260);
        ctx.lineTo(arrowX, 260);
        ctx.lineTo(arrowX - (decision > 0 ? 5 : -5), 255);
        ctx.moveTo(arrowX, 260);
        ctx.lineTo(arrowX - (decision > 0 ? 5 : -5), 265);
        ctx.stroke();
      }
    };

    draw();
  }, [cartPosition, angle, failed, isRunning, angularVelocity, cartVelocity]);

  const handleReset = () => {
    const newAngle = (Math.random() - 0.5) * 0.3; // Start with moderate tilt
    setAngle(newAngle);
    setAngularVelocity(0);
    setCartPosition(200);
    setCartVelocity(0);
    setScore(0);
    setFailed(false);
    
    // Update refs too
    angleRef.current = newAngle;
    angularVelocityRef.current = 0;
    cartPositionRef.current = 200;
    cartVelocityRef.current = 0;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseDownRef.current = true;
    mouseXRef.current = e.nativeEvent.offsetX;
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouseDownRef.current) {  // Allow dragging during simulation too
      const currentX = e.nativeEvent.offsetX;
      const delta = (currentX - mouseXRef.current) * 0.01;
      const newAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angleRef.current + delta));
      setAngle(newAngle);
      angleRef.current = newAngle;
      mouseXRef.current = currentX;
    }
  };

  const handleCanvasMouseUp = () => {
    mouseDownRef.current = false;
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseDownRef.current = true;
      mouseXRef.current = touch.clientX - rect.left;
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (mouseDownRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const currentX = touch.clientX - rect.left;
        const delta = (currentX - mouseXRef.current) * 0.01;
        const newAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angleRef.current + delta));
        setAngle(newAngle);
        angleRef.current = newAngle;
        mouseXRef.current = currentX;
      }
    }
  };

  const handleCanvasTouchEnd = () => {
    mouseDownRef.current = false;
  };

  return (
    <Card className="p-8 border-border bg-card/50 backdrop-blur">
      <div className="mb-8 space-y-4">
        <h3 className="text-2xl font-bold">Cart-Pole Balance AI</h3>
        <p className="text-muted-foreground">
          Train a neural network to balance a pole on a moving cart - a classic reinforcement learning problem
        </p>
        
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
          <h4 className="text-sm font-semibold text-primary mb-2">How it works:</h4>
          <p className="text-xs text-muted-foreground mb-2">
            The neural network receives four inputs: <strong className="text-foreground">pole angle</strong>, 
            <strong className="text-foreground"> angular velocity</strong>, 
            <strong className="text-foreground"> cart position</strong>, and 
            <strong className="text-foreground"> cart velocity</strong>.
          </p>
          <p className="text-xs text-muted-foreground">
            First, <strong className="text-primary">train the network</strong> using evolutionary strategies. 
            The AI tests different weight configurations and keeps the best performers. 
            Then watch it balance the pole using what it learned!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Training Controls */}
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 space-y-4">
            <h4 className="text-sm font-semibold text-accent">Training Controls</h4>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Training Iterations:</label>
              <input
                type="number"
                min="10"
                max="500"
                value={trainingIterations}
                onChange={(e) => setTrainingIterations(parseInt(e.target.value) || 100)}
                disabled={isTraining || isRunning}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
              />
            </div>
            <Button
              onClick={trainNetwork}
              disabled={isTraining || isRunning}
              className="w-full gap-2"
              variant="secondary"
            >
              {isTraining ? (
                <>Training... {trainingProgress.toFixed(0)}%</>
              ) : (
                <>Train Network</>
              )}
            </Button>
            {bestScore > 0 && (
              <div className="text-xs text-muted-foreground text-center">
                Best training score: <strong className="text-primary">{bestScore}</strong> steps
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              disabled={failed || isTraining}
              className="flex-1 gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" className="gap-2" disabled={isTraining}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {!isRunning && !failed && !isTraining && (
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/30 text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Train the network first, then drag the pole anytime to challenge the AI!
            </div>
          )}

          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Balance Time:</span>
              <span className="text-lg font-bold text-primary">{(score / 50).toFixed(1)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pole Angle:</span>
              <span className={`text-lg font-bold ${Math.abs(angle) > Math.PI / 6 ? 'text-destructive' : 'text-secondary'}`}>
                {(angle * 180 / Math.PI).toFixed(1)}°
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cart Position:</span>
              <span className="text-lg font-bold text-accent">{cartPosition.toFixed(0)}</span>
            </div>
            {failed && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-destructive font-semibold">
                  ❌ Failed! {Math.abs(angle) > Math.PI / 3 ? "Pole fell over" : "Cart hit the edge"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <h4 className="text-sm font-semibold text-accent">Network Inputs & Outputs:</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Pole Angle:</span>
                <span className="font-mono text-foreground">{angle.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Angular Velocity:</span>
                <span className="font-mono text-foreground">{angularVelocity.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cart Position (normalized):</span>
                <span className="font-mono text-foreground">{((cartPosition - 200) / 200).toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cart Velocity:</span>
                <span className="font-mono text-foreground">{cartVelocity.toFixed(3)}</span>
              </div>
              <div className="pt-2 border-t border-accent/30 flex justify-between">
                <span className="font-semibold">Network Decision:</span>
                <span className={`font-mono font-bold ${
                  neuralNetworkDecision([angle, angularVelocity, (cartPosition - 200) / 200, cartVelocity]) > 0 
                    ? 'text-primary' 
                    : 'text-secondary'
                }`}>
                  {neuralNetworkDecision([angle, angularVelocity, (cartPosition - 200) / 200, cartVelocity]) > 0 ? 'Push Right →' : '← Push Left'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border text-xs text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">About this demo:</strong> This is a simplified cart-pole system, 
              one of the most famous problems in reinforcement learning and control theory.
            </p>
            <p>
              Real implementations use techniques like <strong className="text-foreground">Q-learning</strong>, 
              <strong className="text-foreground"> Deep Q-Networks (DQN)</strong>, or 
              <strong className="text-foreground"> Policy Gradients</strong> to train the network through trial and error, 
              learning from thousands of episodes to develop an optimal control strategy.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchCancel={handleCanvasTouchEnd}
            className="w-full max-w-md border border-border rounded-lg shadow-glow-sm cursor-grab active:cursor-grabbing touch-none"
          />
        </div>
      </div>
    </Card>
  );
};
