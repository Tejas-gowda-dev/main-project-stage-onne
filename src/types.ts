export interface Program {
  id: string;
  title: string;
  domain: 'CSE' | 'ECE' | 'Mechanical' | 'Civil' | 'AI & ML' | 'Embedded' | 'IoT' | 'Robotics';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  liveProject: boolean;
  enrollmentPercentage: number;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  rating: number;
  description: string;
  curriculum: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  college: string;
  domain: string;
  quote: string;
  avatar: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  color: string;
  xpValue: number;
}

export interface MentorSession {
  id: string;
  title: string;
  mentor: string;
  time: string;
  timestamp: string; // ISO or date string
  rsvpCount: number;
  xpAward: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  college: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface RoadmapNode {
  id: string;
  week: string;
  title: string;
  description: string;
  status: 'locked' | 'in-progress' | 'completed';
  xpReward: number;
  skillsAcquired: string[];
  projects: string[];
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  college?: string;
  level: number;
  xp: number;
  streak: number;
  completedNodes: string[];
  activeNodeId: string;
  badges: string[];
  labsCompleted: number;
}
