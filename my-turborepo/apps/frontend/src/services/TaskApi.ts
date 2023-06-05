import { axiosInstance } from './base';
import { ResponseSingle } from '../models/Response';
import {
  TaskBasicModel,
  TaskDetailModel,
  TaskEditModel,
} from '../models/ProjectDetailModel';
import { Priority } from '../models/Priority';
import { State } from '../models/State';

type CreateTaskRequest = {
  name: string;
  description: string;
  projectId: string;
  priority: Priority;
  state: State;
  deadline: Date;
};

const createTask = async (
  request: CreateTaskRequest,
  jwt: string
): Promise<ResponseSingle<TaskBasicModel>> => {
  // todo get the caller id from the context and set it to headers
  const { projectId, ...bodyData } = request;

  const response = await axiosInstance.post(
    `/projects/${projectId}/tasks`,
    {
      // headers: { "X-User-Id": callerId }, // todo @auth
      ...bodyData,
    },
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

const getTaskDetail = async (
  projectId: string,
  taskId: string,
  jwt: string
): Promise<ResponseSingle<TaskDetailModel>> => {
  // todo get the caller id from the context and set it to headers
  const response = await axiosInstance.get(
    `/projects/${projectId}/tasks/${taskId}`,
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

const updateTask = async (
  projectId: string,
  taskId: string,
  updateData: Partial<TaskEditModel>,
  jwt: string
): Promise<ResponseSingle<TaskDetailModel>> => {
  // todo get the caller id from the context and set it to headers

  const response = await axiosInstance.patch(
    `/projects/${projectId}/tasks/${taskId}`,
    updateData,
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

export { createTask, getTaskDetail, updateTask };
