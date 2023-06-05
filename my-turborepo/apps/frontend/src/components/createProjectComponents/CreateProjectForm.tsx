import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { createProject } from '../../services/ProjectApi';
import { ProjectSimplifiedModel } from '../../models/ProjectDetailModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().nonempty('Name is required').min(1).max(80),
  description: z.string().nonempty('Description is required').min(1).max(190),
});

import { useAuth0 } from '@auth0/auth0-react';

const CreateProjectForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectSimplifiedModel>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const onSubmit: SubmitHandler<ProjectSimplifiedModel> = async (data) => {
    const token = await getAccessTokenSilently();
    const newProject = await createProject(
      {
        name: data.name,
        description: data.description,
      },
      token
    );

    navigate('/projects');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-screen max-w-[361px] p-8 flex flex-wrap gap-3 justify-center mx-auto"
    >
      <div>
        <label htmlFor="name">Project name*</label>
        <input type="text" id="name" className="w-full" {...register('name')} />
        {errors.name && <p className="text-dark-red">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="description">Description*</label>
        <textarea
          id="description"
          className="w-full h-40"
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
        <Link to="/projects">
          <button className="text-dark-red text-sm w-fit p-2" type="button">
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
};

export default CreateProjectForm;
