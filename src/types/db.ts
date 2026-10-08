export type Priority = {
  id: string;
  user_id: string;
  day: string;
  position: 1 | 2 | 3;
  title: string;
  done: boolean;
  created_at: string;
};

export type Bill = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  paid_at: string | null;
  created_at: string;
};

export type GoalStatus = "active" | "done" | "archived";

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  next_step: string | null;
  status: GoalStatus;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  archived: boolean;
  created_at: string;
};

export type HabitLog = {
  id: string;
  user_id: string;
  habit_id: string;
  day: string;
};
