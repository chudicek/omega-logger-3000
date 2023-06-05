import { useParams } from 'react-router-dom';
import TopBar from '../commons/TopBar';
import { useQuery } from '@tanstack/react-query';
import { getTaskUpdateDetail } from '../../services/TaskUpdateApi';

import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../commons/Loading';

const TaskUpdateDetailPage = () => {
  const { projectId, taskId, taskUpdateId } = useParams();
  const backRoute = `/projects/${projectId}/tasks/${taskId}`;

  const { getAccessTokenSilently } = useAuth0();

  const { data: taskUpdate } = useQuery({
    queryKey: ['taskUpdate', projectId, taskId, taskUpdateId],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return (
        await getTaskUpdateDetail(projectId!, taskId!, taskUpdateId!, token)
      ).data;
    },
  });

  if (!taskUpdate) return <Loading />;

  return (
    <div>
      <TopBar
        title={taskUpdate.name}
        backRoute={backRoute}
        subtitle={'Task Update'}
      />
      <div className="fixed top-0 inset-x-0 w-screen p-4 mt-20 text-dark-grey flex flex-col gap-1">
        <div>
          <span>Date: </span>
          <span className="text-sand-orange">
            {new Date(taskUpdate.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span>Time: </span>
          <span className="text-sand-orange">
            {new Date(taskUpdate.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <div>
          <span>Description: </span>
          <div className="text-sand-orange max-h-screen overflow-y-auto">
            <p>{taskUpdate.content}</p>
            <div className="h-20 m-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskUpdateDetailPage;
