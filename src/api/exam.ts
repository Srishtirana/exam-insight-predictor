/* eslint-disable */
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface ExamParams {
  examType: string;
  subject: string;
  difficulty: string;
  numberOfQuestions: number;
}

export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: Option[];
  correctAnswerIndex: number;
  subject: string;
  examType: string;
  difficulty: string;
}

export interface ExamSubmission {
  examId: string;
  answers: { questionId: string; selectedAnswer: number }[];
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions: (Question & { selectedAnswer: number | null })[];
}

export interface ExamFeedbackResponse {
  feedback: string;
}

export const startExam = async (
  params: ExamParams
): Promise<{ examId: string; questions: Question[]; aiGenerated?: boolean; message?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/exam/start`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitExam = async (
  submission: ExamSubmission
): Promise<ExamResult & { aiFeedback?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/exam/submit`, submission, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSimulatedQuestions = (
  params: ExamParams
): { examId: string; questions: Question[] } => {
  const examId = Math.random().toString(36).substring(2, 15);
  const questions: Question[] = [];

  const topics: Record<string, string[]> = {
    physics: [
      "Mechanics",
      "Thermodynamics",
      "Optics",
      "Electromagnetism",
      "Modern Physics",
    ],
    chemistry: [
      "Organic",
      "Inorganic",
      "Physical",
      "Analytical",
      "Biochemistry",
    ],
    biology: ["Cell Biology", "Genetics", "Ecology", "Physiology", "Evolution"],
    mathematics: [
      "Algebra",
      "Calculus",
      "Geometry",
      "Probability",
      "Statistics",
    ],
  };

  const sampleQuestions: Record<string, any[]> = {
    physics: [
      {
        question: "Which of these is not a unit of energy?",
        options: ["Joule", "Calorie", "Electron-volt", "Newton"],
        correct: 3,
      },
      {
        question: "What is the SI unit of electric current?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        correct: 1,
      },
      {
        question:
          "Which principle states that energy can neither be created nor destroyed?",
        options: [
          "Law of Inertia",
          "Law of Conservation of Energy",
          "Newton's Third Law",
          "Archimedes' Principle",
        ],
        correct: 1,
      },
      {
        question:
          "Which phenomenon explains the bending of light when it passes from one medium to another?",
        options: ["Reflection", "Refraction", "Diffraction", "Dispersion"],
        correct: 1,
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["KE = mgh", "KE = 1/2 mv²", "KE = Fd", "KE = P/V"],
        correct: 1,
      },
    ],
    chemistry: [
      {
        question: "What is the pH of a neutral solution at 25°C?",
        options: ["0", "7", "14", "1"],
        correct: 1,
      },
      {
        question: "Which of the following is not a noble gas?",
        options: ["Helium", "Neon", "Chlorine", "Argon"],
        correct: 2,
      },
      {
        question:
          "What type of bond is formed when electrons are shared between atoms?",
        options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
        correct: 1,
      },
      {
        question: "Which of the following is not an alkali metal?",
        options: ["Sodium", "Potassium", "Calcium", "Lithium"],
        correct: 2,
      },
      {
        question:
          "The process of converting a solid directly to gas is called:",
        options: ["Melting", "Evaporation", "Sublimation", "Condensation"],
        correct: 2,
      },
    ],
    biology: [
      {
        question: "Which organelle is known as the 'powerhouse of the cell'?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        correct: 1,
      },
      {
        question: "What is the basic unit of heredity?",
        options: ["Cell", "Gene", "DNA", "Chromosome"],
        correct: 1,
      },
      {
        question: "Which process converts glucose to pyruvate?",
        options: [
          "Krebs cycle",
          "Glycolysis",
          "Oxidative phosphorylation",
          "Electron transport chain",
        ],
        correct: 1,
      },
      {
        question:
          "Which of the following is not a nucleotide base found in DNA?",
        options: ["Adenine", "Thymine", "Uracil", "Guanine"],
        correct: 2,
      },
      {
        question: "The process by which plants make food is called:",
        options: [
          "Respiration",
          "Photosynthesis",
          "Fermentation",
          "Transpiration",
        ],
        correct: 1,
      },
    ],
    mathematics: [
      {
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2"],
        correct: 1,
      },
      {
        question: "What is the value of π (pi) to 2 decimal places?",
        options: ["3.14", "3.41", "3.12", "3.24"],
        correct: 0,
      },
      {
        question: "Which of the following is not a prime number?",
        options: ["2", "3", "5", "9"],
        correct: 3,
      },
      {
        question: "If f(x) = 3x + 4, what is f(2)?",
        options: ["8", "10", "6", "12"],
        correct: 1,
      },
      {
        question: "The sum of angles in a triangle equals:",
        options: ["90°", "180°", "270°", "360°"],
        correct: 1,
      },
    ],
  };

  const subject = params.subject.toLowerCase();
  const difficultySetting = params.difficulty.toLowerCase();

  for (let i = 0; i < params.numberOfQuestions && i < 15; i++) {
    const templateIndex = Math.floor(
      Math.random() * sampleQuestions[subject].length
    );
    const template = sampleQuestions[subject][templateIndex];

    const questionTopic =
      topics[subject][Math.floor(Math.random() * topics[subject].length)];

    const options: Option[] = template.options.map(
      (text: string, id: number) => ({
        id,
        text,
      })
    );

    questions.push({
      id: `q-${examId}-${i}`,
      questionText: template.question,
      options,
      correctAnswerIndex: template.correct,
      subject: params.subject,
      examType: params.examType,
      difficulty: params.difficulty,
    });
  }

  return { examId, questions };
};

export const simulateExamSubmission = (
  submission: ExamSubmission,
  questions: Question[]
): ExamResult => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  const questionsWithAnswers = questions.map((q) => {
    const userAnswer = submission.answers.find((a) => a.questionId === q.id);
    const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : null;
    const isCorrect = selectedAnswer === q.correctAnswerIndex;

    if (isCorrect) correctAnswers++;
    else incorrectAnswers++;

    return {
      ...q,
      selectedAnswer,
    };
  });

  return {
    score: Math.round((correctAnswers / questions.length) * 100),
    totalQuestions: questions.length,
    correctAnswers,
    incorrectAnswers,
    questions: questionsWithAnswers,
  };
};

export const analyzeAttempt = async (
  examId: string
): Promise<ExamFeedbackResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/exam/analyze`,
      { examId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAIFeedback = async (
  examId: string
): Promise<ExamFeedbackResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/exam/feedback/${examId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
