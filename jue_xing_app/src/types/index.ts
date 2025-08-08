// 觉行助手核心数据类型定义

// 修行目标类型（长期或短期）
export type GoalType = "long-term" | "short-term";

// 修行目标
export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  category: string; // 身、心、灵等分类
  createdAt: Date;
  updatedAt: Date;
  targetDate?: Date; // 短期目标的目标完成日期
  status: "active" | "completed" | "paused";
  plans: Plan[];
}

// 修行计划
export interface Plan {
  id: string;
  goalId: string;
  title: string;
  description: string;
  dailyTarget: string; // 每日具体目标，如"阅读50页"、"深蹲100个"
  unit: string; // 单位，如"页"、"个"、"分钟"
  targetAmount: number; // 目标数量
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  records: Record[];
}

// 修行记录
export interface Record {
  id: string;
  planId: string;
  date: Date;
  amount: number; // 完成数量
  completed: boolean; // 是否完成当日目标
  reflection: string; // 感想反思
  mood: 1 | 2 | 3 | 4 | 5; // 心情评分 1-5
  createdAt: Date;
  updatedAt: Date;
}

// 修行报告
export interface Report {
  id: string;
  type: "monthly" | "quarterly" | "semi-annual" | "annual";
  period: string; // 报告周期，如"2025-01"
  goals: Goal[];
  totalRecords: number;
  completionRate: number; // 完成率
  insights: string[]; // 分析洞察
  suggestions: string[]; // 改进建议
  createdAt: Date;
}

// 修行成就
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: Date;
  progress: number; // 进度百分比
  target: number; // 目标值
  current: number; // 当前值
}

// 用户设置
export interface Settings {
  aiModel: string; // AI模型类型
  apiKey: string; // API密钥
  reminderEnabled: boolean; // 是否启用提醒
  reminderTime: string; // 提醒时间
  theme: "light" | "dark" | "auto";
}

// 统计数据
export interface Statistics {
  totalPracticeTime: number; // 总修行时间（分钟）
  totalGoals: number; // 总目标数
  completedGoals: number; // 已完成目标数
  currentStreak: number; // 当前连续天数
  longestStreak: number; // 最长连续天数
  totalRecords: number; // 总记录数
}

// 日历视图数据
export interface CalendarData {
  date: Date;
  records: Record[];
  completion: number; // 当日完成度 0-100
  mood: number; // 当日平均心情
}
