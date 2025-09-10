import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats } from "@/api/user";
import { ExamParams } from "@/api/exam";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";

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

const formSchema = z.object({
  examType: z.string().min(1, { message: "Please select an exam type" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  difficulty: z
    .string()
    .min(1, { message: "Please select a difficulty level" }),
  numberOfQuestions: z
    .number()
    .min(1, { message: "Minimum 1 question" })
    .max(15, { message: "Maximum 15 questions" }),
});

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    retry: 1,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: "",
      subject: "",
      difficulty: "",
      numberOfQuestions: 5,
    },
  });

  const handleStartExam = (values: z.infer<typeof formSchema>) => {
    sessionStorage.setItem("examParams", JSON.stringify(values));
    navigate("/exam");
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error Loading Dashboard",
        description: "Could not load user statistics. Please try again later.",
      });
    }
  }, [error, toast]);

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-exam-dark-purple">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-gray-600">
            Track your performance and start a new practice exam below.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    Continue practicing to improve your scores!
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
                        stats.accuracy >= 70
                          ? "bg-exam-green"
                          : stats.accuracy >= 50
                          ? "bg-exam-yellow"
                          : "bg-exam-red"
                      }`}
                      style={{ width: `${stats.accuracy}%` }}></div>
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
                      Completed on {stats.lastExamDetails.date}
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
      </div>
    </MainLayout>
  );
};

export default Dashboard;
