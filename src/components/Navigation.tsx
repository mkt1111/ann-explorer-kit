import { Button } from "@/components/ui/button";
import { Brain, Home, BookOpen, Sparkles, Info, TrendingUp } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "basics", label: "Basics", icon: Brain },
    { id: "simulations", label: "Simulations", icon: Sparkles },
    { id: "backprop", label: "Training", icon: TrendingUp },
    { id: "learn", label: "Learn More", icon: BookOpen },
    { id: "about", label: "About AI", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Neural Network Lab
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
