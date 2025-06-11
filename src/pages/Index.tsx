
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, Zap, Trophy, Users, BarChart3, TrendingUp, Clock, Star } from "lucide-react";
import { toast } from "sonner";

interface ManifestData {
  playerName: string;
  handicap: string;
  experience: string;
  goals: string;
  weaknesses: string;
  strengths: string;
  timeframe: string;
  budget: string;
  preferredStyle: string;
}

interface GeneratedManifest {
  title: string;
  summary: string;
  objectives: string[];
  actionPlan: {
    category: string;
    actions: string[];
    timeline: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  recommendations: {
    equipment: string[];
    lessons: string[];
    practice: string[];
  };
  milestones: {
    milestone: string;
    target: string;
    timeframe: string;
  }[];
}

const Index = () => {
  const [formData, setFormData] = useState<ManifestData>({
    playerName: "",
    handicap: "",
    experience: "",
    goals: "",
    weaknesses: "",
    strengths: "",
    timeframe: "",
    budget: "",
    preferredStyle: ""
  });

  const [manifest, setManifest] = useState<GeneratedManifest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof ManifestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateManifest = async () => {
    if (!formData.playerName || !formData.handicap || !formData.goals) {
      toast.error("Please fill in at least your name, handicap, and goals to generate a manifest.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a realistic manifest based on the input
    const generatedManifest: GeneratedManifest = {
      title: `Golf Improvement Manifest for ${formData.playerName}`,
      summary: `A comprehensive development plan designed to help ${formData.playerName} achieve their golf goals through systematic improvement across technical skills, mental game, and course management.`,
      objectives: [
        `Lower handicap from ${formData.handicap} to ${Math.max(0, parseInt(formData.handicap) - 3)} within ${formData.timeframe}`,
        "Develop consistent pre-shot routine and mental approach",
        "Improve short game accuracy and distance control",
        "Build course management skills for better scoring"
      ],
      actionPlan: [
        {
          category: "Technical Skills",
          actions: [
            "Weekly lessons with PGA professional focusing on swing fundamentals",
            "Daily practice sessions emphasizing identified weaknesses",
            "Video analysis of swing mechanics monthly",
            "Structured range practice with specific targets"
          ],
          timeline: "Ongoing - 3x per week",
          priority: "High"
        },
        {
          category: "Short Game Development",
          actions: [
            "Dedicate 40% of practice time to putting and chipping",
            "Practice bunker shots weekly with various lies",
            "Develop reliable pitching technique for 30-80 yard shots",
            "Work on distance control with wedges"
          ],
          timeline: "Daily practice - 45 minutes",
          priority: "High"
        },
        {
          category: "Mental Game",
          actions: [
            "Develop consistent pre-shot routine",
            "Practice visualization techniques",
            "Learn course management strategies",
            "Work on emotional control and focus"
          ],
          timeline: "2x per week - 30 minutes",
          priority: "Medium"
        },
        {
          category: "Physical Conditioning",
          actions: [
            "Golf-specific fitness routine 3x per week",
            "Flexibility and mobility exercises daily",
            "Core strengthening for power and stability",
            "Balance and coordination drills"
          ],
          timeline: "3x per week - 45 minutes",
          priority: "Medium"
        }
      ],
      recommendations: {
        equipment: [
          "Professional club fitting for optimal performance",
          "Quality practice balls for consistent feedback",
          "Alignment sticks for proper setup",
          "Launch monitor sessions for data-driven improvement"
        ],
        lessons: [
          "Series of 6 lessons focusing on fundamentals",
          "Specialized short game instruction",
          "On-course playing lessons for real-world application",
          "Mental game coaching sessions"
        ],
        practice: [
          "Structured practice plans with specific goals",
          "Regular playing partners for competitive practice",
          "Different course experiences for variety",
          "Practice round documentation and analysis"
        ]
      },
      milestones: [
        {
          milestone: "Establish consistent practice routine",
          target: "4+ practice sessions per week",
          timeframe: "Month 1"
        },
        {
          milestone: "Improve putting average",
          target: "Reduce 3-putts by 50%",
          timeframe: "Month 2"
        },
        {
          milestone: "Lower scoring average",
          target: "Break personal best by 5 strokes",
          timeframe: "Month 3"
        },
        {
          milestone: "Achieve handicap reduction",
          target: `Reach ${Math.max(0, parseInt(formData.handicap) - 2)} handicap`,
          timeframe: formData.timeframe
        }
      ]
    };

    setManifest(generatedManifest);
    setIsGenerating(false);
    toast.success("Your personalized golf manifest has been generated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-navy-50 via-white to-golf-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 golf-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-golf-green-500 rounded-full golf-shadow">
                <Target className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              AI Golf Manifest Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
              Create personalized improvement plans powered by AI to transform your golf game
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered Analysis
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Trophy className="h-4 w-4 mr-2" />
                Personalized Plans
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Proven Results
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <Card className="p-8 glass-card golf-shadow">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-golf-navy-900 mb-4">
                Generate Your Golf Manifest
              </h2>
              <p className="text-golf-navy-600">
                Provide your details below to receive a personalized improvement plan tailored to your specific goals and current skill level.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="playerName" className="text-golf-navy-700 font-medium">
                    Player Name *
                  </Label>
                  <Input
                    id="playerName"
                    value={formData.playerName}
                    onChange={(e) => handleInputChange("playerName", e.target.value)}
                    placeholder="Enter your name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="handicap" className="text-golf-navy-700 font-medium">
                    Current Handicap *
                  </Label>
                  <Input
                    id="handicap"
                    value={formData.handicap}
                    onChange={(e) => handleInputChange("handicap", e.target.value)}
                    placeholder="e.g., 15"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience" className="text-golf-navy-700 font-medium">
                    Experience Level
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (3-7 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (8+ years)</SelectItem>
                      <SelectItem value="expert">Expert/Competitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeframe" className="text-golf-navy-700 font-medium">
                    Goal Timeframe
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("timeframe", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="2+ years">2+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="goals" className="text-golf-navy-700 font-medium">
                  Primary Goals *
                </Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  placeholder="What do you want to achieve? (e.g., lower handicap, improve consistency, better short game)"
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="strengths" className="text-golf-navy-700 font-medium">
                    Current Strengths
                  </Label>
                  <Textarea
                    id="strengths"
                    value={formData.strengths}
                    onChange={(e) => handleInputChange("strengths", e.target.value)}
                    placeholder="What aspects of your game are strongest?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="weaknesses" className="text-golf-navy-700 font-medium">
                    Areas for Improvement
                  </Label>
                  <Textarea
                    id="weaknesses"
                    value={formData.weaknesses}
                    onChange={(e) => handleInputChange("weaknesses", e.target.value)}
                    placeholder="What areas need the most work?"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-golf-navy-700 font-medium">
                    Monthly Budget
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-100">Under $100</SelectItem>
                      <SelectItem value="100-300">$100 - $300</SelectItem>
                      <SelectItem value="300-500">$300 - $500</SelectItem>
                      <SelectItem value="500-plus">$500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferredStyle" className="text-golf-navy-700 font-medium">
                    Learning Style
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("preferredStyle", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="How do you learn best?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual learner</SelectItem>
                      <SelectItem value="hands-on">Hands-on practice</SelectItem>
                      <SelectItem value="analytical">Data & analytics</SelectItem>
                      <SelectItem value="group">Group lessons</SelectItem>
                      <SelectItem value="individual">Individual coaching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateManifest}
                disabled={isGenerating}
                className="w-full bg-golf-gradient hover:scale-105 transition-all duration-300 golf-shadow h-14 text-lg font-semibold"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Your Manifest...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5" />
                    Generate AI Golf Manifest
                  </div>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {manifest ? (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <Card className="p-6 glass-card golf-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-golf-green-500 rounded-full">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-golf-navy-900">
                        {manifest.title}
                      </h3>
                      <p className="text-golf-navy-600 mt-2">{manifest.summary}</p>
                    </div>
                  </div>
                </Card>

                {/* Objectives */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-golf-green-600" />
                    Key Objectives
                  </h4>
                  <ul className="space-y-2">
                    {manifest.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="h-4 w-4 text-golf-gold-500 mt-1 flex-shrink-0" />
                        <span className="text-golf-navy-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Action Plan */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-golf-green-600" />
                    Action Plan
                  </h4>
                  <div className="space-y-6">
                    {manifest.actionPlan.map((plan, index) => (
                      <div key={index} className="border-l-4 border-golf-green-500 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-golf-navy-800">{plan.category}</h5>
                          <Badge variant={plan.priority === 'High' ? 'destructive' : plan.priority === 'Medium' ? 'default' : 'secondary'}>
                            {plan.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-sm text-golf-navy-600 mb-3">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {plan.timeline}
                        </p>
                        <ul className="space-y-1">
                          {plan.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="text-sm text-golf-navy-700 flex items-start gap-2">
                              <span className="h-1.5 w-1.5 bg-golf-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-golf-green-600" />
                    Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Equipment</h5>
                      <ul className="space-y-1">
                        {manifest.recommendations.equipment.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Lessons</h5>
                      <ul className="space-y-1">
                        {manifest.recommendations.lessons.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Practice</h5>
                      <ul className="space-y-1">
                        {manifest.recommendations.practice.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Milestones */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-golf-green-600" />
                    Progress Milestones
                  </h4>
                  <div className="space-y-4">
                    {manifest.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-golf-green-50 rounded-lg">
                        <div>
                          <h5 className="font-semibold text-golf-navy-800">{milestone.milestone}</h5>
                          <p className="text-sm text-golf-navy-600">{milestone.target}</p>
                        </div>
                        <Badge variant="outline" className="border-golf-green-600 text-golf-green-700">
                          {milestone.timeframe}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 glass-card text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-golf-green-100 rounded-full w-fit mx-auto mb-6">
                    <Target className="h-12 w-12 text-golf-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-golf-navy-900 mb-4">
                    Ready to Transform Your Game?
                  </h3>
                  <p className="text-golf-navy-600 mb-6">
                    Fill out the form to receive your personalized AI-generated golf improvement manifest.
                  </p>
                  <div className="space-y-3 text-sm text-golf-navy-500">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>AI-powered analysis</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>Personalized recommendations</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trackable milestones</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
