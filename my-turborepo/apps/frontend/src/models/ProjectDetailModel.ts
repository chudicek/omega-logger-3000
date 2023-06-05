type ProjectDetailModel = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks: TaskBasicModel[];
};

type TaskBasicModel = {
  id: string;
  name: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  state: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
  weight: number; // not required in rendering task 'preview'; required for computing project progress
};

type TaskDetailModel = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  state: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
  weight: number;
  createdAt: string;
  icon: string | null;
  projectId: string;
  creatorId: string;
  taskUpdates: TaskUpdateModel[];
};

type TaskEditModel = {
  name: string;
  description: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  state: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
};

type TaskUpdateModel = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  taskId: string;
  creatorId: string | null;
};

type ProjectSimplifiedModel = {
  name: string;
  description: string;
};

type ProjectBasicModel = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export type {
  ProjectDetailModel,
  ProjectSimplifiedModel,
  ProjectBasicModel,
  TaskBasicModel,
  TaskDetailModel,
  TaskEditModel,
};
