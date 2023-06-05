import { FC, useState } from 'react';
import TopBar from '../commons/TopBar';
import { useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addParticipant } from '../../services/ParticipantApi';
import { useMutation } from '@tanstack/react-query';

import { useAuth0 } from '@auth0/auth0-react';

type ParticipantData = {
  xlogin: string;
};

const schema = z.object({
  xlogin: z.string().nonempty('Xlogin is required').min(1).max(80),
});

export const AddParticipantPage: FC = () => {
  const { projectId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantData>({
    resolver: zodResolver(schema),
  });

  const { getAccessTokenSilently } = useAuth0();

  const [errorMessage, setErrorMessage] = useState('');

  const add = useMutation(
    async (xlogin: string) => {
      const token = await getAccessTokenSilently();
      return await addParticipant(projectId!, xlogin, token);
    },
    {
      onError: () => {
        setErrorMessage(
          'Failed to add participant. Check if you are adding a valid user.'
        ); // Set the error message
      },
    }
  );

  const onSubmit: SubmitHandler<ParticipantData> = async (data) => {
    setErrorMessage('');
    add.mutate(data.xlogin!);
    reset();
  };

  return (
    <div>
      <TopBar
        title={'Add Participant'}
        backRoute={`/projects/${projectId}/participants`}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" inset-x-0 mx-auto mb-0 p-4 h-40 flex flex-col justify-center gap-3 w-screen bg-gradient-to-t from-white-smoke from-75% "
      >
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="xlogin"
            className="text-xl bg-white-smoke rounded-full border-4 border-white-smoke border-opacity-25"
          >
            Add participant by email:{' '}
          </label>
          <input
            type="text"
            id="xlogin"
            className="w-full"
            {...register('xlogin')}
          />
          {errors.xlogin && (
            <p className="text-dark-red">{errors.xlogin.message}</p>
          )}
          {errorMessage && (
            <p className="text-dark-red">{errorMessage}</p> // Display the error message
          )}
        </div>
        <div className="max-w-mg mx-auto">
          <button className="bg-default-green w-full" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParticipantPage;
