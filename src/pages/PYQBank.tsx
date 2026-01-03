import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchPYQs, getPYQMetadata, PYQQuestion, PYQFilterParams } from "@/api/pyq";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";

interface PYQMetadata {
  examTypes: string[];
  subjects: string[];
  topics: string[];
  years: number[];
  difficulties: string[];
}

const PYQBank = () => {
  const [questions, setQuestions] = useState<PYQQuestion[]>([]);
  const [metadata, setMetadata] = useState<PYQMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PYQFilterParams>({
    limit: 10,
    offset: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [meta, pyqs] = await Promise.all([
          getPYQMetadata(),
          fetchPYQs(filters)
        ]);
        setMetadata(meta);
        setQuestions(pyqs);
      } catch (error) {
        console.error("Error loading PYQs:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load PYQs. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, toast]);

  const handleFilterChange = (key: keyof PYQFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset pagination when filters change
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = formData.get("search") as string;
    handleFilterChange("searchQuery", searchQuery || undefined);
  };

  if (loading && !metadata) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-md"></div>
                ))}
              </div>
              <div className="md:col-span-3 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Previous Year Questions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSearch} className="space-y-2">
                  <Input
                    name="search"
                    placeholder="Search questions..."
                    defaultValue={filters.searchQuery}
                  />
                  <Button type="submit" className="w-full">
                    Search
                  </Button>
                </form>

                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Select
                    value={filters.examType?.[0] || ""}
                    onValueChange={(value) => handleFilterChange("examType", [value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Exams</SelectItem>
                      {metadata?.examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={filters.subjects?.[0] || ""}
                    onValueChange={(value) => handleFilterChange("subjects", [value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {metadata?.subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <div className="space-y-2">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`difficulty-${level}`}
                          checked={filters.difficulties?.includes(level)}
                          onCheckedChange={(checked) => {
                            const current = filters.difficulties || [];
                            const newDifficulties = checked
                              ? [...current, level]
                              : current.filter(d => d !== level);
                            handleFilterChange("difficulties", newDifficulties);
                          }}
                        />
                        <Label htmlFor={`difficulty-${level}`} className="capitalize">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions List */}
          <div className="md:col-span-3 space-y-4">
            {questions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No questions found matching your filters.</p>
                </CardContent>
              </Card>
            ) : (
              questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {question.examType} {question.year}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            {question.subject}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            {question.difficulty}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{question.questionText}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-3 border rounded ${
                            question.correctAnswerIndex === option.id - 1
                              ? 'bg-green-50 border-green-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="font-medium text-blue-800">Explanation:</p>
                        <p className="text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PYQBank;
