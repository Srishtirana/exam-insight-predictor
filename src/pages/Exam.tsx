import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  startExam, 
  submitExam, 
  analyzeAttempt, 
  type Question, 
  type ExamParams, 
  type ExamResult, 
  type Option as QuestionOption
} from "@/api/exam";

const Exam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examInfo, setExamInfo] = useState<{ 
    examId: string; 
    questions: Question[]; 
    aiGenerated?: boolean; 
    message?: string 
  }>({ 
    examId: "", 
    questions: [],
    aiGenerated: false,
    message: ""
  });
  const [aiStatus, setAiStatus] = useState<{ isAiGenerated: boolean; message: string }>({ 
    isAiGenerated: false, 
    message: "" 
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initExam = async () => {
      const examParamsJson = sessionStorage.getItem("examParams");
      
      if (!examParamsJson) {
        // If no exam parameters found, redirect to dashboard
        navigate("/dashboard");
        return;
      }
      
      try {
        const examParams = JSON.parse(examParamsJson) as ExamParams;
        setLoading(true);
        
        // Call the API to start a new exam
        const examData = await startExam(examParams);
        setExamInfo(examData);
        
        // Set AI status for display
        setAiStatus({
          isAiGenerated: examData.aiGenerated || false,
          message: examData.message || "Questions loaded successfully"
        });
        
        // Show AI generation status
        if (examData.aiGenerated) {
          toast({
            title: "🤖 AI-Powered Questions Generated",
            description: examData.message || "Questions generated using advanced AI technology for personalized learning",
            duration: 6000,
          });
        } else {
          toast({
            title: "📚 Questions from Question Bank",
            description: "Using curated questions from our database",
            duration: 4000,
          });
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error("Failed to start exam:", error);
        setError("Failed to start exam. Please try again.");
        toast({
          variant: "destructive",
          title: "Error Starting Exam",
          description: error.response?.data?.message || "Could not load exam questions. Please try again."
        });
        setLoading(false);
      }
    };

    initExam();
  }, [navigate, toast]);

  const currentQuestion = loading || !examInfo.questions.length ? undefined : examInfo.questions[currentQuestionIndex];
  
  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examInfo.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (Object.keys(selectedAnswers).length === examInfo.questions.length) {
      // Auto-submit if all questions are answered and user clicks next on last question
      handleSubmitExam();
    }
  };
  
  const handleSubmitExam = async () => {
    // Convert selected answers to the format expected by the API
    const answers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer: selectedAnswer as number,
    }));
    
    setSubmitting(true);
    try {
      // Submit the exam to the API
      const result = await submitExam({
        examId: examInfo.examId,
        answers
      });
      
      setExamResult(result);
      setExamCompleted(true);
      
      toast({
        title: "Exam Submitted",
        description: `Your score: ${result.score}%`
      });

      // Trigger AI feedback (best-effort)
      try {
        const feedback = await analyzeAttempt(examInfo.examId);
        setAiFeedback(feedback.feedback);
      } catch (e) {
        console.error("Failed to get AI feedback:", e);
        setAiFeedback(null);
      }
    } catch (error: any) {
      console.error("Failed to submit exam:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.response?.data?.message || "Could not submit your exam. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <MainLayout requireAuth>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-exam-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout requireAuth>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-exam-red mb-4">Error Loading Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleReturnToDashboard}>
            Return to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (examCompleted && examResult) {
    return (
      <MainLayout requireAuth>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-exam-dark-purple mb-8">
            Exam Results
          </h1>
          
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-t-4 border-t-exam-purple">
              <CardHeader>
                <CardTitle className="text-center">Your Score</CardTitle>
                <div className="flex justify-center">
                  <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-5xl font-bold text-exam-purple">
                      {examResult.score}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-gray-500">Total Questions</p>
                    <p className="text-2xl font-medium">{examResult.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Correct Answers</p>
                    <p className="text-2xl font-medium text-exam-green">
                      {examResult.correctAnswers}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-2">Accuracy</p>
                    <Progress value={examResult.score} className="h-3" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Question Review</h2>
            
            <div className="space-y-6">
              {examResult.questions.map((question, index) => {
                const isCorrect = question.selectedAnswer === question.correctAnswerIndex;
                return (
                  <Card 
                    key={question.id} 
                    className={`border-l-4 ${
                      isCorrect ? "border-l-exam-green" : "border-l-exam-red"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <span className="bg-gray-100 rounded-full w-7 h-7 inline-flex items-center justify-center mr-2 text-sm">
                          {index + 1}
                        </span>
                        {question.questionText}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          let optionClass = "border-gray-200 bg-white";
                          
                          if (question.correctAnswerIndex === optIndex) {
                            optionClass = "border-exam-green bg-green-50";
                          } else if (question.selectedAnswer === optIndex) {
                            optionClass = "border-exam-red bg-red-50";
                          }
                          
                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded-md border ${optionClass} flex items-start`}
                            >
                              <div className="mr-3 mt-0.5">
                                {question.correctAnswerIndex === optIndex ? (
                                  <svg className="h-5 w-5 text-exam-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : selectedAnswers[question.id] !== undefined && selectedAnswers[question.id] === optIndex ? (
                                  <svg className="h-5 w-5 text-exam-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                                )}
                              </div>
                              <span>{typeof option === 'string' ? option : option.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {aiFeedback && (
            <div className="max-w-3xl mx-auto mt-10">
              <h2 className="text-xl font-semibold mb-3">AI Feedback</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="whitespace-pre-line">{aiFeedback}</p>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-exam-dark-purple">
                Question {currentQuestionIndex + 1} of {examInfo.questions.length}
              </h1>
              <div className="text-sm text-gray-500">
                {Math.floor((Object.keys(selectedAnswers).length / examInfo.questions.length) * 100)}% Completed
              </div>
            </div>
            <Progress
              value={(Object.keys(selectedAnswers).length / examInfo.questions.length) * 100}
              className="h-2"
            />
          </div>
          
          {/* AI Status Indicator */}
          {aiStatus && (
            <div className="mb-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                aiStatus.isAiGenerated 
                  ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                {aiStatus.isAiGenerated ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-purple-600">🤖</span>
                      <span className="font-medium text-purple-700">AI-Powered</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">Questions generated using advanced AI</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">📚</span>
                      <span className="font-medium text-gray-700">Question Bank</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">Using curated questions from database</span>
                  </>
                )}
              </div>
            </div>
          )}
          {/* Question */}
          {currentQuestion && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{currentQuestion.questionText}</CardTitle>
                <CardDescription>
                  {currentQuestion.subject} • {currentQuestion.difficulty}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option: QuestionOption) => (
                    <div
                      key={option.id}
                      className={`flex items-center p-4 rounded-md border cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestion.id] === option.id
                          ? "bg-exam-light-purple border-exam-purple"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                    >
                      <div
                        className={`h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedAnswers[currentQuestion.id] === option.id
                            ? "border-exam-purple"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestion.id] === option.id && (
                          <div className="h-2.5 w-2.5 rounded-full bg-exam-purple"></div>
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {currentQuestionIndex === examInfo.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitExam}
                      disabled={submitting || Object.keys(selectedAnswers).length !== examInfo.questions.length}
                    >
                      {submitting ? "Submitting..." : "Submit Exam"}
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>Next</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          )}
          
          {/* Question Navigator */}
          <div>
            <h2 className="text-lg font-medium mb-3">Question Navigator</h2>
            <div className="flex flex-wrap gap-2">
              {examInfo.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${
                      selectedAnswers[question.id] !== undefined
                        ? "bg-exam-purple text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }
                    ${currentQuestionIndex === index ? "ring-2 ring-offset-2 ring-exam-purple" : ""}
                    ${index === currentQuestionIndex ? "font-bold" : ""}
                  `}
                  aria-label={`Question ${index + 1}${selectedAnswers[question.id] !== undefined ? ' (answered)' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {Object.keys(selectedAnswers).length} of {examInfo.questions.length} questions answered
              </span>
              {Object.keys(selectedAnswers).length === examInfo.questions.length && (
                <Button 
                  onClick={handleSubmitExam}
                  className="bg-exam-green hover:bg-exam-green/90"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Exam"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Exam;
