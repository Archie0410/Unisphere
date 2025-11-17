import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, DollarSign, Calendar, ExternalLink, Users, Award, TrendingUp, Shield, Info } from "lucide-react";
import { universityDatabase, University, getUniversitiesByMarks, getUniversitiesBySubject } from "@/data/universities";

interface UniversityRecommendationsProps {
  studentData: any;
  onTabChange?: (tab: string, params?: Record<string, string>) => void;
}

const UniversityRecommendations = ({ studentData, onTabChange }: UniversityRecommendationsProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Sophisticated matching algorithm
  const calculateUniversityMatch = (university: University, studentData: any) => {
    let score = 0;
    let maxScore = 0;

    // Academic Performance Match (40% weight)
    maxScore += 40;
    const studentPercentage = parseFloat(studentData.percentage.replace('%', '').replace('CGPA', '') || '0');
    
    if (university.acceptance) {
      const acceptanceRate = parseFloat(university.acceptance.replace('%', ''));
      if (studentPercentage >= 90 && acceptanceRate <= 10) score += 40;
      else if (studentPercentage >= 80 && acceptanceRate <= 25) score += 35;
      else if (studentPercentage >= 70 && acceptanceRate <= 50) score += 30;
      else if (studentPercentage >= 60) score += 25;
      else score += 15;
    }

    // Location Match (20% weight)
    maxScore += 20;
    if (studentData.locationPreference) {
      const preferredLocations = studentData.locationPreference.toLowerCase().split(',').map((loc: string) => loc.trim());
      const universityLocation = university.location.toLowerCase();
      const universityState = university.state?.toLowerCase() || '';
      const universityCity = university.city?.toLowerCase() || '';
      
      const locationMatch = preferredLocations.some((pref: string) => 
        universityLocation.includes(pref) || 
        universityState.includes(pref) || 
        universityCity.includes(pref)
      );
      
      if (locationMatch) score += 20;
      else score += 5; // Small score for non-matching locations
    } else {
      score += 10; // Neutral score if no preference
    }

    // Budget Match (20% weight)
    maxScore += 20;
    if (studentData.budget) {
      const budgetRanges = {
        'under-2-lakh': 200000,
        '2-5-lakh': 500000,
        '5-10-lakh': 1000000,
        '10-20-lakh': 2000000,
        'above-20-lakh': Infinity
      };
      
      const maxBudget = budgetRanges[studentData.budget as keyof typeof budgetRanges] || Infinity;
      if (university.tuitionFee <= maxBudget) {
        score += 20;
      } else if (university.tuitionFee <= maxBudget * 1.2) {
        score += 10; // Slightly over budget
      } else {
        score += 2; // Way over budget
      }
    } else {
      score += 10; // Neutral if no budget specified
    }

    // Field of Study Match (10% weight)
    maxScore += 10;
    if (studentData.preferredField && university.specializations) {
      const fieldMap: { [key: string]: string[] } = {
        'engineering': ['engineering', 'technology'],
        'medicine': ['medicine', 'healthcare'],
        'business': ['business', 'management', 'commerce'],
        'computer-science': ['engineering', 'technology'],
        'science': ['science', 'research'],
        'arts': ['liberal-arts', 'humanities'],
        'law': ['law'],
        'design': ['design', 'arts']
      };
      
      const studentFields = fieldMap[studentData.preferredField] || [studentData.preferredField];
      const hasMatch = university.specializations.some((spec: string) => 
        studentFields.some(field => spec.includes(field) || field.includes(spec))
      );
      
      if (hasMatch) score += 10;
      else score += 3;
    } else {
      score += 5;
    }

    // University Quality (10% weight) - Based on ranking and reviews
    maxScore += 10;
    const rankingScore = Math.max(0, 10 - (university.nationalRank / 10));
    const reviewScore = (university.userReviews / 5) * 5;
    score += (rankingScore + reviewScore) / 2;

    return Math.round((score / maxScore) * 100);
  };

  const rankedUniversities = useMemo(() => {
    if (!studentData) return [];
    
    // Get student's percentage as number
    const studentPercentage = parseFloat(studentData.percentage.replace('%', '').replace('CGPA', '') || '0');
    
    // Filter universities based on marks and subject
    let eligibleUniversities = universityDatabase;
    
    // Filter by marks range
    if (studentPercentage > 0) {
      eligibleUniversities = getUniversitiesByMarks(studentPercentage);
    }
    
    // Filter by subject/stream if available
    if (studentData.stream) {
      const subjectUniversities = getUniversitiesBySubject(studentData.stream);
      // Combine both filters (intersection)
      eligibleUniversities = eligibleUniversities.filter(uni => 
        subjectUniversities.some(subjectUni => subjectUni.id === uni.id)
      );
    }
    
    // If no universities found with strict filtering, use all universities
    if (eligibleUniversities.length === 0) {
      eligibleUniversities = universityDatabase;
    }
    
    return eligibleUniversities
      .map(university => ({
        ...university,
        matchScore: calculateUniversityMatch(university, studentData)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [studentData]);

  const topRecommendations = rankedUniversities.slice(0, 4);
  const backupOptions = rankedUniversities.slice(4, 7);

  if (!studentData) {
    return (
      <Card className="text-center p-12 shadow-md border-0">
        <CardContent>
          <Users className="h-20 w-20 mx-auto text-brand-muted mb-6" />
          <h3 className="text-2xl font-semibold text-brand-primary mb-4">Create Your Profile First</h3>
          <p className="text-brand-muted text-lg leading-relaxed max-w-md mx-auto">
            Please fill out your academic profile to get personalized university recommendations 
            based on our advanced matching algorithm.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Your University Matches</h2>
        <div className="flex items-center justify-center space-x-6 text-purple-200">
          <span className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-purple-300" />
            {studentData.stream} • {studentData.percentage}%
          </span>
          {studentData.locationPreference && (
            <span className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-300" />
              {studentData.locationPreference}
            </span>
          )}
          {studentData.budget && (
            <span className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-purple-300" />
              {studentData.budget.replace('-', ' - ₹').replace('lakh', ' Lakh')}
            </span>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <Card className="bg-gradient-subtle border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-brand-primary">Smart Matching Algorithm</h3>
          </div>
          <p className="text-brand-muted leading-relaxed">
            Our AI considers <strong>academic performance</strong> (40%), <strong>location preferences</strong> (20%), 
            <strong>budget compatibility</strong> (20%), <strong>field alignment</strong> (10%), and 
            <strong>university quality rankings</strong> (10%) to find your perfect matches.
          </p>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Top Recommendations</h3>
          <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2">
            {topRecommendations.length} Matches Found
          </Badge>
        </div>
        
        <div className="grid gap-6">
          {topRecommendations.map((university, index) => (
            <Card key={university.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
              <div className="bg-gradient-subtle p-1">
                <div className="bg-white rounded-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <CardTitle className="text-xl text-brand-primary mr-3">{university.name}</CardTitle>
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              Best Match
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-brand-muted">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {university.location}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            {university.rating} ({university.totalReviews} reviews)
                          </div>
                          <Badge variant={university.type === "Government" ? "default" : "outline"}>
                            {university.type}
                          </Badge>
                          <Badge variant="outline">
                            NIRF #{university.nirf_rank}
                          </Badge>
                        </div>
                      </div>
                                              <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                          {university.matchScore}%
                        </div>
                        <div className="text-xs text-brand-muted">Match Score</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm font-medium">
                            <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                            Annual Fees
                          </span>
                          <span className="font-semibold">₹{(university.tuitionFee / 100000).toFixed(1)} Lakh</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm font-medium">
                            <Calendar className="h-4 w-4 mr-2 text-brand-accent" />
                            Deadline
                          </span>
                          <span className="text-sm">{university.deadline}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Acceptance Rate</span>
                          <span className="text-sm font-semibold text-brand-accent">{university.acceptance}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm font-medium">
                            <TrendingUp className="h-4 w-4 mr-2 text-brand-accent" />
                            Avg Package
                          </span>
                          <span className="font-semibold">{university.avgPackage}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Placement Rate</span>
                          <span className="text-sm font-semibold text-brand-accent">{university.placement_rate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">User Rating</span>
                          <span className="text-sm font-semibold">{university.userReviews}/5.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-3 text-brand-primary">Popular Programs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {university.programs.slice(0, 4).map((program, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                        {university.programs.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{university.programs.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-brand-primary">Key Highlights:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {university.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center text-sm text-brand-muted">
                            <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mr-2"></div>
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                        onClick={() => navigate(`/university/${university.id}`)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-purple-500/30 text-purple-600 hover:bg-purple-500/20 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          // Navigate to roadmap tab with university data
                          if (onTabChange) {
                            onTabChange('roadmap', { university: university.id.toString() });
                          } else {
                            // Fallback to URL approach
                            const url = new URL(window.location.href);
                            url.searchParams.set('tab', 'roadmap');
                            url.searchParams.set('university', university.id.toString());
                            window.history.replaceState({}, '', url.toString());
                            window.location.reload();
                          }
                        }}
                      >
                        Create Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Backup Options */}
      {backupOptions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-purple-400 mr-3">Backup Options</h3>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">Safety Schools</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {backupOptions.map((university) => (
              <Card key={university.id} className="shadow-sm hover:shadow-md transition-shadow border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400">{university.name.split(',')[0]}</CardTitle>
                  <div className="flex items-center text-sm text-purple-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    {university.city}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Match Score</span>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        {university.matchScore}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Annual Fees</span>
                      <span className="text-sm font-semibold">
                        ₹{(university.tuitionFee / 100000).toFixed(1)} Lakh
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">User Rating</span>
                      <span className="text-sm">{university.userReviews}/5.0</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4 border-purple-500/30 text-purple-600 hover:bg-purple-500/20 transition-all duration-300 hover:scale-105"
                    onClick={() => navigate(`/university/${university.id}`)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityRecommendations;