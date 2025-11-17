import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Shield, 
  Star, 
  Target, 
  Rocket, 
  Crown,
  GraduationCap,
  MapPin,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Heart,
  Brain,
  Sword,
  Shield as ShieldIcon,
  LogOut,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowRight,
  Trophy,
  Medal,
  Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeroDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
}

const HeroDashboard = ({ user, onLogout, onNavigateToSection }: HeroDashboardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const powerLevelColors = {
    Beginner: "text-yellow-500",
    Intermediate: "text-orange-500", 
    Advanced: "text-purple-500",
    Legendary: "text-red-500"
  };

  const powerLevelIcons = {
    Beginner: Star,
    Intermediate: Target,
    Advanced: Crown,
    Legendary: Rocket
  };

  const PowerLevelIcon = powerLevelIcons[user.powerLevel as keyof typeof powerLevelIcons];

  const quickActions = [
    {
      title: "University Explorer",
      description: "Explore universities",
      icon: GraduationCap,
      color: "from-purple-500 to-violet-500",
      action: () => onNavigateToSection("universities")
    },
    {
      title: "Career Quest",
      description: "Get career guidance",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      action: () => onNavigateToSection("career")
    },
    {
      title: "Roadmap Adventure",
      description: "Create your path",
      icon: MapPin,
      color: "from-purple-500 to-indigo-500",
      action: () => onNavigateToSection("roadmap")
    },
    {
      title: "Edit Profile",
      description: "Update your profile",
      icon: Settings,
      color: "from-purple-500 to-violet-500",
      action: () => onNavigateToSection("profile")
    }
  ];

  const achievements = [
    { name: "First Login", icon: Star, color: "text-yellow-500", unlocked: true },
    { name: "Profile Created", icon: Shield, color: "text-blue-500", unlocked: true },
    { name: "University Explorer", icon: GraduationCap, color: "text-green-500", unlocked: false },
    { name: "Career Counselor", icon: Brain, color: "text-purple-500", unlocked: false },
    { name: "Roadmap Master", icon: MapPin, color: "text-orange-500", unlocked: false },
    { name: "Legendary Hero", icon: Crown, color: "text-red-500", unlocked: false }
  ];

  const stats = [
    {
      title: "Universities Explored",
      value: user.stats.universitiesExplored,
      icon: GraduationCap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Roadmaps Created",
      value: user.stats.roadmapsCreated,
      icon: MapPin,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Career Questions",
      value: user.stats.careerQuestions,
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Favorites Saved",
      value: user.stats.favorites,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ];

  const recentActivity = [
    {
      action: "Logged in",
      time: "2 minutes ago",
      icon: Zap,
      color: "text-blue-500"
    },
    {
      action: "Profile created",
      time: "Just now",
      icon: Shield,
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  UNISPHERE
                </h1>
                <p className="text-sm text-purple-300">Your academic journey starts here</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200">
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                className="text-purple-300 hover:text-purple-200"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Profile Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-slate-800/90 border-purple-500/20 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-purple-500/30">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{user.superheroName}</h2>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      <PowerLevelIcon className="w-3 h-3 mr-1" />
                      {user.powerLevel}
                    </Badge>
                  </div>
                  
                  <p className="text-blue-300 mb-3">Civilian Identity: {user.name}</p>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-blue-200">Level {user.stats.universitiesExplored + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-blue-200">{user.achievements.length} Achievements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-blue-200">Active Hero</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-400" />
            Quick Missions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index}
                  className="bg-slate-800/50 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{action.title}</h4>
                    <p className="text-sm text-blue-300">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Hero Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="p-4 rounded-lg bg-slate-700/30 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                          <span className="text-2xl font-bold text-white">{stat.value}</span>
                        </div>
                        <p className="text-sm text-blue-300">{stat.title}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border transition-all ${
                          achievement.unlocked 
                            ? "border-blue-400 bg-blue-500/10" 
                            : "border-slate-600 bg-slate-700/30 opacity-50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${achievement.color}`} />
                          <span className={`text-sm ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                            {achievement.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.action}</p>
                          <p className="text-xs text-blue-300">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Power Level Progress */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-blue-400" />
                  Power Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-300">Current Level</span>
                    <span className="text-sm font-semibold text-white">{user.powerLevel}</span>
                  </div>
                  <Progress value={25} className="h-2 bg-slate-700" />
                  <div className="text-center">
                    <p className="text-xs text-blue-300">25% to next level</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hero Tips */}
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Hero Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-200">
                      💡 Explore universities to unlock new achievements and level up your hero status!
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-purple-200">
                      🧠 Use the Career Quest feature to get personalized guidance from our AI mentor!
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-green-200">
                      🗺️ Create roadmaps to track your journey to your dream university!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
