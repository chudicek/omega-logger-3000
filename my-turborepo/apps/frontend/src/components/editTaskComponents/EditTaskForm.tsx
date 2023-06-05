import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Priority } from '../../models/Priority';
import { format } from 'date-fns';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updateTask } from '../../services/TaskApi';
import { useMutation } from '@tanstack/react-query';
import { TaskEditModel } from '../../models/ProjectDetailModel';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { State } from '../../models/State';

import { useAuth0 } from '@auth0/auth0-react';

type EditTaskFormProps = {
  name: string;
  priority: Priority;
  state: State;
  deadline: Date;
  description: string;
};

const schema = z.object({
  name: z.string().nonempty('Name is required').min(1).max(80),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
  state: z.enum([State.TODO, State.SENT_FOR_REVIEW, State.DONE]),
  deadline: z.string(),
  description: z.string().nonempty('Description is required').min(1).max(190),
});

const EditTaskForm: FC<EditTaskFormProps> = (data) => {
  const { projectId, taskId } = useParams();
  const backRoute = `/projects/${projectId}/tasks/${taskId}`;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskEditModel>({
    resolver: zodResolver(schema),
  });

  const { getAccessTokenSilently } = useAuth0();

  const mutation = useMutation(
    async (task: TaskEditModel) => {
      const token = await getAccessTokenSilently();
      return await updateTask(projectId!, taskId!, task, token);
    },
    {
      onSuccess: () => {
        navigate(backRoute);
      },
      onError: () => {
        return <div>Failed to update task info</div>;
      },
    }
  );

  const onSubmit = (formData: TaskEditModel) => {
    mutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-screen max-w-[361px] p-8 flex flex-wrap gap-3 justify-center mx-auto"
    >
      <div>
        <label htmlFor="name">Task name</label>
        <input
          type="text"
          id="name"
          className="w-72"
          defaultValue={data.name}
          {...register('name')}
        />
        {errors.name && <p className="text-dark-red">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          className="w-72"
          defaultValue={data.priority ? data.priority : Priority.LOW}
          {...register('priority')}
        >
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
      </div>
      <div>
        <label htmlFor="State">State*</label>
        <select
          id="state"
          className="w-72"
          defaultValue={data.state ? data.state : State.TODO}
          {...register('state')}
        >
          <option value={State.TODO}>To do</option>
          <option value={State.SENT_FOR_REVIEW}>Sent for review</option>
          <option value={State.DONE}>Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="deadline">Due date</label>
        <input
          type="date"
          id="deadline"
          className="w-72 pr-4"
          defaultValue={data.deadline && format(data.deadline, 'yyyy-MM-dd')}
          {...register('deadline')}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="w-72 h-40"
          defaultValue={data.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-dark-red">{errors.description.message}</p>
        )}
      </div>
      <div>
        <button className="bg-default-green w-full" type="submit">
          {'Update'}
        </button>
      </div>
      <div>
        <Link to={backRoute}>
          <button className="text-dark-red text-sm w-fit p-2" type="button">
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
};

export default EditTaskForm;
