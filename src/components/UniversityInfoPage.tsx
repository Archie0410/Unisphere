import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Star, DollarSign, Calendar, ExternalLink, Users, Award, 
  TrendingUp, Shield, GraduationCap, Heart, Share2, ArrowLeft,
  CheckCircle, Info, Globe, Phone, Mail
} from "lucide-react";
import { getUniversityById } from "@/data/universities";

interface UniversityInfoPageProps {
  onBack?: () => void;
}

const UniversityInfoPage = ({ onBack }: UniversityInfoPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const universityId = parseInt(id || "1");
  const university = getUniversityById(universityId);

  // If university not found, show error
  if (!university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">University Not Found</h2>
          <p className="text-purple-200 mb-6">The university you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-violet-800/50 shadow-sm border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/?tab=recommendations')} 
                className="flex items-center gap-2 text-purple-200 hover:text-white hover:bg-purple-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Recommendations
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{university.name}</h1>
                <p className="text-purple-200 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {university.location}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 font-semibold ${isFavorite ? 'text-red-400 border-red-400 bg-red-50' : 'text-white border-purple-300 bg-purple-600/20 hover:bg-purple-500/30'}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-white border-purple-300 bg-purple-600/20 hover:bg-purple-500/30 font-semibold">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-purple-300 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-purple-700">Rating</p>
                  <p className="text-lg font-semibold text-purple-800">{university.rating}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-300 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-700">NIRF Rank</p>
                  <p className="text-lg font-semibold text-purple-800">#{university.nationalRank}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-300 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-purple-700">Annual Fees</p>
                  <p className="text-lg font-semibold text-purple-800">{formatCurrency(university.tuitionFee)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-300 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-700">Placement Rate</p>
                  <p className="text-lg font-semibold text-purple-800">{university.placement_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-purple-300">
            <TabsTrigger value="overview" className="text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="programs" className="text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Programs</TabsTrigger>
            <TabsTrigger value="admission" className="text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Admission</TabsTrigger>
            <TabsTrigger value="facilities" className="text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Facilities</TabsTrigger>
            <TabsTrigger value="contact" className="text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white border-purple-300 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-purple-800">About {university.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-purple-700 leading-relaxed mb-4">
                      {university.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-purple-700">Established</p>
                        <p className="font-semibold text-purple-800">{university.establishedYear}</p>
                      </div>
                      <div>
                        <p className="text-purple-700">Type</p>
                        <p className="font-semibold text-purple-800">{university.type}</p>
                      </div>
                      <div>
                        <p className="text-purple-700">Acceptance Rate</p>
                        <p className="font-semibold text-purple-800">{university.acceptance}</p>
                      </div>
                      <div>
                        <p className="text-purple-700">Average Package</p>
                        <p className="font-semibold text-purple-800">{university.avgPackage}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-800">Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {university.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-600 text-white">{highlight}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Statistics */}
                <Card className="bg-white border-purple-300 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-purple-800">University Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-800">{university.totalStudents.toLocaleString()}</div>
                        <div className="text-sm text-purple-700">Total Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-800">{university.internationalStudents.toLocaleString()}</div>
                        <div className="text-sm text-purple-700">International Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-800">{university.studentFacultyRatio}:1</div>
                        <div className="text-sm text-purple-700">Student-Faculty Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-800">{university.graduationRate}%</div>
                        <div className="text-sm text-purple-700">Graduation Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white border-purple-300 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-purple-800">Quick Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Deadline</span>
                      <span className="font-semibold text-purple-800">{university.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Programs</span>
                      <span className="font-semibold text-purple-800">{university.programs.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-6">
            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Available Programs</CardTitle>
                <CardDescription className="text-purple-700">
                  Explore the programs offered by {university.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {university.programs.map((program, index) => (
                    <div key={index} className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">{program}</h4>
                      </div>
                      <p className="text-sm text-purple-700">
                        Duration: 4 years (B.Tech)
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Entrance Exams */}
            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Entrance Examinations</CardTitle>
                <CardDescription className="text-purple-700">
                  Required entrance exams for admission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {university.entranceExams.map((exam, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-purple-200 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">{exam}</h4>
                        <p className="text-sm text-purple-700">Required for admission</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admission Tab */}
          <TabsContent value="admission" className="space-y-6">
            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Admission Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {university.admission_process.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-purple-800">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {university.scholarships.map((scholarship, index) => (
                    <div key={index} className="p-3 border border-purple-300 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-purple-800">{scholarship}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Campus Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {university.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-800">{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-800">Website</p>
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {university.website}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-purple-800">Phone</p>
                    <p className="text-purple-700">{university.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-purple-800">Email</p>
                    <p className="text-purple-700">{university.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-purple-800">Address</p>
                    <p className="text-sm text-purple-700">{university.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-300 shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-800">Apply Now</CardTitle>
                <CardDescription className="text-purple-700">
                  Ready to join {university.name}? Start your application process today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700" size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Official Website
                  </Button>
                  <Button variant="outline" className="flex-1 border-purple-500/30 text-purple-700 hover:bg-purple-500/20" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Check Deadlines
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-purple-700">
                    Application deadline: <span className="font-semibold text-purple-800">{university.deadline}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityInfoPage;
