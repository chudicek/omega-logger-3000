import { axiosInstance, hardcodedCallerId } from './base';
import { ResponseMulti } from '../models/Response';
import { ParticipantBasicModel } from '../models/ParticipantModel';

const getAllParticipants = async (
  projectId: string,
  jwt: string
): Promise<ResponseMulti<ParticipantBasicModel>> => {
  // todo get the caller id from the context and set it to headers
  const response = await axiosInstance.get(
    `/projects/${projectId}/participants`,
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

const removeParticipant = async (
  projectId: string,
  userId: string,
  jwt: string
) => {
  // todo get the caller id from the context and set it to headers
  const response = await axiosInstance.delete(
    `/projects/${projectId}/participants/`,
    {
      headers: { Authorization: 'Bearer ' + jwt },
      data: { userId },
    }
  );

  return response.data;
};

const addParticipant = async (
  projectId: string,
  xlogin: string,
  jwt: string
) => {
  // todo get the caller id from the context and set it to headers
  const response = await axiosInstance.post(
    `/projects/${projectId}/participants/`,
    {
      xlogin,
    },
    {
      headers: { Authorization: 'Bearer ' + jwt },
    }
  );

  return response.data;
};

export { getAllParticipants, removeParticipant, addParticipant };
