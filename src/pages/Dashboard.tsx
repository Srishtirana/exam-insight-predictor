import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD
import { getUserStats, getSimulatedUserStats, type UserStats } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
=======
import { getUserStats } from "@/api/user";
import { ExamParams } from "@/api/exam";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";

>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
<<<<<<< HEAD
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Form Schema
const formSchema = z.object({
  examType: z.string().min(1, { message: "Please select an exam type" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
=======

const formSchema = z.object({
  examType: z.string().min(1, { message: "Please select an exam type" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  difficulty: z
    .string()
    .min(1, { message: "Please select a difficulty level" }),
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
  numberOfQuestions: z
    .number()
    .min(1, { message: "Minimum 1 question" })
    .max(15, { message: "Maximum 15 questions" }),
});

<<<<<<< HEAD
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
  icon: React.ReactNode;
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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const SubjectPerformanceChart = ({ data }: SubjectPerformanceChartProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card className="col-span-2">
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
  // Hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: "JEE",
      subject: "physics",
      difficulty: "medium",
      numberOfQuestions: 10,
    },
  });

  // Data fetching
  const { data: stats, error } = useQuery<UserStats>({
=======
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
    queryKey: ["userStats"],
    queryFn: getUserStats,
    retry: 1,
  });

<<<<<<< HEAD
  // Handlers
=======
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: "",
      subject: "",
      difficulty: "",
      numberOfQuestions: 5,
    },
  });

>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
  const handleStartExam = (values: z.infer<typeof formSchema>) => {
    sessionStorage.setItem("examParams", JSON.stringify(values));
    navigate("/exam");
  };

<<<<<<< HEAD
  // Effects
=======
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error Loading Dashboard",
<<<<<<< HEAD
        description: "Could not load user statistics. Using simulated data instead.",
      });
      setRecentActivity([
        { subject: 'Physics', score: 75, date: '2023-06-15' },
        { subject: 'Chemistry', score: 82, date: '2023-06-10' },
        { subject: 'Mathematics', score: 68, date: '2023-06-05' },
      ]);
    } else if (stats) {
      setRecentActivity(
        stats.examStats.map(stat => ({
          subject: stat.subject,
          score: stat.averageScore,
          date: new Date().toISOString().split('T')[0] // Use current date as fallback
        }))
      );
    }
    setIsLoading(false);
  }, [error, stats, toast]);

  // Derived state
  const displayStats = stats || getSimulatedUserStats();

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto p-6">
        {/* Header */}
=======
        description: "Could not load user statistics. Please try again later.",
      });
    }
  }, [error, toast]);

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-exam-dark-purple">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-gray-600">
            Track your performance and start a new practice exam below.
          </p>
        </div>

<<<<<<< HEAD
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Attempts"
            value={displayStats.totalAttempts}
            description="+5 from last month"
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
            value="7 days"
            description="Keep it up!"
            icon="🔥"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <AccuracyPieChart accuracy={displayStats.accuracy} />
          {displayStats.examStats?.length > 0 && (
            <SubjectPerformanceChart data={displayStats.examStats} />
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
                              field.onChange(parseInt(e.target.value, 10) || 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg" className="bg-exam-purple hover:bg-exam-dark-purple">
                    Start Exam
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
=======
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Exams Attempted</CardDescription>
                  <Skeleton className="h-10 w-20 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Overall Accuracy</CardDescription>
                  <Skeleton className="h-10 w-32 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full rounded-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Study Streak</CardDescription>
                  <Skeleton className="h-10 w-20 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Last Exam Performance</CardDescription>
                  <Skeleton className="h-10 w-32 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
            </>
          ) : stats ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Exams Attempted</CardDescription>
                  <CardTitle className="text-4xl">
                    {stats.totalAttempts}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    {stats.totalAttempts > 0 ? "Keep up the great work!" : "Start your first exam!"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Overall Accuracy</CardDescription>
                  <CardTitle className="text-4xl">
                    {stats.accuracy}%
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      correct answers
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        stats.accuracy >= 80
                          ? "bg-exam-green"
                          : stats.accuracy >= 60
                          ? "bg-exam-yellow"
                          : "bg-exam-red"
                      }`}
                      style={{ width: `${stats.accuracy}%` }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Study Streak</CardDescription>
                  <CardTitle className="text-4xl">
                    {stats.studyStreak || 0}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      days
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    {stats.studyStreak > 0 ? "🔥 Keep the momentum going!" : "Start building your streak!"}
                  </div>
                </CardContent>
              </Card>

              {stats.lastExamDetails && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Last Exam Performance</CardDescription>
                    <CardTitle className="flex items-baseline">
                      <span className="text-4xl">
                        {stats.lastExamDetails.score}%
                      </span>
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        in {stats.lastExamDetails.subject}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      {stats.lastExamDetails.examType} • {stats.lastExamDetails.difficulty}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {stats.lastExamDetails.date}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>

        {/* Subject Performance */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-exam-dark-purple mb-4">
            Subject Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-5 w-10" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full my-2" />
                        <Skeleton className="h-3 w-16 mt-2" />
                      </CardContent>
                    </Card>
                  ))
              : stats?.examStats
              ? stats.examStats.map((subject, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{subject.subject}</h3>
                        <span className="text-lg font-semibold">
                          {subject.averageScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            subject.averageScore >= 70
                              ? "bg-exam-green"
                              : subject.averageScore >= 50
                              ? "bg-exam-yellow"
                              : "bg-exam-red"
                          }`}
                          style={{ width: `${subject.averageScore}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {subject.attempts} attempts
                      </p>
                    </CardContent>
                  </Card>
                ))
              : null}
          </div>
        </div>

        {/* Performance Insights */}
        {stats?.insights && stats.insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-exam-dark-purple mb-4">
              💡 Performance Insights
            </h2>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {stats.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Trends */}
        {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-exam-dark-purple mb-4">
              📈 Recent Performance Trends
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {stats.recentAttempts.slice(0, 5).map((attempt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          attempt.score >= 80 ? 'bg-exam-green' : 
                          attempt.score >= 60 ? 'bg-exam-yellow' : 'bg-exam-red'
                        }`}></div>
                        <div>
                          <p className="font-medium">{attempt.subject} • {attempt.examType}</p>
                          <p className="text-sm text-gray-500">{attempt.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{attempt.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Features Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-exam-dark-purple mb-4">
            🤖 AI-Powered Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🧠</span>
                  <h3 className="font-semibold text-purple-700">Smart Question Generation</h3>
                </div>
                <p className="text-sm text-gray-600">
                  AI generates personalized questions based on your exam type, subject, and difficulty level
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-semibold text-green-700">Intelligent Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Get detailed AI feedback on your performance with personalized improvement suggestions
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-semibold text-orange-700">Adaptive Learning</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Questions adapt to your performance to provide optimal challenge and learning
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start New Exam */}
        <div>
          <h2 className="text-xl font-semibold text-exam-dark-purple mb-6">
            Start New Practice Exam
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Exam</CardTitle>
              <CardDescription>
                Select the parameters for your practice session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleStartExam)}
                  className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="examType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
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

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="physics">Physics</SelectItem>
                              <SelectItem value="chemistry">
                                Chemistry
                              </SelectItem>
                              <SelectItem value="mathematics">
                                Mathematics
                              </SelectItem>
                              <SelectItem value="biology">Biology</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                              <SelectItem value="mixed">Mixed (Easy + Medium + Hard)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                                field.onChange(
                                  parseInt(e.target.value, 10) || 0
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    Start Exam
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf
      </div>
    </MainLayout>
  );
};

export default Dashboard;
