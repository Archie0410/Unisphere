import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Target, 
  MapPin, 
  DollarSign, 
  BookOpen, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 0,
      title: "Welcome to UniSphere",
      description: "Your AI-powered university matching assistant",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              Find Your Perfect University Match
            </h2>
            <p className="text-lg text-brand-muted leading-relaxed max-w-2xl mx-auto">
              UniSphere uses advanced algorithms to match you with universities that align with your 
              academic profile, preferences, and career goals. Let's get started on your journey!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-brand-primary mb-2">Smart Matching</h3>
              <p className="text-sm text-brand-muted">AI-powered recommendations based on your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-brand-primary mb-2">Custom Roadmaps</h3>
              <p className="text-sm text-brand-muted">Step-by-step guidance to your target universities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-brand-primary mb-2">Career Guidance</h3>
              <p className="text-sm text-brand-muted">Expert advice on emerging careers and opportunities</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Academic Profile",
      description: "Tell us about your academic background",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-brand-primary mb-2">
              Your Academic Journey
            </h3>
            <p className="text-brand-muted">
              We'll use this information to find universities that match your academic profile
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-dashed border-brand-accent/30 hover:border-brand-accent/60 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-brand-accent mx-auto mb-4" />
                <h4 className="font-semibold text-brand-primary mb-2">12th Grade Results</h4>
                <p className="text-sm text-brand-muted mb-4">
                  Your board, stream, and percentage scores
                </p>
                <Badge variant="outline" className="text-brand-accent">
                  Required
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-dashed border-muted hover:border-brand-accent/30 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-brand-muted mx-auto mb-4" />
                <h4 className="font-semibold text-brand-primary mb-2">Entrance Exams</h4>
                <p className="text-sm text-brand-muted mb-4">
                  JEE, NEET, or other exam scores
                </p>
                <Badge variant="outline" className="text-brand-muted">
                  Optional
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-dashed border-muted hover:border-brand-accent/30 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-brand-muted mx-auto mb-4" />
                <h4 className="font-semibold text-brand-primary mb-2">Location Preferences</h4>
                <p className="text-sm text-brand-muted mb-4">
                  Preferred cities or states for study
                </p>
                <Badge variant="outline" className="text-brand-muted">
                  Optional
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-dashed border-muted hover:border-brand-accent/30 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-brand-muted mx-auto mb-4" />
                <h4 className="font-semibold text-brand-primary mb-2">Budget Range</h4>
                <p className="text-sm text-brand-muted mb-4">
                  Annual tuition fee budget
                </p>
                <Badge variant="outline" className="text-brand-muted">
                  Optional
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Career Goals",
      description: "What do you want to study?",
      icon: GraduationCap,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-brand-primary mb-2">
              Choose Your Path
            </h3>
            <p className="text-brand-muted">
              Select your preferred field of study to get targeted recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Engineering", icon: "⚙️", description: "Technology & Innovation" },
              { name: "Medicine", icon: "🏥", description: "Healthcare & Life Sciences" },
              { name: "Business", icon: "💼", description: "Management & Commerce" },
              { name: "Computer Science", icon: "💻", description: "Software & AI" },
              { name: "Arts", icon: "🎨", description: "Creative & Humanities" },
              { name: "Science", icon: "🔬", description: "Research & Discovery" },
            ].map((field, index) => (
              <Card key={index} className="border-2 border-dashed border-muted hover:border-brand-accent/60 transition-colors cursor-pointer hover:shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{field.icon}</div>
                  <h4 className="font-semibold text-brand-primary text-sm mb-1">{field.name}</h4>
                  <p className="text-xs text-brand-muted">{field.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-brand-accent mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-brand-primary mb-1">Pro Tip</h4>
                <p className="text-sm text-brand-muted">
                  Don't worry if you're unsure! You can always change your preferences later, 
                  and we'll provide recommendations for multiple fields.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "You're All Set!",
      description: "Ready to discover your perfect matches",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              Welcome to UniSphere!
            </h2>
            <p className="text-lg text-brand-muted leading-relaxed max-w-2xl mx-auto mb-8">
              You're now ready to explore personalized university recommendations, 
              create custom roadmaps, and get expert career guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-brand-primary">Next Steps</h3>
                </div>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-accent" />
                    <span>Complete your academic profile</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-accent" />
                    <span>Get personalized recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-accent" />
                    <span>Create your university roadmap</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-accent" />
                    <span>Explore career opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-brand-primary">What's New</h3>
                </div>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-brand-accent" />
                    <span>AI-powered matching algorithm</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-brand-accent" />
                    <span>Real-time application tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-brand-accent" />
                    <span>Career aptitude assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-brand-accent" />
                    <span>Expert career counseling</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-subtle p-1">
          <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="bg-gradient-brand text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold">UniSphere</h1>
                    <p className="text-white/80 text-sm">University Matching Assistant</p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Skip for now
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm">{currentStep + 1} of {steps.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">
                  {currentStepData.title}
                </h2>
                <p className="text-brand-muted">
                  {currentStepData.description}
                </p>
              </div>

              <div className="mb-8">
                {currentStepData.content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex space-x-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-brand-accent'
                          : completedSteps.includes(index)
                          ? 'bg-brand-accent/50'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-gradient-brand hover:bg-gradient-brand/90"
                >
                  <span>
                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
