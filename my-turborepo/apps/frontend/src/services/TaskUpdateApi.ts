import { axiosInstance } from './base';
import { ResponseSingle } from '../models/Response';
import { TaskUpdateBasicModel } from '../models/TaskUpdateBasicModel';

type UpdateTaskRequest = {
  projectId: string;
  taskId: string;
  name: string;
  content: string;
};

const createTaskUpdate = async (
  request: UpdateTaskRequest,
  jwt: string
): Promise<ResponseSingle<TaskUpdateBasicModel>> => {
  // todo get the caller id from the context and set it to headers
  const { projectId, taskId, ...bodyData } = request;

  const response = await axiosInstance.post(
    `/projects/${projectId}/tasks/${taskId}/update`,
    {
      ...bodyData,
    },
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

const getTaskUpdateDetail = async (
  projectId: string,
  taskId: string,
  taskUpdateId: string,
  jwt: string
): Promise<ResponseSingle<TaskUpdateBasicModel>> => {
  // todo get the caller id from the context and set it to headers
  const response = await axiosInstance.get(
    `/projects/${projectId}/tasks/${taskId}/update/${taskUpdateId}`,
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

export { createTaskUpdate, getTaskUpdateDetail };
