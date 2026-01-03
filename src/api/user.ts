// Stub user API to unblock frontend build

export type UserStats = {
  totalExams: number;
  averageScore: number;
  lastExamScore: number;
};

export const getUserStats = async (): Promise<UserStats> => {
  return Promise.resolve({
    totalExams: 0,
    averageScore: 0,
    lastExamScore: 0,
  });
};

export const getSimulatedUserStats = async (): Promise<UserStats> => {
  return Promise.resolve({
    totalExams: 5,
    averageScore: 62,
    lastExamScore: 68,
  });
};
