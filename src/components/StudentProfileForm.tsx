import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, MapPin, DollarSign, GraduationCap, Edit3, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentProfileFormProps {
  onSubmit: (data: any) => void;
  isEditMode?: boolean;
  initialData?: any;
  onCancel?: () => void;
}

const StudentProfileForm = ({ onSubmit, isEditMode = false, initialData, onCancel }: StudentProfileFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    board: "",
    stream: "",
    percentage: "",
    subjects: {
      physics: "",
      chemistry: "",
      maths: "",
      biology: "",
      english: ""
    },
    entranceExams: "",
    preferredField: "",
    locationPreference: "",
    budget: "",
    additionalInfo: ""
  });

  // Load initial data if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || "",
        board: initialData.board || "",
        stream: initialData.stream || "",
        percentage: initialData.percentage || "",
        subjects: {
          physics: initialData.subjects?.physics || "",
          chemistry: initialData.subjects?.chemistry || "",
          maths: initialData.subjects?.maths || "",
          biology: initialData.subjects?.biology || "",
          english: initialData.subjects?.english || ""
        },
        entranceExams: initialData.entranceExams || "",
        preferredField: initialData.preferredField || "",
        locationPreference: initialData.locationPreference || "",
        budget: initialData.budget || "",
        additionalInfo: initialData.additionalInfo || ""
      });
    }
  }, [isEditMode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.board || !formData.stream || !formData.percentage) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
    toast({
      title: isEditMode ? "Profile Updated Successfully!" : "Profile Created Successfully!",
      description: isEditMode 
        ? "Your academic profile has been updated. View your updated recommendations now."
        : "Your academic profile has been saved. View your university recommendations now.",
      className: "bg-gradient-success text-white border-0"
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSubjectScore = (subject: string, score: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: score }
    }));
  };

  return (
    <Card className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-slate-800/90 border-purple-500/20 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-b border-purple-500/20">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            {isEditMode ? <Edit3 className="h-6 w-6 text-white" /> : <User className="h-6 w-6 text-white" />}
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              {isEditMode ? "Edit Your Academic Profile" : "Create Your Academic Profile"}
            </CardTitle>
            <CardDescription className="text-purple-200">
              {isEditMode 
                ? "Update your academic information for better recommendations"
                : "Tell us about your academic background for personalized recommendations"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
          
      <CardContent className="p-8 bg-slate-800/50">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-300">Basic Information</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-300 font-medium">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 border-purple-500/30 bg-slate-700/50 text-white placeholder:text-purple-300/60 focus:bg-slate-700/70 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="board" className="text-purple-300 font-medium">Board *</Label>
                <Select value={formData.board} onValueChange={(value) => updateFormData("board", value)}>
                  <SelectTrigger className="h-12 border-purple-500/30 bg-slate-700/50 text-white placeholder:text-purple-300/60 focus:bg-slate-700/70">
                    <SelectValue placeholder="Select your board" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-purple-500/30">
                    <SelectItem value="CBSE" className="text-purple-200 hover:bg-purple-500/20">CBSE</SelectItem>
                    <SelectItem value="ICSE" className="text-purple-200 hover:bg-purple-500/20">ICSE</SelectItem>
                    <SelectItem value="State Board" className="text-purple-200 hover:bg-purple-500/20">State Board</SelectItem>
                    <SelectItem value="IB" className="text-purple-200 hover:bg-purple-500/20">International Baccalaureate</SelectItem>
                    <SelectItem value="Other" className="text-purple-200 hover:bg-purple-500/20">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stream" className="text-purple-300 font-medium">Stream *</Label>
                <Select value={formData.stream} onValueChange={(value) => updateFormData("stream", value)}>
                  <SelectTrigger className="h-12 border-purple-500/30 bg-slate-700/50 text-white placeholder:text-purple-300/60 focus:bg-slate-700/70">
                    <SelectValue placeholder="Select your stream" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-purple-500/30">
                    <SelectItem value="Science" className="text-purple-200 hover:bg-purple-500/20">Science (PCM)</SelectItem>
                    <SelectItem value="Science (PCB)" className="text-purple-200 hover:bg-purple-500/20">Science (PCB)</SelectItem>
                    <SelectItem value="Commerce" className="text-purple-200 hover:bg-purple-500/20">Commerce</SelectItem>
                    <SelectItem value="Arts" className="text-purple-200 hover:bg-purple-500/20">Arts/Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="percentage" className="text-purple-300 font-medium">Percentage/CGPA *</Label>
                <Input
                  id="percentage"
                  value={formData.percentage}
                  onChange={(e) => updateFormData("percentage", e.target.value)}
                  placeholder="e.g., 85% or 8.5 CGPA"
                  className="h-12 border-purple-500/30 bg-slate-700/50 text-white placeholder:text-purple-300/60 focus:bg-slate-700/70 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Subject-wise Scores */}
          {formData.stream === "Science" || formData.stream === "Science (PCB)" ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-300">Subject-wise Scores</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.stream === "Science" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="physics" className="text-green-300 font-medium">Physics</Label>
                      <Input
                        id="physics"
                        value={formData.subjects.physics}
                        onChange={(e) => updateSubjectScore("physics", e.target.value)}
                        placeholder="e.g., 85"
                        className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chemistry" className="text-green-300 font-medium">Chemistry</Label>
                      <Input
                        id="chemistry"
                        value={formData.subjects.chemistry}
                        onChange={(e) => updateSubjectScore("chemistry", e.target.value)}
                        placeholder="e.g., 82"
                        className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maths" className="text-green-300 font-medium">Mathematics</Label>
                      <Input
                        id="maths"
                        value={formData.subjects.maths}
                        onChange={(e) => updateSubjectScore("maths", e.target.value)}
                        placeholder="e.g., 88"
                        className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="physics" className="text-green-300 font-medium">Physics</Label>
                      <Input
                        id="physics"
                        value={formData.subjects.physics}
                        onChange={(e) => updateSubjectScore("physics", e.target.value)}
                        placeholder="e.g., 85"
                        className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chemistry" className="text-green-300 font-medium">Chemistry</Label>
                      <Input
                        id="chemistry"
                        value={formData.subjects.chemistry}
                        onChange={(e) => updateSubjectScore("chemistry", e.target.value)}
                        placeholder="e.g., 82"
                        className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biology" className="text-green-300 font-medium">Biology</Label>
                      <Input
                        id="biology"
                        value={formData.subjects.biology}
                        onChange={(e) => updateSubjectScore("biology", e.target.value)}
                        placeholder="e.g., 90"
                        className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="english" className="text-green-300 font-medium">English</Label>
                  <Input
                    id="english"
                    value={formData.subjects.english}
                    onChange={(e) => updateSubjectScore("english", e.target.value)}
                    placeholder="e.g., 78"
                    className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-300">Subject-wise Scores</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="english" className="text-green-300 font-medium">English</Label>
                  <Input
                    id="english"
                    value={formData.subjects.english}
                    onChange={(e) => updateSubjectScore("english", e.target.value)}
                    placeholder="e.g., 78"
                    className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maths" className="text-green-300 font-medium">Mathematics</Label>
                  <Input
                    id="maths"
                    value={formData.subjects.maths}
                    onChange={(e) => updateSubjectScore("maths", e.target.value)}
                    placeholder="e.g., 88"
                    className="h-12 border-green-500/30 bg-slate-700/50 text-white placeholder:text-green-300/60 focus:bg-slate-700/70 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-300">Your Preferences</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredField" className="text-blue-300 font-medium">Preferred Field of Study</Label>
                <Select value={formData.preferredField} onValueChange={(value) => updateFormData("preferredField", value)}>
                  <SelectTrigger className="h-12 border-blue-500/30 bg-slate-700/50 text-white placeholder:text-blue-300/60 focus:bg-slate-700/70">
                    <SelectValue placeholder="Select preferred field" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-blue-500/30">
                    <SelectItem value="engineering" className="text-blue-200 hover:bg-blue-500/20">Engineering & Technology</SelectItem>
                    <SelectItem value="medicine" className="text-blue-200 hover:bg-blue-500/20">Medicine & Healthcare</SelectItem>
                    <SelectItem value="business" className="text-blue-200 hover:bg-blue-500/20">Business & Management</SelectItem>
                    <SelectItem value="computer-science" className="text-blue-200 hover:bg-blue-500/20">Computer Science & IT</SelectItem>
                    <SelectItem value="law" className="text-blue-200 hover:bg-blue-500/20">Law & Legal Studies</SelectItem>
                    <SelectItem value="arts" className="text-blue-200 hover:bg-blue-500/20">Arts & Humanities</SelectItem>
                    <SelectItem value="science" className="text-blue-200 hover:bg-blue-500/20">Pure Sciences</SelectItem>
                    <SelectItem value="design" className="text-blue-200 hover:bg-blue-500/20">Design & Architecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-blue-300 font-medium">Location Preference</Label>
                <Input
                  id="location"
                  value={formData.locationPreference}
                  onChange={(e) => updateFormData("locationPreference", e.target.value)}
                  placeholder="e.g., Delhi, Mumbai, Bangalore"
                  className="h-12 border-blue-500/30 bg-slate-700/50 text-white placeholder:text-blue-300/60 focus:bg-slate-700/70 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-blue-300 font-medium">Annual Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                  <SelectTrigger className="h-12 border-blue-500/30 bg-slate-700/50 text-white placeholder:text-blue-300/60 focus:bg-slate-700/70">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-blue-500/30">
                    <SelectItem value="under-2-lakh" className="text-blue-200 hover:bg-blue-500/20">Under ₹2 Lakh</SelectItem>
                    <SelectItem value="2-5-lakh" className="text-blue-200 hover:bg-blue-500/20">₹2-5 Lakh</SelectItem>
                    <SelectItem value="5-10-lakh" className="text-blue-200 hover:bg-blue-500/20">₹5-10 Lakh</SelectItem>
                    <SelectItem value="10-20-lakh" className="text-blue-200 hover:bg-blue-500/20">₹10-20 Lakh</SelectItem>
                    <SelectItem value="above-20-lakh" className="text-blue-200 hover:bg-blue-500/20">Above ₹20 Lakh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entranceExams" className="text-blue-300 font-medium">Entrance Exam Scores (Optional)</Label>
                <Input
                  id="entranceExams"
                  value={formData.entranceExams}
                  onChange={(e) => updateFormData("entranceExams", e.target.value)}
                  placeholder="e.g., JEE: 95 percentile, NEET: 650"
                  className="h-12 border-blue-500/30 bg-slate-700/50 text-white placeholder:text-blue-300/60 focus:bg-slate-700/70 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <Label htmlFor="additionalInfo" className="text-blue-300 font-medium">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => updateFormData("additionalInfo", e.target.value)}
              placeholder="Any specific requirements, achievements, extracurricular activities, or preferences..."
              rows={4}
              className="border-blue-500/30 bg-slate-700/50 text-white placeholder:text-blue-300/60 focus:bg-slate-700/70 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-center gap-4 pt-6">
            {isEditMode && onCancel && (
              <Button 
                type="button"
                variant="outline"
                size="lg" 
                onClick={onCancel}
                className="px-8 h-14 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-lg font-medium"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              size="lg" 
              className="px-12 h-14 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-lg font-medium shadow-lg"
            >
              {isEditMode ? (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Update Profile
                </>
              ) : (
                "Create My Profile & Get Matches"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentProfileForm;