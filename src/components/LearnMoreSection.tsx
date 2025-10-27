import { Card } from "@/components/ui/card";
import { Calendar, Lightbulb, Rocket, Award } from "lucide-react";

export const LearnMoreSection = () => {
  const timeline = [
    { year: "1943", event: "McCulloch & Pitts create the first mathematical model of a neuron" },
    { year: "1958", event: "Rosenblatt invents the Perceptron, the first trainable neural network" },
    { year: "1986", event: "Backpropagation algorithm popularized, enabling deep learning" },
    { year: "2012", event: "AlexNet wins ImageNet, sparking the deep learning revolution" },
    { year: "2017", event: "Transformer architecture introduced, powering modern LLMs" },
    { year: "2023", event: "ChatGPT reaches 100M users, making AI mainstream" },
  ];

  const applications = [
    {
      icon: Lightbulb,
      title: "Computer Vision",
      description: "Face recognition, medical image analysis, self-driving cars, quality control in manufacturing",
    },
    {
      icon: Rocket,
      title: "Natural Language",
      description: "Language translation, chatbots, content generation, sentiment analysis, voice assistants",
    },
    {
      icon: Award,
      title: "Predictions & Analysis",
      description: "Stock market forecasting, weather prediction, fraud detection, recommendation systems",
    },
  ];

  return (
    <section id="learn" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            History & <span className="text-secondary">Applications</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From theoretical concepts to world-changing technology
          </p>
        </div>

        <div className="space-y-16">
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Historical Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <Card 
                  key={index}
                  className="p-6 border-l-4 border-l-primary bg-card/50 backdrop-blur hover:bg-card/70 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="text-2xl font-bold text-primary min-w-[80px]">{item.year}</div>
                    <div className="text-muted-foreground">{item.event}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-secondary" />
              Real-World Applications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {applications.map((app, index) => {
                const Icon = app.icon;
                return (
                  <Card 
                    key={index}
                    className="p-6 border-border bg-card/50 backdrop-blur hover:border-secondary/50 transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                        <Icon className="w-6 h-6 text-secondary" />
                      </div>
                      <h4 className="text-xl font-semibold">{app.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-8 border-primary/30 bg-gradient-to-br from-card to-primary/5">
            <h3 className="text-2xl font-bold mb-4 text-primary">Fun Facts</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>The human brain has ~86 billion neurons, while GPT-3 has 175 billion parameters (not quite the same, but impressive!)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Deep learning networks can have hundreds of layers, earning the name "deep" neural networks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>AlphaGo's victory over world champion Go player Lee Sedol in 2016 shocked the world with move 37, a creative play no human would make</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Neural networks can generate art, compose music, and even write code - they're creative tools, not just calculators!</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
