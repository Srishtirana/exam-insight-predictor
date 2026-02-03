import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { getUserStats, getSimulatedUserStats } from "../api/user";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

// Form Schema
const formSchema = z.object({
  examType: z.string().min(1, { message: "Please select an exam type" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  numberOfQuestions: z.number()
    .min(1, { message: "Minimum 1 question" })
    .max(15, { message: "Maximum 15 questions" }),
});

// Types
interface Activity {
  subject: string;
  score: number;
  date: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
}

interface SubjectPerformanceChartProps {
  data: { subject: string; averageScore: number }[];
}

interface AccuracyPieChartProps {
  accuracy: number;
}

// Components
const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-col items-start pb-2">
      <div className="flex items-center justify-between w-full">
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        {icon && <div className="ml-2">{icon}</div>}
      </div>
      <CardTitle className="text-2xl mt-2">
        {value}
      </CardTitle>
    </CardHeader>
    {description && (
      <CardContent>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    )}
  </Card>
);

const SubjectPerformanceChart = ({ data }: SubjectPerformanceChartProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subject-wise Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: unknown) => [`${value}%`, 'Average Score']}
                labelFormatter={(label: string) => `Subject: ${label}`}
              />
              <Bar dataKey="averageScore" name="Average Score" fill="#8884d8">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const AccuracyPieChart = ({ accuracy }: AccuracyPieChartProps) => {
  const data = [
    { name: 'Correct', value: accuracy },
    { name: 'Incorrect', value: 100 - accuracy },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accuracy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: unknown) => [`${value}%`, '']}
                labelFormatter={(label: string) => `${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="text-3xl font-bold">{accuracy}%</div>
            <p className="text-sm text-muted-foreground">Overall Accuracy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  // State
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form handling
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: "JEE",
      subject: "Physics",
      difficulty: "medium",
      numberOfQuestions: 10,
    },
  });

  // Data fetching
  const { data: stats, error } = useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    retry: 1,
  });

  // Handlers
  const handleStartExam = (values: z.infer<typeof formSchema>) => {
    sessionStorage.setItem("examParams", JSON.stringify(values));
    navigate("/exam");
  };

  // Set recent activity from stats and handle errors
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      
      // Fallback data in case of error
      toast({
        title: "Using Simulated Data",
        description: "Could not load user statistics. Using simulated data instead.",
      });
      
      setRecentActivity([
        { subject: 'Physics', score: 75, date: '2023-06-15' },
        { subject: 'Chemistry', score: 82, date: '2023-06-10' },
        { subject: 'Mathematics', score: 68, date: '2023-06-05' },
      ]);
    } else if (stats) {
      setRecentActivity(
        stats.subjectPerformance?.map(stat => ({
          subject: stat.subject,
          score: stat.averageScore,
          date: new Date().toISOString().split('T')[0] // Use current date as fallback
        })) || []
      );
    }
    
    setIsLoading(false);
  }, [stats, error, toast]);

  // Derived state
  const displayStats = stats || getSimulatedUserStats();

  // Loading state
  if (isLoading) {
    return (
      <MainLayout requireAuth>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-exam-dark-purple mb-2">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Track your performance and start a new practice exam below.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
<<<<<<< HEAD
            title="Total Quizzes"
            value={stats.totalQuizzes || 0}
            description="Total number of quizzes taken"
=======
            title="Total Attempts"
            value={displayStats.totalAttempts}
            description="+5 from last month"
>>>>>>> 9abcbd346314186855a347202eca5ee1e7ff40ac
            icon="📊"
          />
          <StatCard
            title="Average Score"
            value={`${displayStats.accuracy}%`}
            description="+3% from last month"
            icon="🎯"
          />
          {displayStats.lastExamDetails && (
            <StatCard
              title="Last Exam"
              value={`${displayStats.lastExamDetails.score}%`}
              description={displayStats.lastExamDetails.subject}
              icon="📝"
            />
          )}
          <StatCard
            title="Active Streak"
            value={`${stats.streakDays || 0} days`}
            description={stats.streakDays ? 'Keep it up!' : 'Start a streak today!'}
            icon="🔥"
          />
        </div>

        {/* Charts */}
<<<<<<< HEAD
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <AccuracyPieChart accuracy={stats.accuracy || 0} />
          {stats.subjectPerformance?.length > 0 && (
            <SubjectPerformanceChart data={stats.subjectPerformance} />
=======
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <AccuracyPieChart accuracy={displayStats.accuracy} />
          {displayStats.examStats?.length > 0 && (
            <SubjectPerformanceChart data={displayStats.examStats} />
>>>>>>> 9abcbd346314186855a347202eca5ee1e7ff40ac
          )}
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent exam attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.subject} Exam</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activity.score >= 70 ? 'bg-green-100 text-green-800' :
                      activity.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.score}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activity to show</p>
            )}
          </CardContent>
        </Card>

        {/* Start New Exam Form */}
        <Card>
          <CardHeader>
            <CardTitle>Start New Practice Exam</CardTitle>
            <CardDescription>Customize your practice session</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleStartExam)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Exam Type */}
                  <FormField
                    control={form.control}
                    name="examType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select exam type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="JEE">JEE</SelectItem>
                            <SelectItem value="NEET">NEET</SelectItem>
                            <SelectItem value="GATE">GATE</SelectItem>
                            <SelectItem value="CAT">CAT</SelectItem>
                            <SelectItem value="UPSC">UPSC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Difficulty */}
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of Questions */}
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions (1-15)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={15}
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value, 10) || 1);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-exam-purple hover:bg-exam-dark-purple">
                    Start Exam
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// AI Feature Card Component
const AIFeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
