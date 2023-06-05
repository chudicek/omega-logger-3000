import { useNavigate, useParams } from 'react-router-dom';
import TopBar from './TopBar';

const DeletePage = () => {
  const { projectId, taskId, taskUpdateId } = useParams();
  const navigate = useNavigate();

  let objectToDelete: string;
  let backRouteAfterDelete: string;
  let backRoute: string;
  if (taskUpdateId !== undefined) {
    objectToDelete = 'task update';
    backRoute = `/projects/${projectId}/tasks/${taskId}/${taskUpdateId}`;
    backRouteAfterDelete = `/projects/${projectId}/tasks`;
  } else if (taskId !== undefined) {
    objectToDelete = 'task';
    backRoute = `/projects/${projectId}/tasks/${taskId}`;
    backRouteAfterDelete = `/projects/${projectId}`;
  } else if (projectId !== undefined) {
    objectToDelete = 'project';
    backRoute = `/projects/${projectId}`;
    backRouteAfterDelete = `/projects`;
  } else {
    objectToDelete = 'object';
    backRoute = '/projects';
    backRouteAfterDelete = '/projects';
  }

  const onDelete = () => {
    navigate(backRouteAfterDelete);
  };

  const onCancel = () => {
    navigate(backRoute);
  };

  return (
    <div>
      <TopBar title={''} backRoute={backRoute} />
      <div className="flex flex-wrap m-4 gap-3 justify-center">
        <h2 className="text-dark-grey">{`Are you sure you want to delete this ${objectToDelete}?`}</h2>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onCancel} className="bg-transparent text-dark-red">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePage;
