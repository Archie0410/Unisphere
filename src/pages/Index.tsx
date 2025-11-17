import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, MapPin, Target, Users, BookOpen, TrendingUp, Sparkles, Play, ChevronDown, ArrowUp, Zap, User, Edit3 } from "lucide-react";
import StudentProfileForm from "@/components/StudentProfileForm";
import UniversityRecommendations from "@/components/UniversityRecommendations";
import UniversitySearch from "@/components/UniversitySearch";
import RoadmapGenerator from "@/components/RoadmapGenerator";
import CareerCounseling from "@/components/CareerCounseling";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [studentData, setStudentData] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const mainAppRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transform academicProfile to studentData format
  const transformAcademicProfile = (academicProfile: any) => {
    if (!academicProfile) return null;
    
    return {
      stream: academicProfile.grade12?.stream || '',
      percentage: academicProfile.grade12?.percentage || 0,
      board: academicProfile.grade12?.board || '',
      year: academicProfile.grade12?.year || '',
      entranceExams: academicProfile.entranceExams || [],
      preferredFields: academicProfile.preferredFields || [],
      locationPreference: academicProfile.location?.preferredCities?.[0] || 
                         academicProfile.location?.preferredStates?.[0] || 
                         academicProfile.location?.country || '',
      budget: academicProfile.budget ? 
              `${academicProfile.budget.min}-${academicProfile.budget.max} lakh` : '',
      budgetMin: academicProfile.budget?.min || 0,
      budgetMax: academicProfile.budget?.max || 0,
      currency: academicProfile.budget?.currency || 'INR'
    };
  };

  // Check for user session
  useEffect(() => {
    const savedUser = localStorage.getItem("heroUser");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // If user has completed profile, populate studentData from academicProfile
      if (userData.profileCompleted && userData.academicProfile) {
        const transformedData = transformAcademicProfile(userData.academicProfile);
        setStudentData(transformedData);
      }
    }
  }, []);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'recommendations', 'search', 'roadmap', 'career'].includes(tabParam)) {
      setActiveTab(tabParam);
      // Scroll to main app section if not already there
      setTimeout(() => {
        scrollToSection(mainAppRef);
      }, 100);
    }
  }, [searchParams]);

  // Handle scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    switch(section) {
      case 'recommendations':
        setActiveTab('recommendations');
        // Update URL
        const recUrl = new URL(window.location.href);
        recUrl.searchParams.set('tab', 'recommendations');
        window.history.replaceState({}, '', recUrl.toString());
        scrollToSection(mainAppRef);
        break;
      case 'search':
        setActiveTab('search');
        // Update URL
        const searchUrl = new URL(window.location.href);
        searchUrl.searchParams.set('tab', 'search');
        window.history.replaceState({}, '', searchUrl.toString());
        scrollToSection(mainAppRef);
        break;
      case 'career':
        setActiveTab('career');
        // Update URL
        const careerUrl = new URL(window.location.href);
        careerUrl.searchParams.set('tab', 'career');
        window.history.replaceState({}, '', careerUrl.toString());
        scrollToSection(mainAppRef);
        break;
      case 'features':
        scrollToSection(featuresRef);
        break;
      case 'stats':
        scrollToSection(statsRef);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-purple-500/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  UNISPHERE
                </h1>
                <p className="text-xs text-purple-300">Your academic journey starts here</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => handleNavClick('recommendations')}
              >
                Recommendations
              </Button>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => handleNavClick('search')}
              >
                Search
              </Button>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => handleNavClick('career')}
              >
                Career Guide
              </Button>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => handleNavClick('features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => handleNavClick('stats')}
              >
                Stats
              </Button>
              {user && (
                <Button 
                  variant="ghost" 
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
            </nav>
            <div className="flex items-center space-x-2">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                  >
                    Start Your Journey
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800/50 via-purple-800/50 to-slate-800/50 text-white py-24 relative overflow-hidden border-b border-purple-500/20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 mr-3 text-purple-400" />
            <span className="text-lg font-medium text-purple-300">AI-Powered Academic Discovery</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Perfect University
            </span>
          </h2>
          <p className="text-xl mb-8 text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Unlock your potential with personalized university recommendations based on your academic profile, 
            location preferences, budget, and career goals with our advanced AI matching algorithm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg px-8 transition-all duration-300 hover:scale-105"
              onClick={() => {
                setActiveTab("recommendations");
                // Update URL
                const url = new URL(window.location.href);
                url.searchParams.set('tab', 'recommendations');
                window.history.replaceState({}, '', url.toString());
                scrollToSection(mainAppRef);
              }}
            >
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 shadow-lg px-8 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              onClick={() => setShowDemo(true)}
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section ref={featuresRef} className="py-20 bg-slate-800/30 border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Why Choose Unisphere?
            </h3>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Our intelligent system considers multiple factors to find universities that truly match your needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-purple-300 via-purple-200 to-purple-300 border-purple-500 shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-purple-800 font-semibold">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-purple-700 leading-relaxed">
                  Advanced algorithm considers grades, location, fees, rankings, and user reviews for perfect matches
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-300 via-purple-200 to-purple-300 border-purple-500 shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-purple-800 font-semibold">Custom Roadmaps</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-purple-700 leading-relaxed">
                  Personalized step-by-step guidance with timelines, resources, and deadlines
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-300 via-purple-200 to-purple-300 border-purple-500 shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-purple-800 font-semibold">Career Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-purple-700 leading-relaxed">
                  Expert advice on emerging fields, job prospects, and industry trends
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section ref={mainAppRef} className="py-20 bg-slate-800/20">
        <div className="container mx-auto px-4">
                      <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                setActiveTab(value);
                // Update URL without page reload
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('tab', value);
                window.history.replaceState({}, '', newUrl.toString());
              }} 
              className="w-full"
            >
            <div className="flex justify-center mb-12">
              <TabsList className="grid grid-cols-5 w-full max-w-3xl h-14 bg-purple-100/20 p-1 border border-purple-500/20">
                <TabsTrigger value="profile" className="text-sm font-medium text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Your Profile</TabsTrigger>
                <TabsTrigger value="recommendations" className="text-sm font-medium text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Recommendations</TabsTrigger>
                <TabsTrigger value="search" className="text-sm font-medium text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Search</TabsTrigger>
                <TabsTrigger value="roadmap" className="text-sm font-medium text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Roadmap</TabsTrigger>
                <TabsTrigger value="career" className="text-sm font-medium text-purple-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Career Guide</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="profile" className="mt-8">
              {user && user.profileCompleted && !isEditingProfile ? (
                <div className="max-w-4xl mx-auto">
                  <Card className="bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-slate-800/90 border-purple-500/20 shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-b border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                              Your Academic Profile
                            </CardTitle>
                            <CardDescription className="text-purple-200">
                              Review your academic information and preferences
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => setIsEditingProfile(true)}
                            variant="outline"
                            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                          >
                            Edit Profile
                          </Button>
                          <Button
                            onClick={() => {
                              setActiveTab("recommendations");
                              scrollToSection(mainAppRef);
                            }}
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                          >
                            View Recommendations
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-4">Basic Information</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-purple-200">Name:</span>
                                <span className="text-white font-medium">{studentData?.name || user?.name || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-200">Board:</span>
                                <span className="text-white font-medium">{studentData?.board || user?.academicProfile?.grade12?.board || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-200">Stream:</span>
                                <span className="text-white font-medium">{studentData?.stream || user?.academicProfile?.grade12?.stream || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-200">Percentage/CGPA:</span>
                                <span className="text-white font-medium">{studentData?.percentage || user?.academicProfile?.grade12?.percentage || "Not specified"}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-4">Preferences</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-purple-200">Preferred Field:</span>
                                <span className="text-white font-medium">{studentData?.preferredField || user?.academicProfile?.preferredFields?.[0] || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-200">Location:</span>
                                <span className="text-white font-medium">{studentData?.locationPreference || user?.academicProfile?.location?.preferredCities?.[0] || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-200">Budget:</span>
                                <span className="text-white font-medium">{studentData?.budget || (user?.academicProfile?.budget ? `${user.academicProfile.budget.min}-${user.academicProfile.budget.max} lakh` : "Not specified")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-4">Subject Scores</h3>
                            <div className="space-y-3">
                              {studentData?.subjects && Object.entries(studentData.subjects).map(([subject, score]) => (
                                score && (
                                  <div key={subject} className="flex justify-between">
                                    <span className="text-purple-200 capitalize">{subject}:</span>
                                    <span className="text-white font-medium">{String(score)}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                          
                          {studentData?.entranceExams && (
                            <div>
                              <h3 className="text-lg font-semibold text-purple-300 mb-4">Entrance Exams</h3>
                              <div className="text-white">{studentData.entranceExams}</div>
                            </div>
                          )}
                          
                          {studentData?.additionalInfo && (
                            <div>
                              <h3 className="text-lg font-semibold text-purple-300 mb-4">Additional Information</h3>
                              <div className="text-white">{studentData.additionalInfo}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <StudentProfileForm 
                  onSubmit={(data) => {
                    setStudentData(data);
                    setIsEditingProfile(false);
                    // Save to localStorage for persistence
                    localStorage.setItem("heroProfile", JSON.stringify(data));
                  }}
                  isEditMode={isEditingProfile}
                  initialData={studentData || (user?.academicProfile ? transformAcademicProfile(user.academicProfile) : null)}
                  onCancel={() => setIsEditingProfile(false)}
                />
              )}
            </TabsContent>
            
                          <TabsContent value="recommendations" className="mt-8">
                <UniversityRecommendations 
                  studentData={studentData} 
                  onTabChange={(tab, params) => {
                    setActiveTab(tab);
                    // Update URL with all parameters using setSearchParams
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set('tab', tab);
                    if (params) {
                      Object.entries(params).forEach(([key, value]) => {
                        newSearchParams.set(key, value);
                      });
                    }
                    setSearchParams(newSearchParams);
                    // Scroll to main app section
                    setTimeout(() => {
                      scrollToSection(mainAppRef);
                    }, 100);
                  }}
                />
              </TabsContent>
            
            <TabsContent value="search" className="mt-8">
              <UniversitySearch />
            </TabsContent>
            
            <TabsContent value="roadmap" className="mt-8">
              <RoadmapGenerator studentData={studentData} />
            </TabsContent>
            
            <TabsContent value="career" className="mt-8">
              <CareerCounseling />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-slate-800/40 border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">5000+</div>
              <div className="text-purple-200">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">25000+</div>
              <div className="text-purple-200">Students Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-purple-200">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-purple-200">Career Paths</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800/80 border-t border-purple-500/20 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">UNISPHERE</span>
                  <p className="text-xs text-purple-300">Your academic journey starts here</p>
                </div>
              </div>
              <p className="text-purple-200 leading-relaxed">
                Empowering students to make informed decisions about their educational journey with AI-powered insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Universities</h4>
              <ul className="space-y-3 text-white/80">
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTab('recommendations');
                    scrollToSection(mainAppRef);
                  }}
                >
                  Top Ranked
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTab('recommendations');
                    scrollToSection(mainAppRef);
                  }}
                >
                  By Location
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTab('recommendations');
                    scrollToSection(mainAppRef);
                  }}
                >
                  By Field
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTab('recommendations');
                    scrollToSection(mainAppRef);
                  }}
                >
                  Budget Friendly
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-white/80">
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTab('career');
                    scrollToSection(mainAppRef);
                  }}
                >
                  Career Guides
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveTab('roadmap');
                    scrollToSection(mainAppRef);
                  }}
                >
                  Admission Tips
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => setShowDemo(true)}
                >
                  Success Stories
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => scrollToSection(featuresRef)}
                >
                  Features
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-white/80">
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => setShowDemo(true)}
                >
                  Help Center
                </li>
                <li 
                  className="hover:text-white cursor-pointer transition-colors"
                  onClick={() => scrollToSection(statsRef)}
                >
                  About Us
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
                            <p>© 2024 Unisphere. All rights reserved. Made with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-brand-primary" />
              UniSphere Demo
            </DialogTitle>
            <DialogDescription>
              Watch how UniSphere helps students find their perfect university match
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold text-brand-primary mb-3">🎯 Step 1: Profile Creation</h4>
              <p className="text-brand-muted mb-4">
                Students enter their academic details, preferences, and career goals. Our AI analyzes this information to understand their unique profile.
              </p>
              <div className="bg-white rounded p-4 border">
                <div className="space-y-2">
                  <div className="h-4 bg-brand-primary/20 rounded w-3/4"></div>
                  <div className="h-4 bg-brand-primary/10 rounded w-1/2"></div>
                  <div className="h-4 bg-brand-primary/20 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold text-brand-primary mb-3">🎓 Step 2: Smart Matching</h4>
              <p className="text-brand-muted mb-4">
                Our algorithm matches students with universities based on multiple factors including academic fit, location preferences, budget, and career alignment.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded p-3 border text-center">
                  <div className="w-8 h-8 bg-gradient-brand rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium">Top Match</div>
                </div>
                <div className="bg-white rounded p-3 border text-center">
                  <div className="w-8 h-8 bg-gradient-success rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium">Safety</div>
                </div>
                <div className="bg-white rounded p-3 border text-center">
                  <div className="w-8 h-8 bg-brand-accent rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium">Reach</div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold text-brand-primary mb-3">🗺️ Step 3: Personalized Roadmap</h4>
              <p className="text-brand-muted mb-4">
                Get a detailed, step-by-step roadmap with timelines, deadlines, and resources to help you reach your target universities.
              </p>
              <div className="bg-white rounded p-4 border">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs">1</div>
                    <div className="flex-1">
                      <div className="h-3 bg-brand-primary/20 rounded w-full mb-1"></div>
                      <div className="h-2 bg-brand-primary/10 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs">2</div>
                    <div className="flex-1">
                      <div className="h-3 bg-brand-primary/20 rounded w-full mb-1"></div>
                      <div className="h-2 bg-brand-primary/10 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold text-brand-primary mb-3">💡 Step 4: Career Guidance</h4>
              <p className="text-brand-muted mb-4">
                Access AI-powered career counseling, industry insights, and personalized advice to make informed decisions about your future.
              </p>
              <div className="bg-white rounded p-4 border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center text-white text-sm">AI</div>
                  <div className="flex-1">
                    <div className="h-3 bg-brand-primary/20 rounded w-full mb-2"></div>
                    <div className="h-3 bg-brand-primary/10 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg transition-all duration-300 hover:scale-110 z-50"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Index;