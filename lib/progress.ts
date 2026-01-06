// localStorage utility functions for app state

export interface ProgressData {
  completedSounds: number[];
  lastViewedSound: number;
  practiceHistory: PracticeSession[];
  playbackSpeed: number;
}

export interface PracticeSession {
  date: string;
  correctCount: number;
  totalWords: number;
  timestamp: number;
}

const STORAGE_KEY = "frenchPracticeApp";

// Get all progress data
export const getProgress = (): ProgressData => {
  if (typeof window === "undefined") return getDefaultProgress();
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultProgress();
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading progress:", error);
    return getDefaultProgress();
  }
};

// Save progress data
export const saveProgress = (progress: ProgressData): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

// Mark a sound as completed
export const markSoundCompleted = (soundId: number): void => {
  const progress = getProgress();
  if (!progress.completedSounds.includes(soundId)) {
    progress.completedSounds.push(soundId);
    saveProgress(progress);
  }
};

// Update last viewed sound
export const updateLastViewedSound = (soundId: number): void => {
  const progress = getProgress();
  progress.lastViewedSound = soundId;
  saveProgress(progress);
};

// Save practice session result
export const savePracticeSession = (correctCount: number, totalWords: number): void => {
  const progress = getProgress();
  const session: PracticeSession = {
    date: new Date().toLocaleDateString(),
    correctCount,
    totalWords,
    timestamp: Date.now(),
  };
  progress.practiceHistory.push(session);
  // Keep only last 50 sessions
  if (progress.practiceHistory.length > 50) {
    progress.practiceHistory = progress.practiceHistory.slice(-50);
  }
  saveProgress(progress);
};

// Get/Set playback speed
export const getPlaybackSpeed = (): number => {
  return getProgress().playbackSpeed;
};

export const setPlaybackSpeed = (speed: number): void => {
  const progress = getProgress();
  progress.playbackSpeed = speed;
  saveProgress(progress);
};

// Helper to get default progress
const getDefaultProgress = (): ProgressData => ({
  completedSounds: [],
  lastViewedSound: 0,
  practiceHistory: [],
  playbackSpeed: 0.8, // Default: slightly slower
});

// Get stats
export const getStats = () => {
  const progress = getProgress();
  const totalSessions = progress.practiceHistory.length;
  const totalCorrect = progress.practiceHistory.reduce((sum, s) => sum + s.correctCount, 0);
  const totalWords = progress.practiceHistory.reduce((sum, s) => sum + s.totalWords, 0);
  const averageScore = totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0;
  
  return {
    completedSounds: progress.completedSounds.length,
    totalSessions,
    averageScore,
  };
};
