import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  BookOpen, 
  MapPin, 
  DollarSign, 
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileCreationProps {
  user: any;
  onProfileComplete: (userData: any) => void;
  onSkip: () => void;
}

const ProfileCreation = ({ user, onProfileComplete, onSkip }: ProfileCreationProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    grade12: {
      board: '',
      stream: '',
      percentage: '',
      year: ''
    },
    entranceExams: [],
    preferredFields: [],
    budget: {
      min: '',
      max: '',
      currency: 'INR'
    },
    location: {
      preferredCities: [],
      preferredStates: [],
      country: 'India'
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (section: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("heroToken");
      console.log('Token from localStorage:', token);
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await fetch('http://localhost:5000/api/v1/auth/profile/complete', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          academicProfile: profileData
        })
      });

      const data = await response.json();
      console.log('Profile completion response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete profile');
      }

      onProfileComplete(data.data.user);
      toast({
        title: "🎯 Profile Complete!",
        description: "Your hero profile is ready for missions!",
      });

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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-200">Academic Background</h3>
              <p className="text-blue-300">Tell us about your 12th grade performance</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-200">Board</Label>
                <Select onValueChange={(value) => handleInputChange('grade12', 'board', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-blue-500/30 text-white">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="State Board">State Board</SelectItem>
                    <SelectItem value="IB">IB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-blue-200">Stream</Label>
                <Select onValueChange={(value) => handleInputChange('grade12', 'stream', value)}>
                  <SelectTrigger className="bg-slate-700/50 border-blue-500/30 text-white">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-200">Percentage</Label>
                <Input
                  type="number"
                  placeholder="Enter percentage"
                  value={profileData.grade12.percentage}
                  onChange={(e) => handleInputChange('grade12', 'percentage', e.target.value)}
                  className="bg-slate-700/50 border-blue-500/30 text-white placeholder:text-blue-300/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-blue-200">Year</Label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={profileData.grade12.year}
                  onChange={(e) => handleInputChange('grade12', 'year', e.target.value)}
                  className="bg-slate-700/50 border-blue-500/30 text-white placeholder:text-blue-300/60"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-200">Preferred Fields</h3>
              <p className="text-blue-300">What interests you most?</p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-blue-200">Select your preferred fields</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Computer Science', 'Engineering', 'Medicine', 'Business',
                  'Arts & Design', 'Law', 'Agriculture', 'Architecture'
                ].map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => {
                      const current = profileData.preferredFields;
                      const updated = current.includes(field)
                        ? current.filter(f => f !== field)
                        : [...current, field];
                      setProfileData(prev => ({
                        ...prev,
                        preferredFields: updated
                      }));
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      profileData.preferredFields.includes(field)
                        ? "border-blue-400 bg-blue-500/20"
                        : "border-blue-500/30 bg-slate-700/50 hover:border-blue-400/50"
                    }`}
                  >
                    <span className="text-sm text-blue-200">{field}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-200">Budget Range</h3>
              <p className="text-blue-300">What's your budget for education?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-200">Minimum (₹)</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={profileData.budget.min}
                  onChange={(e) => handleInputChange('budget', 'min', e.target.value)}
                  className="bg-slate-700/50 border-blue-500/30 text-white placeholder:text-blue-300/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-blue-200">Maximum (₹)</Label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={profileData.budget.max}
                  onChange={(e) => handleInputChange('budget', 'max', e.target.value)}
                  className="bg-slate-700/50 border-blue-500/30 text-white placeholder:text-blue-300/60"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-200">Location Preferences</h3>
              <p className="text-blue-300">Where would you like to study?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-blue-200">Preferred Cities</Label>
                <Input
                  placeholder="Mumbai, Delhi, Bangalore (comma separated)"
                  value={profileData.location.preferredCities.join(', ')}
                  onChange={(e) => {
                    const cities = e.target.value.split(',').map(city => city.trim()).filter(city => city);
                    setProfileData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        preferredCities: cities
                      }
                    }));
                  }}
                  className="bg-slate-700/50 border-blue-500/30 text-white placeholder:text-blue-300/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-blue-200">Preferred States</Label>
                <Input
                  placeholder="Maharashtra, Karnataka, Delhi (comma separated)"
                  value={profileData.location.preferredStates.join(', ')}
                  onChange={(e) => {
                    const states = e.target.value.split(',').map(state => state.trim()).filter(state => state);
                    setProfileData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        preferredStates: states
                      }
                    }));
                  }}
                  className="bg-slate-700/50 border-blue-500/30 text-white placeholder:text-blue-300/60"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-gradient-to-br from-slate-800/90 via-blue-800/90 to-slate-800/90 border-blue-500/20 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  HERO PROFILE CREATION
                </CardTitle>
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              
              <CardDescription className="text-blue-200">
                Complete your hero profile to unlock powerful recommendations!
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-blue-300 mb-2">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-700" />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                >
                  Previous
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onSkip}
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                  >
                    Skip for Now
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Completing Profile...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Complete Profile
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
