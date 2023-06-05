import { axiosInstance } from './base';
import {
  ProjectSimplifiedModel,
  ProjectDetailModel,
  ProjectBasicModel,
} from '../models/ProjectDetailModel';
import { ResponseMulti, ResponseSingle } from '../models/Response';

const getProjectDetail = async (
  id: string,
  jwt: string
): Promise<ResponseSingle<ProjectDetailModel>> => {
  // todo get the caller id from the context and set it to headers
  const response = await axiosInstance.get(`/projects/${id}`, {
    // headers: { 'X-User-Id': hardcodedCallerId },
    headers: { Authorization: 'Bearer ' + jwt },
  });

  return response.data;
};

/**
 * notice the position of the jwt parameter
 */
const getProjectTasks = async (
  jwt: { jwt: string }, // i guess lets enforce the naming -> notice the position of the jwt parameter xdd
  projectId: string,
  orderBy: string,
  searchName: string,
  priorityFilter?: string | undefined,
  stateFilter?: string | undefined
) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks`, {
    headers: { Authorization: 'Bearer ' + jwt.jwt },
    params: {
      orderBy,
      searchName,
      priorityFilter: priorityFilter != undefined ? priorityFilter : '',
      stateFilter: stateFilter != undefined ? stateFilter : '',
    },
  });

  return response.data;
};

const getAllProjects = async (
  jwt: string
): Promise<ResponseMulti<ProjectBasicModel>> => {
  const response = await axiosInstance.get(`/projects`, {
    headers: { Authorization: 'Bearer ' + jwt },
  });

  return response.data;
};

const createProject = async (
  data: ProjectSimplifiedModel,
  jwt: string
): Promise<ResponseSingle<ProjectBasicModel>> => {
  const response = await axiosInstance.post(
    `/projects`,
    {
      ...data,
    },
    { headers: { Authorization: 'Bearer ' + jwt } }
  );

  return response.data;
};

const updateProject = async (
  projectId: string,
  updateData: Partial<ProjectSimplifiedModel>,
  jwt: string
): Promise<ResponseSingle<ProjectBasicModel>> => {
  const response = await axiosInstance.patch(
    `/projects/${projectId}`,
    updateData,
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

export {
  getProjectDetail,
  getAllProjects,
  createProject,
  updateProject,
  getProjectTasks,
};
