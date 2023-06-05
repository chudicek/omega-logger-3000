import TopBar from '../commons/TopBar';
import { useNavigate, useParams } from 'react-router-dom';
import ParticipantCard from './ParticipantCard';
import { getAllParticipants } from '../../services/ParticipantApi';
import { useQuery } from '@tanstack/react-query';

import { useAuth0 } from '@auth0/auth0-react';
import { getUser } from '../../services/UserApi';
import Loading from '../commons/Loading';

const ParticipantsPage = () => {
  const { projectId } = useParams();
  const backRoute = `/projects/${projectId}/`;
  const navigate = useNavigate();

  const { getAccessTokenSilently, user } = useAuth0();

  const { data: userData } = useQuery(['user', user?.sub], async () => {
    const token = await getAccessTokenSilently();
    const sub = user?.sub;
    if (!sub) return null;
    return await getUser(sub, token);
  });

  const { data: participants } = useQuery(
    ['participants', projectId],
    async () => {
      const token = await getAccessTokenSilently();
      return getAllParticipants(projectId!, token);
    }
  );

  if (!participants) return <Loading />;

  const onAddParticipant = () => {
    navigate(`/projects/${projectId}/participants/addParticipant`);
  };

  return (
    <div>
      <TopBar title={'Participants'} backRoute={backRoute} />
      <div className="fixed top-20 inset-x-0 flex flex-wrap gap-y-0 gap-x-4 mx-4 justify-center max-h-screen overflow-y-auto">
        {participants.data.map((participant) => {
          return (
            <ParticipantCard
              key={participant.id}
              id={participant.id}
              xlogin={participant.xlogin}
              projectId={projectId!}
              callerUsername={userData?.data.xlogin}
            />
          );
        })}
        <div className="h-28 m-28 w-screen"></div>
      </div>
      <div className="fixed bottom-0 inset-x-0 mx-auto mb-0 p-4 h-40 flex flex-col justify-center gap-3 w-screen bg-gradient-to-t from-white-smoke from-75% ">
        <div className="max-w-mg mx-auto">
          <button
            className="bg-default-green w-full"
            onClick={onAddParticipant}
          >
            Add participant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
