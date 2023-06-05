import { useForm } from 'react-hook-form';
import { TaskBasicModel } from '../../models/ProjectDetailModel';
import { getProjectTasks } from '../../services/ProjectApi';
import { useParams } from 'react-router-dom';

import { useAuth0 } from '@auth0/auth0-react';

type FilterTasksProps = {
  setTasks: (tasks: TaskBasicModel[]) => void;
};

type FilterTasksFormData = {
  searchName: string;
  priorityFilter: string | undefined;
  stateFilter: string | undefined;
  orderBy: string;
};

const FilterTasksPanel = ({ setTasks }: FilterTasksProps) => {
  const { register, handleSubmit } = useForm<FilterTasksFormData>();
  const { projectId } = useParams();

  const { getAccessTokenSilently } = useAuth0();

  const onSubmit = async (data: FilterTasksFormData) => {
    const searchName = data.searchName == undefined ? '' : data.searchName;

    const token = await getAccessTokenSilently();

    const response = await getProjectTasks(
      { jwt: token },
      projectId!,
      data.orderBy,
      searchName,
      data.priorityFilter,
      data.stateFilter
    );
    setTasks(response.data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex mx-auto">
          <input
            className="mx-auto"
            type="text"
            id="searchName"
            placeholder="Search..."
            defaultValue=""
            {...register('searchName')}
          />
        </div>
        <div className="flex mx-auto mt-4">
          <div className="mx-auto">
            <label htmlFor="priorityFilter">Priority:</label>
            <select id="priorityFilter" {...register('priorityFilter')}>
              <option value="">None</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="mx-auto w-52">
            <label htmlFor="stateFilter" className="block">
              State:
            </label>
            <select id="stateFilter" {...register('stateFilter')}>
              <option value="">None</option>
              <option value="TODO">To do</option>
              <option value="SENT_FOR_REVIEW">In review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="mx-auto">
            <label htmlFor="orderBy">Order by:</label>
            <select id="orderBy" {...register('orderBy')}>
              <option value="name">Name</option>
              <option value="createdAt">Created at</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>
        <button className="mt-8 mx-auto bg-default-green w-fit" type="submit">
          Filter
        </button>
      </form>
    </div>
  );
};

export default FilterTasksPanel;
