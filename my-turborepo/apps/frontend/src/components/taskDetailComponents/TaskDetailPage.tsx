import TopBar from '../commons/TopBar';
import BottomButton from '../commons/BottomButton';
import { getPriorityColor, getStateColor } from '../commons/Utils';
import TaskUpdateCard from './TaskUpdateCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTaskDetail } from '../../services/TaskApi';

import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../commons/Loading';

const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const { data: task } = useQuery({
    queryKey: ['task', projectId, taskId],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return (await getTaskDetail(projectId!, taskId!, token)).data;
    },
  });

  if (!task) return <Loading />;

  const onEdit = () => {
    navigate(`/projects/${projectId}/tasks/${taskId}/edit`, {
      state: { task },
    });
  };

  return (
    <div>
      <TopBar
        title={task.name}
        subtitle={'Task'}
        backRoute={`/projects/${projectId}`}
        menuItems={[{ name: 'Edit', onClick: onEdit }]}
      />
      <div className="fixed top-0 inset-x-0 w-screen p-4 mt-20 text-dark-grey flex flex-col gap-1">
        <div>
          <span>Start date: </span>
          <span className="text-sand-orange">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span>Due date: </span>
          <span className="text-sand-orange">
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span>Phase: </span>
          <span
            className={`text-white-smoke text-xs ${getStateColor(
              task.state
            )} rounded-full p-1.5 mx-2`}
          >
            {task.state.replace(/_/g, ' ')}
          </span>
        </div>
        <div>
          <span>Priority: </span>
          <span
            className={`text-white-smoke text-xs ${getPriorityColor(
              task.priority
            )} rounded-full p-1.5 mx-2`}
          >
            {task.priority}
          </span>
        </div>
        <div>
          <span>Description: </span>
          <div className="text-sand-orange">{task.description}</div>
        </div>
        <hr className="border-light-grey mt-1 mx-0 w-full" />

        <div className="flex justify-between">
          <h1 className="font-medium text-2xl text-left mt-2">Updates</h1>
        </div>

        <div className="flex flex-col flex-grow gap-1 max-h-[75vh] overflow-y-auto">
          {task.taskUpdates.map((update) => (
            <Link
              to={`/projects/${projectId}/tasks/${taskId}/${update.id}`}
              key={update.id}
            >
              <TaskUpdateCard
                key={update.id}
                name={update.name}
                date={new Date(update.createdAt).toLocaleDateString()}
              />
            </Link>
          ))}
          <div className="h-32 m-32"></div>
        </div>
      </div>
      <Link to={`/projects/${projectId}/tasks/${taskId}/update-create`}>
        <BottomButton text={'Add Update'} />
      </Link>
    </div>
  );
};

export default TaskDetailPage;
