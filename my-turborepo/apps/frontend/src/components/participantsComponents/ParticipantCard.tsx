import redCross from '../../assets/images/red-cross.png';
import greyCross from '../../assets/images/grey-cross.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeParticipant } from '../../services/ParticipantApi';

import { useAuth0 } from '@auth0/auth0-react';

type ParticipantCardProps = {
  id: string;
  xlogin: string;
  projectId: string;
  callerUsername: string | undefined;
};

const ParticipantCard = ({
  id,
  xlogin,
  projectId,
  callerUsername,
}: ParticipantCardProps) => {
  const queryClient = useQueryClient();

  const { getAccessTokenSilently } = useAuth0();

  const mutation = useMutation(
    async () => {
      const token = await getAccessTokenSilently();
      return await removeParticipant(projectId!, id!, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['participants']);
      },
      onError: (_e) => {
        // lol y _ no disabel pls help
        return <div>Failed to remove participant</div>;
      },
    }
  );

  const onDelete = () => {
    mutation.mutate();
  };

  return (
    <div className="relative flex justify-between bg-transparent border-2 border-light-grey rounded-lg text-dark-grey p-0 w-96 h-16 mt-4 truncate">
      <h3 className="text-xl p-4 my-auto truncate">{xlogin}</h3>
      <div className="my-auto shrink-0">
        <button
          className="bg-transparent p-0 mt-1.5"
          onClick={onDelete}
          disabled={callerUsername === xlogin}
        >
          <img
            src={callerUsername !== xlogin ? redCross : greyCross}
            alt={'delete'}
            className="relative w-12 p-0"
          />
        </button>
      </div>
    </div>
  );
};

export default ParticipantCard;
