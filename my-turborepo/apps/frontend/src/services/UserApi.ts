import { ResponseSingle } from '../models/Response';
import { ParticipantBasicModel } from '../models/ParticipantModel';
import { axiosInstance } from './base';

const getUser = async (
  id: string,
  jwt: string
): Promise<ResponseSingle<ParticipantBasicModel>> => {
  const response = await axiosInstance.get(`/user/${id}`, {
    headers: { Authorization: 'Bearer ' + jwt },
  });

  return response.data;
};

export { getUser };
