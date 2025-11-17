import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Shield, 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Sparkles,
  Star,
  Crown,
  Target,
  Rocket,
  Brain,
  Heart,
  Sword,
  Shield as ShieldIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    superheroName: "",
    powerLevel: "Beginner"
  });

  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem("heroProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setFormData(prev => ({
        ...prev,
        email: profile.email || "",
        name: profile.name || "",
        superheroName: profile.superheroName || ""
      }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSuperheroName = () => {
    const prefixes = ["Captain", "Super", "Ultra", "Mega", "Power", "Star", "Lightning", "Thunder"];
    const suffixes = ["Hero", "Warrior", "Guardian", "Protector", "Champion", "Legend", "Force", "Storm"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = 'http://localhost:5000/api/v1';

      if (isLogin) {
        // Login logic
        if (formData.email && formData.password) {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Save profile if remember me is checked
          if (rememberMe) {
            localStorage.setItem("heroProfile", JSON.stringify({
              email: formData.email,
              name: data.data.user.name,
              superheroName: data.data.user.superheroName
            }));
          } else {
            localStorage.removeItem("heroProfile");
          }

          // Save token
          localStorage.setItem("heroToken", data.data.token);

          onLoginSuccess(data.data.user);
          toast({
            title: "🦸‍♂️ Hero Mode Activated!",
            description: data.message,
          });
        } else {
          throw new Error("Please fill in all required fields");
        }
      } else {
        // Register logic
        if (formData.email && formData.password && formData.name && formData.superheroName && formData.powerLevel) {
          console.log('Sending registration data:', formData);
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.name,
              superheroName: formData.superheroName,
              powerLevel: formData.powerLevel
            })
          });

          const data = await response.json();
          console.log('Registration response:', data);

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          // Save profile if remember me is checked
          if (rememberMe) {
            localStorage.setItem("heroProfile", JSON.stringify({
              email: formData.email,
              name: data.data.user.name,
              superheroName: data.data.user.superheroName
            }));
          }

          // Save token
          localStorage.setItem("heroToken", data.data.token);

          onLoginSuccess(data.data.user);
          toast({
            title: "🌟 Hero Registration Complete!",
            description: data.message,
          });
        } else {
          const missingFields = [];
          if (!formData.email) missingFields.push("Email");
          if (!formData.password) missingFields.push("Password");
          if (!formData.name) missingFields.push("Civilian Name");
          if (!formData.superheroName) missingFields.push("Superhero Name");
          if (!formData.powerLevel) missingFields.push("Power Level");
          
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }
      }
    } catch (error) {
      toast({
        title: "⚠️ Mission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Try again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const powerLevels = [
    { value: "Beginner", label: "Beginner", icon: Star, color: "text-yellow-500" },
    { value: "Intermediate", label: "Intermediate", icon: Target, color: "text-orange-500" },
    { value: "Advanced", label: "Advanced", icon: Crown, color: "text-purple-500" },
    { value: "Legendary", label: "Legendary", icon: Rocket, color: "text-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-violet-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-violet-300 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Hero Portal Card */}
          <Card className="bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-slate-800/90 border-purple-500/20 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              {/* Hero Icon */}
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-purple-100">
                HERO PORTAL
              </CardTitle>
              
              <CardDescription className="text-purple-200 mt-2">
                Welcome to the <span className="font-semibold text-purple-300">interesting</span> and <span className="font-semibold text-purple-300">brain storming</span> part of our mission. Only verified heroes with proper credentials may proceed.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hero Identity */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-200 font-medium">
                    HERO IDENTITY
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your superhero email..."
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Secret Credential */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-200 font-medium">
                    SECRET CREDENTIAL
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your hero's secret..."
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Registration Fields */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-purple-200 font-medium">
                        CIVILIAN NAME
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your real name..."
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="superheroName" className="text-purple-200 font-medium">
                        SUPERHERO NAME
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="superheroName"
                          type="text"
                          placeholder="Enter your superhero name..."
                          value={formData.superheroName}
                          onChange={(e) => handleInputChange("superheroName", e.target.value)}
                          className="flex-1 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/60 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange("superheroName", generateSuperheroName())}
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-purple-200 font-medium">
                        POWER LEVEL
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {powerLevels.map((level) => {
                          const Icon = level.icon;
                          return (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => handleInputChange("powerLevel", level.value)}
                              className={`p-3 rounded-lg border transition-all ${
                                formData.powerLevel === level.value
                                  ? "border-purple-400 bg-purple-500/20"
                                  : "border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${level.color}`} />
                                <span className="text-sm text-purple-200">{level.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-purple-500/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-purple-200">
                    Remember my hero profile
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isLogin ? "Activating Hero Mode..." : "Registering Hero..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {isLogin ? "ACTIVATE HERO MODE" : "REGISTER HERO"}
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                >
                  {isLogin ? "New hero? Register here" : "Already a hero? Login here"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Hero Icons */}
          <div className="mt-8 flex justify-center">
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Brain, color: "text-purple-400" },
                { icon: Heart, color: "text-red-400" },
                { icon: Sword, color: "text-yellow-400" },
                { icon: ShieldIcon, color: "text-green-400" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
