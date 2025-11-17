import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, TrendingUp, Briefcase, Brain, Search, Star, Zap, DollarSign, Users, Award, Loader2, Send, RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CareerCounseling = () => {
  const [question, setQuestion] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [processingField, setProcessingField] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

  // Debug environment variables
  console.log('Environment check:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_BASE_URL,
    mode: import.meta.env.MODE
  });

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  // Check if API is reachable
  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/career/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const isConnected = response.ok;
      setApiStatus(isConnected ? "connected" : "disconnected");
      return isConnected;
    } catch (error) {
      console.error('API connection check failed:', error);
      setApiStatus("disconnected");
      return false;
    }
  };

  const careerFields = [
    {
      name: "Artificial Intelligence & Machine Learning",
      description: "Design intelligent systems and algorithms that learn from data",
      growth: "Very High",
      avgSalary: "₹12-35 LPA",
      skills: ["Python/R", "Machine Learning", "Deep Learning", "Statistics"],
      trending: true,
      demandScore: 98,
      futureScope: "Exponential growth expected in next decade",
      topCompanies: ["Google", "Microsoft", "OpenAI", "Tesla"]
    },
    {
      name: "Data Science & Analytics",
      description: "Extract insights from complex data to drive business decisions",
      growth: "Very High",
      avgSalary: "₹10-30 LPA",
      skills: ["Statistics", "Python/R", "SQL", "Visualization"],
      trending: true,
      demandScore: 95,
      futureScope: "Critical role in digital transformation",
      topCompanies: ["Netflix", "Uber", "Amazon", "Flipkart"]
    },
    {
      name: "Cybersecurity",
      description: "Protect digital assets and systems from cyber threats",
      growth: "Very High",
      avgSalary: "₹8-25 LPA",
      skills: ["Network Security", "Ethical Hacking", "Risk Assessment"],
      trending: true,
      demandScore: 92,
      futureScope: "Essential as digital dependence increases",
      topCompanies: ["Palo Alto Networks", "CrowdStrike", "IBM", "Cisco"]
    },
    {
      name: "Cloud Computing",
      description: "Design and manage cloud-based infrastructure and services",
      growth: "High",
      avgSalary: "₹9-28 LPA",
      skills: ["AWS/Azure", "DevOps", "Containerization", "Microservices"],
      trending: true,
      demandScore: 90,
      futureScope: "Backbone of modern IT infrastructure",
      topCompanies: ["AWS", "Microsoft", "Google Cloud", "Salesforce"]
    },
    {
      name: "Digital Marketing",
      description: "Promote products and services through digital channels",
      growth: "High",
      avgSalary: "₹4-15 LPA",
      skills: ["SEO/SEM", "Social Media", "Content Marketing", "Analytics"],
      trending: true,
      demandScore: 85,
      futureScope: "Growing with digital economy expansion",
      topCompanies: ["Google", "Facebook", "HubSpot", "Adobe"]
    },
    {
      name: "Biotechnology",
      description: "Apply biological processes to develop innovative solutions",
      growth: "High",
      avgSalary: "₹6-20 LPA",
      skills: ["Molecular Biology", "Genetics", "Bioinformatics", "Research"],
      trending: true,
      demandScore: 78,
      futureScope: "Revolutionary potential in healthcare and agriculture",
      topCompanies: ["Biocon", "Genentech", "Amgen", "Gilead"]
    }
  ];

  const faqs = [
    {
      question: "How do I choose between passion and job security?",
      answer: "The ideal approach is finding the intersection of your interests, skills, and market demand. Research the job prospects in your field of passion and consider how you can make it financially sustainable. Sometimes pursuing passion as a side project while maintaining a stable career works well initially."
    },
    {
      question: "Which skills will be most valuable in the future job market?",
      answer: "Critical thinking, emotional intelligence, and adaptability are universally valuable. Technical skills vary by field, but data literacy, digital fluency, and continuous learning mindset are essential across industries. Soft skills like communication and collaboration become more important as AI handles routine tasks."
    },
    {
      question: "How important are entrance exam scores for career success?",
      answer: "While entrance exams open doors to prestigious institutions, they're just the beginning. Your skills, projects, internships, and continuous learning matter more for long-term career success. Many successful professionals come from diverse educational backgrounds."
    },
    {
      question: "Should I focus on technical skills or soft skills?",
      answer: "Both are crucial, but the balance depends on your field. Technical skills get you in the door, while soft skills help you advance and lead. Focus on technical skills early in your career, then develop leadership and communication skills as you progress."
    },
    {
      question: "How can I stay relevant in a rapidly changing job market?",
      answer: "Embrace lifelong learning, stay updated with industry trends, build a strong network, and develop transferable skills. Be adaptable and willing to pivot when necessary. Continuous upskilling and staying curious about new technologies will keep you competitive."
    }
  ];

  const quickQuestions = [
    "Which engineering branch has the best future scope?",
    "What are the highest paying tech jobs?",
    "How to transition from non-tech to tech?",
    "Which skills are most in demand?",
    "What's the future of remote work?",
    "How important is AI in my career?"
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a question before asking AI.",
        variant: "destructive",
      });
      return;
    }

    if (question.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Please enter a more detailed question (at least 3 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setShowAnswer(false);

    try {
      console.log('Making API call to:', `${API_BASE_URL}/career/chat`);

      const response = await fetch(`${API_BASE_URL}/career/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question.trim(),
          context: "career guidance"
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        const responseText = data.data?.response || data.response || "No response received";
        console.log('Setting AI response:', responseText);
        console.log('Response data structure:', data);
        setAiResponse(responseText);
        setShowAnswer(true);

        // Add to chat history
        setChatHistory(prev => [...prev, {
          question: question.trim(),
          answer: responseText
        }]);

        toast({
          title: "AI Response Generated",
          description: "Your career question has been answered!",
        });
      } else {
        console.error('API returned success=false:', data);
        toast({
          title: "API Error",
          description: data.message || "The AI service returned an error. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error asking question:', error);

      let errorMessage = "Unable to connect to AI service. Please try again.";

      if (error.message.includes('404')) {
        errorMessage = "Career counseling service is not available. Please check if the backend server is running on the correct port.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes('CORS')) {
        errorMessage = "CORS error. Please check if the backend allows requests from this frontend.";
      }

      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const handleResetChat = () => {
    setChatHistory([]);
    setQuestion("");
    setShowAnswer(false);
    setAiResponse("");
    toast({
      title: "Chat Reset",
      description: "Chat history has been cleared.",
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">Career Quest Center</h2>
        <p className="text-purple-200 text-lg max-w-2xl mx-auto">
          Get expert insights on emerging careers, industry trends, and future opportunities
        </p>
      </div>

      {/* Ask AI Counselor */}
      <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-200/30 to-purple-300/40 border-b border-purple-300/30">
                  <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-purple-800 font-semibold">AI Career Counselor</CardTitle>
            <CardDescription className="text-purple-700">
              Get instant, personalized answers to your career questions
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === "connected" ? "bg-green-500" : 
              apiStatus === "disconnected" ? "bg-red-500" : "bg-yellow-500"
            }`}></div>
            <span className="text-xs text-purple-700">
              {apiStatus === "connected" ? "Connected" : 
               apiStatus === "disconnected" ? "Offline" : "Checking..."}
            </span>
          </div>
        </div>
        </CardHeader>
        <CardContent className="p-6 bg-purple-100/20">
          {/* Quick Questions */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-purple-800 mb-3">Quick Questions:</h4>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestion(q)}
                  className="text-xs h-8 border-purple-400/40 text-purple-700 hover:bg-purple-300/30 bg-white/60"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Which engineering branch has the best future scope?"
              className="flex-1 h-12 border-purple-400/40 bg-white/70 text-purple-800 placeholder:text-purple-600/70 focus:bg-white transition-colors"
              disabled={isLoading}
            />
            <Button 
              onClick={handleAskQuestion}
              className="h-12 px-8 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border-0"
              disabled={!question.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Thinking...' : 'Ask AI'}
            </Button>
            <Button 
              onClick={handleResetChat}
              variant="outline"
              className="h-12 px-4 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
              disabled={isLoading}
              title="Reset Chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {showAnswer && aiResponse && (
            <div className="mt-6 p-6 bg-purple-200/30 rounded-lg border border-purple-400/40">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    AI Career Counselor Response:
                  </h4>
                  <div className="text-purple-700 leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-purple-800 mb-3">Chat History:</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="p-3 bg-purple-200/30 rounded-lg border border-purple-400/40">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-800 mb-1">
                          {chat.question}
                        </p>
                        <p className="text-xs text-purple-700">
                          {chat.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Career Fields */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Trending Career Fields</h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {careerFields.map((field, index) => (
            <Card key={index} className={`bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl hover:shadow-purple-400/30 transition-all duration-300 overflow-hidden group cursor-pointer ${
              processingField === field.name ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
            }`}>
              <CardHeader className="bg-gradient-to-r from-purple-200/30 to-purple-300/40 border-b border-purple-300/30">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-purple-800 mb-2 flex items-center font-semibold">
                      {field.name}
                      {field.trending && (
                        <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      {processingField === field.name && (
                        <Badge className="ml-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-purple-700 leading-relaxed">
                      {field.description}
                    </CardDescription>
                  </div>
                  <div className="text-center ml-4">
                    <div className="text-2xl font-bold text-purple-800">{field.demandScore}</div>
                    <div className="text-xs text-purple-700">Demand Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 bg-purple-100/20">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-800">Growth Rate:</span>
                      <Badge variant={field.growth === "Very High" ? "default" : "outline"} className="text-xs bg-purple-600 text-white">
                        {field.growth}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-800">Avg Salary:</span>
                      <span className="text-sm font-bold text-purple-800">{field.avgSalary}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-purple-800 block mb-2">Top Companies:</span>
                      <div className="flex flex-wrap gap-1">
                        {field.topCompanies.slice(0, 2).map((company, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-purple-400/40 text-purple-700 bg-white/60">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-purple-800 block mb-2">Key Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {field.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-purple-400/40 text-purple-700 bg-white/60">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-200/30 p-3 rounded-lg mb-4 border border-purple-400/40">
                  <div className="flex items-start space-x-2">
                    <Award className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-purple-800">Future Scope:</span>
                      <p className="text-xs text-purple-700 mt-1">{field.futureScope}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 bg-purple-200/30 border-t border-purple-300/30">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors border-purple-400/40 text-purple-700 hover:bg-purple-300/30 bg-white/60"
                  onClick={async () => {
                    setIsLoading(true);
                    setProcessingField(field.name);
                    try {
                      console.log('Getting AI insights for:', field.name);
                      
                      const response = await fetch(`${API_BASE_URL}/career/insights`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          field: field.name
                        })
                      });

                      console.log('Insights response status:', response.status);

                      if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Insights response error:', errorText);
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                      }

                      const data = await response.json();
                      console.log('Insights response data:', data);
                      
                      if (data.success && data.data?.insights) {
                        // Set the AI response with the insights
                        setAiResponse(data.data.insights);
                        setShowAnswer(true);
                        
                        // Add to chat history
                        setChatHistory(prev => [...prev, {
                          question: `Tell me about ${field.name}`,
                          answer: data.data.insights
                        }]);

                        toast({
                          title: "AI Insights Generated",
                          description: `Detailed insights for ${field.name} have been provided! Check the AI counselor response above.`,
                        });
                      } else {
                        // Fallback: use the existing chat functionality
                        const fallbackQuestion = `Tell me more about ${field.name} career opportunities, required skills, and future prospects.`;
                        setQuestion(fallbackQuestion);
                        
                        // Use a timeout to ensure the question is set before calling handleAskQuestion
                        setTimeout(() => {
                          handleAskQuestion();
                        }, 100);
                      }
                                          } catch (error) {
                        console.error('Error getting career insights:', error);
                        
                        let errorMessage = "Unable to get career insights. Using alternative method.";
                        
                        if (error.message.includes('404')) {
                          errorMessage = "Career insights service not available. Using AI chat instead.";
                        } else if (error.message.includes('500')) {
                          errorMessage = "Server error. Using AI chat as fallback.";
                        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                          errorMessage = "Network error. Using AI chat as fallback.";
                        }
                        
                        // Fallback: use the existing chat functionality
                        const fallbackQuestion = `Tell me more about ${field.name} career opportunities, required skills, and future prospects.`;
                        setQuestion(fallbackQuestion);
                        
                        // Use a timeout to ensure the question is set before calling handleAskQuestion
                        setTimeout(() => {
                          handleAskQuestion();
                        }, 100);
                        
                        toast({
                          title: "Using Alternative Method",
                          description: errorMessage,
                        });
                      } finally {
                      setIsLoading(false);
                      setProcessingField("");
                    }
                  }}
                  disabled={isLoading || processingField === field.name}
                >
                  {isLoading && processingField === field.name ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Briefcase className="h-4 w-4 mr-2" />
                  )}
                  {isLoading && processingField === field.name ? 'Getting Insights...' : 'Get AI Insights'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="bg-gradient-to-br from-purple-100/20 via-purple-200/30 to-purple-100/20 border-purple-300/30 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-200/30 to-purple-300/40 border-b border-purple-300/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-800 font-semibold">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-purple-700">
                Common questions about career planning and future job market
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-purple-100/20">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-purple-300/30">
                <AccordionTrigger className="text-left hover:text-purple-700 transition-colors text-purple-800">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-purple-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Career Assessment CTA */}
      <Card className="bg-gradient-to-br from-purple-600 to-violet-600 text-white overflow-hidden border-purple-300/30 shadow-2xl">
        <CardContent className="p-12 text-center relative">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          <div className="relative">
            <Star className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl font-bold mb-4">Discover Your Ideal Career Path</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Take our comprehensive career assessment to discover careers that match your personality, 
              interests, and skills perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="px-8 shadow-lg bg-white text-purple-600 hover:bg-white/90">
                <Users className="h-5 w-5 mr-2" />
                Start Assessment
              </Button>
              <Button variant="outline" size="lg" className="px-8 border-white/30 text-white hover:bg-white/10">
                <Award className="h-5 w-5 mr-2" />
                View Sample Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerCounseling;