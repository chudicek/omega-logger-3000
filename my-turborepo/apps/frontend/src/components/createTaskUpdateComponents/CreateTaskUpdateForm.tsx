import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createTaskUpdate } from '../../services/TaskUpdateApi';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth0 } from '@auth0/auth0-react';

type CreateTaskUpdateProps = {
  projectId: string;
  taskId: string;
};

type CreateTaskUpdateFormData = {
  name: string;
  description: string;
};

const schema = z.object({
  name: z.string().nonempty('Name is required').min(1).max(80),
  description: z.string().nonempty('Description is required').min(1).max(190),
});

const CreateTaskUpdateForm: FC<CreateTaskUpdateProps> = ({
  projectId,
  taskId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskUpdateFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const backRoute = `/projects/${projectId}/tasks/${taskId}`;

  const { getAccessTokenSilently } = useAuth0();

  const onSubmit = async (data: CreateTaskUpdateFormData) => {
    const token = await getAccessTokenSilently();

    await createTaskUpdate(
      {
        projectId: projectId,
        taskId: taskId,
        name: data.name,
        content: data.description,
      },
      token
    );

    navigate(backRoute);
  };

  const onCancel = () => {
    navigate(backRoute);
  };

  return (
    <form
      className="w-screen max-w-[361px] p-8 flex flex-wrap gap-3 justify-center mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label htmlFor="name">Name*</label>
        <input type="text" id="name" className="w-72" {...register('name')} />
        {errors.name && <p className="text-dark-red">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="description">Description*</label>
        <textarea
          id="description"
          className="w-72 h-40"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-dark-red">{errors.description.message}</p>
        )}
      </div>

      <div>
        <button className="bg-default-green w-full" type="submit">
          Create
        </button>
      </div>
      <div>
        <button
          className="text-dark-red text-sm w-fit p-2"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateTaskUpdateForm;
