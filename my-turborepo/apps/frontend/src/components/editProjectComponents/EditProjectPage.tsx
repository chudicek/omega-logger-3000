import { FC } from 'react';
import TopBar from '../commons/TopBar';
import EditProjectForm from './EditProjectForm';
import { useLocation, useParams } from 'react-router-dom';

const EditProjectPage: FC = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const project = location.state?.project;

  return (
    <div>
      <TopBar title={'Update Project'} backRoute={`/projects/${projectId}`} />
      <EditProjectForm name={project.name} description={project.description} />
    </div>
  );
};

export default EditProjectPage;
