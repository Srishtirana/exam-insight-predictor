import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-exam-light-purple py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold  text-exam-dark-purple mb-4 ">
                Ace Your <span className="text-exam-purple">Exams</span> with
                Confidence
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Practice with our intelligent question bank that adapts to your
                learning style and helps predict your exam performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard ᯓ ✈︎
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="w-full sm:w-auto">
                        Sign Up for Free
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-6 bg-exam-purple text-white">
                    <h3 className="text-xl font-medium">Sample Question</h3>
                    <p className="text-sm text-white/80">
                      Physics - JEE Advanced
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-800 mb-4">
                      A particle is moving in a circular path with constant
                      speed. Which of the following is true?
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="h-5 w-5 rounded-full border-2 mr-3"></div>
                        <span>The velocity is constant</span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg bg-exam-light-purple border border-exam-purple cursor-pointer">
                        <div className="h-5 w-5 rounded-full border-2 border-exam-purple bg-exam-purple mr-3 flex items-center justify-center">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span>The direction of velocity is changing</span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="h-5 w-5 rounded-full border-2 mr-3"></div>
                        <span>There is no acceleration</span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <div className="h-5 w-5 rounded-full border-2 mr-3"></div>
                        <span>The acceleration is zero</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-exam-blue opacity-10 rounded-full"></div>
                <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-exam-yellow opacity-10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Exam Prediction?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-exam-light-purple rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-exam-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Smart Question Bank
              </h3>
              <p className="text-gray-600">
                Access thousands of expert-curated questions across multiple
                subjects and difficulty levels.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-exam-light-purple rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-exam-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Track your progress with comprehensive reports and identify
                areas for improvement.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-exam-light-purple rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-exam-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Performance Prediction
              </h3>
              <p className="text-gray-600">
                Get insights on your likely exam performance based on your
                practice history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-exam-dark-purple py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to improve your exam scores?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of students using Exam Prediction to ace their
            competitive exams.
          </p>
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="default"
                className="bg-white text-exam-purple hover:bg-gray-100">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-exam-purple hover:bg-gray-100">
                Get Started for Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
