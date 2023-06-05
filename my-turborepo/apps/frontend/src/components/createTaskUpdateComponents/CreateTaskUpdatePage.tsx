import { FC } from 'react';
import TopBar from '../commons/TopBar';
import CreateTaskUpdateForm from './CreateTaskUpdateForm';
import { useParams } from 'react-router-dom';

const CreateTaskUpdatePage: FC = () => {
  const { projectId, taskId } = useParams();
  const backRoute = `/projects/${projectId}/tasks/${taskId}`;
  return (
    <div>
      <TopBar title={'Create Task Update'} backRoute={backRoute} />
      <CreateTaskUpdateForm projectId={projectId ?? ''} taskId={taskId ?? ''} />
    </div>
  );
};

export default CreateTaskUpdatePage;
