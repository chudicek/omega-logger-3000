import { FC } from 'react';
import TopBar from '../commons/TopBar';
import EditTaskForm from './EditTaskForm';
import { useLocation, useParams } from 'react-router-dom';

const EditTaskPage: FC = () => {
  const { projectId, taskId } = useParams();
  const location = useLocation();
  const task = location.state?.task;

  return (
    <div>
      <TopBar
        title={'Update Task'}
        backRoute={`/projects/${projectId}/tasks/${taskId}`}
      />
      <EditTaskForm
        name={task.name}
        priority={task.priority}
        state={task.state}
        deadline={new Date(task.deadline)}
        description={task.description}
      />
    </div>
  );
};

export default EditTaskPage;
