import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProjectSimplifiedModel } from '../../models/ProjectDetailModel';
import { updateProject } from '../../services/ProjectApi';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth0 } from '@auth0/auth0-react';

type EditProjectFormProps = {
  name: string;
  description: string;
};

const schema = z.object({
  name: z.string().nonempty('Name is required').min(1).max(80),
  description: z.string().nonempty('Description is required').min(1).max(190),
});

const EditProjectForm: FC<EditProjectFormProps> = ({ name, description }) => {
  const { projectId } = useParams();
  const backRoute = `/projects/${projectId}`;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectSimplifiedModel>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const mutation = useMutation(
    async (project: ProjectSimplifiedModel) => {
      const token = await getAccessTokenSilently();
      return await updateProject(projectId!, project, token);
    },
    {
      onSuccess: () => {
        navigate(backRoute);
      },
      onError: () => {
        return <div>Failed to update project info</div>;
      },
    }
  );

  const onSubmit: SubmitHandler<ProjectSimplifiedModel> = async (formData) => {
    mutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-screen max-w-[361px] p-8 flex flex-wrap gap-3 justify-center mx-auto"
    >
      <div>
        <label htmlFor="name">Project name</label>
        <input
          type="text"
          id="name"
          className="w-full"
          defaultValue={name}
          {...register('name')}
        />
        {errors.name && <p className="text-dark-red">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="w-full h-40"
          defaultValue={description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-dark-red">{errors.description.message}</p>
        )}
      </div>
      <div>
        <button className="bg-default-green w-full" type="submit">
          Update
        </button>
      </div>
      <div>
        <Link to={`/projects/${projectId}`}>
          <button className="text-dark-red text-sm w-fit p-2" type="button">
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
};

export default EditProjectForm;
