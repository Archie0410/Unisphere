import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Calendar, BookOpen, Target, AlertTriangle, Clock, Award } from "lucide-react";
import { getUniversityById, universityDatabase } from "@/data/universities";

interface RoadmapGeneratorProps {
  studentData: any;
}

const RoadmapGenerator = ({ studentData }: RoadmapGeneratorProps) => {
  const [targetUniversity, setTargetUniversity] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [urlKey, setUrlKey] = useState(0);

  // Check for university parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const universityId = urlParams.get('university');
    
    if (universityId) {
      const university = getUniversityById(parseInt(universityId));
      if (university) {
        setTargetUniversity(university.name);
        // Auto-generate roadmap if university is pre-selected
        setTimeout(() => {
          setShowRoadmap(true);
        }, 500);
      }
    }
  }, [urlKey]);

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setUrlKey(prev => prev + 1);
    };
    
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Get university-specific information
  const getUniversityInfo = () => {
    if (!targetUniversity) return null;
    
    // Try to find the university in our database by name
    const university = universityDatabase.find(uni => 
      uni.name.toLowerCase().includes(targetUniversity.toLowerCase()) ||
      targetUniversity.toLowerCase().includes(uni.name.toLowerCase())
    );
    
    return university;
  };

  const universityInfo = getUniversityInfo();

  // Enhanced roadmap data with more realistic timelines
  const roadmapSteps = [
    {
      id: 1,
      title: "Entrance Exam Preparation",
      description: universityInfo?.entranceExams?.length > 0 
        ? `Comprehensive preparation for ${universityInfo.entranceExams.join(', ')} focusing on core subjects`
        : "Comprehensive preparation for required entrance exams focusing on core subjects",
      timeline: "4-6 months",
      priority: "High",
      completed: false,
      resources: universityInfo?.entranceExams?.includes("JEE Advanced") 
        ? ["Cengage Physics Series", "HC Verma Problems", "Allen/Aakash Test Series", "Previous Year Papers"]
        : ["NCERT Books", "Previous Year Papers", "Mock Test Series", "Study Material"],
      deadline: universityInfo?.deadline || "May 2024",
      estimatedHours: "4-6 hours daily",
      tips: ["Start with NCERT, then move to advanced books", "Take weekly mock tests", "Analyze weak areas regularly"]
    },
    {
      id: 2,
      title: "Application & Documentation",
      description: "Complete JoSAA counseling registration and document verification",
      timeline: "2 weeks",
      priority: "High",
      completed: false,
      resources: ["Official JoSAA Website", "Document Checklist", "Category Certificate"],
      deadline: "June 2024",
      estimatedHours: "2-3 hours total",
      tips: ["Keep all documents ready in advance", "Fill application form carefully", "Pay fees on time"]
    },
    {
      id: 3,
      title: "Interview Preparation",
      description: "Prepare for technical and personal interviews if required",
      timeline: "3-4 weeks",
      priority: "Medium",
      completed: false,
      resources: ["Interview Questions Bank", "Mock Interview Sessions", "Current Affairs"],
      deadline: "July 2024",
      estimatedHours: "1-2 hours daily",
      tips: ["Practice with peers", "Prepare your introduction", "Stay updated with current technology trends"]
    },
    {
      id: 4,
      title: "Backup Applications",
      description: "Apply to 4-5 backup colleges as safety options",
      timeline: "Ongoing",
      priority: "Medium",
      completed: false,
      resources: ["College Websites", "Application Forms", "Entrance Exam Scores"],
      deadline: "Various dates",
      estimatedHours: "1 hour per application",
      tips: ["Research thoroughly", "Meet minimum eligibility", "Keep application fees ready"]
    },
    {
      id: 5,
      title: "Skill Development",
      description: "Learn relevant skills for your chosen field",
      timeline: "Ongoing",
      priority: "Low",
      completed: false,
      resources: ["Online Courses", "Programming Languages", "Soft Skills Training"],
      deadline: "Before college starts",
      estimatedHours: "1 hour daily",
      tips: ["Focus on industry-relevant skills", "Build a portfolio", "Get certifications"]
    }
  ];

  const generateRoadmap = () => {
    if (!targetUniversity.trim()) return;
    setShowRoadmap(true);
  };

  if (!studentData) {
    return (
      <Card className="text-center p-12 bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl">
        <CardContent>
          <Target className="h-20 w-20 mx-auto text-purple-400 mb-6" />
          <h3 className="text-2xl font-semibold text-purple-800 mb-4">Create Your Profile First</h3>
          <p className="text-purple-700 text-lg leading-relaxed max-w-md mx-auto">
            Please fill out your academic profile to generate a personalized roadmap to your target university.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">University Roadmap Generator</h2>
        <p className="text-purple-200 text-lg">
          Get a personalized step-by-step plan to reach your target university
        </p>
      </div>

      {/* Target University Input */}
      <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-200/30 to-purple-300/40 border-b border-purple-300/30">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-800 font-semibold">Target University</CardTitle>
              <CardDescription className="text-purple-700">
                Enter your dream university for a customized roadmap
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-purple-100/20">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="target-university" className="text-purple-800 font-medium mb-2 block">
                University Name
              </Label>
              <Input
                id="target-university"
                value={targetUniversity}
                onChange={(e) => setTargetUniversity(e.target.value)}
                placeholder="e.g., IIT Delhi, Delhi University, Christ University"
                className="h-12 border-purple-400/40 bg-white/70 text-purple-800 placeholder:text-purple-600/70 focus:bg-white transition-colors"
              />
            </div>
            <Button 
              onClick={generateRoadmap} 
              className="self-end h-12 px-8 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border-0"
              disabled={!targetUniversity.trim()}
            >
              Generate Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Display */}
      {showRoadmap && (
        <div className="space-y-8">
          {/* Roadmap Overview */}
          <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl">
            <CardContent className="p-8 bg-purple-100/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-2">
                    Roadmap to {targetUniversity}
                  </h3>
                  <div className="flex items-center space-x-6 text-purple-700">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">6-8 months timeline</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Daily commitment required</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">85%</div>
                  <div className="text-sm text-purple-700">Success Rate</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-800">Overall Progress</span>
                  <span className="text-sm text-purple-700">1 of 5 steps completed</span>
                </div>
                <Progress value={20} className="h-3 bg-purple-200" />
              </div>
              
              <p className="text-purple-700 leading-relaxed">
                This roadmap is tailored based on your academic profile ({studentData.stream} stream, {studentData.percentage}) 
                and current preparation level. Follow each step systematically for the best results.
              </p>
              
              {universityInfo && (
                <div className="mt-4 p-4 bg-purple-200/30 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">University Details:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-700">Location:</span>
                      <span className="font-medium text-purple-800 ml-2">{universityInfo.location}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Acceptance Rate:</span>
                      <span className="font-medium text-purple-800 ml-2">{universityInfo.acceptance}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Annual Fees:</span>
                      <span className="font-medium text-purple-800 ml-2">₹{(universityInfo.tuitionFee / 100000).toFixed(1)} Lakh</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Deadline:</span>
                      <span className="font-medium text-purple-800 ml-2">{universityInfo.deadline}</span>
                    </div>
                  </div>
                  {universityInfo.entranceExams && universityInfo.entranceExams.length > 0 && (
                    <div className="mt-3">
                      <span className="text-purple-700">Entrance Exams:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {universityInfo.entranceExams.map((exam, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-400/40 text-purple-700 bg-white/60">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roadmap Steps */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-purple-800">Your Action Plan</h3>
            
            {roadmapSteps.map((step, index) => (
              <Card key={step.id} className={`bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl transition-all duration-300 hover:shadow-purple-400/30 ${
                step.completed ? 'bg-gradient-to-br from-green-100/20 via-green-200/30 to-green-100/20 border-l-4 border-l-green-500' : ''
              }`}>
                <CardContent className="p-8 bg-purple-100/20">
                  <div className="flex items-start space-x-6">
                    <div className="mt-1 flex-shrink-0">
                      {step.completed ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          index === 0 ? 'border-purple-500 bg-purple-500/10' : 'border-purple-300 bg-purple-200/50'
                        }`}>
                          <span className="text-sm font-semibold text-purple-800">{step.id}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-purple-800 mb-2">{step.title}</h4>
                          <p className="text-purple-700 leading-relaxed">{step.description}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={step.priority === "High" ? "destructive" : 
                                   step.priority === "Medium" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {step.priority} Priority
                          </Badge>
                          <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-700 bg-white/60">
                            {step.timeline}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div>
                          <h5 className="font-medium mb-3 flex items-center text-purple-800">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Recommended Resources
                          </h5>
                          <ul className="space-y-2">
                            {step.resources.map((resource, idx) => (
                              <li key={idx} className="flex items-start text-sm text-purple-700">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2 flex items-center text-purple-800">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Key Information
                            </h5>
                            <div className="space-y-2 text-sm text-purple-700">
                              <div className="flex justify-between">
                                <span>Deadline:</span>
                                <span className="font-semibold">{step.deadline}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time Commitment:</span>
                                <span className="font-semibold">{step.estimatedHours}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2 flex items-center text-purple-800">
                              <Award className="h-4 w-4 mr-2" />
                              Pro Tips
                            </h5>
                            <ul className="space-y-1">
                              {step.tips.slice(0, 2).map((tip, idx) => (
                                <li key={idx} className="text-xs text-purple-700 flex items-start">
                                  <div className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          size="sm" 
                          variant={step.completed ? "outline" : "default"}
                          className={step.completed ? "bg-gradient-to-r from-green-500 to-green-600 text-white" : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"}
                        >
                          {step.completed ? "✓ Completed" : "Mark as Complete"}
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-400/40 text-purple-700 hover:bg-purple-300/30 bg-white/60">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-400/40 text-purple-700 hover:bg-purple-300/30 bg-white/60">
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Tips */}
          <Card className="bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-2xl border-purple-300/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Award className="h-8 w-8 mr-3" />
                <h3 className="text-2xl font-bold">Keys to Success</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 opacity-80" />
                    <span>Start preparation early and maintain consistency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 opacity-80" />
                    <span>Take regular mock tests and analyze performance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 opacity-80" />
                    <span>Focus on weak areas while maintaining strengths</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 opacity-80" />
                    <span>Apply to multiple colleges for backup options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 opacity-80" />
                    <span>Stay updated with admission notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 opacity-80" />
                    <span>Maintain good health and manage stress effectively</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;