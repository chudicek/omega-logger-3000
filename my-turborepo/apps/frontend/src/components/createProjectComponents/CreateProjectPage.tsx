import { FC } from 'react';
import TopBar from '../commons/TopBar';
import CreateProjectForm from './CreateProjectForm';

const CreateProjectPage: FC = () => {
  return (
    <div>
      <TopBar title={'Create Project'} backRoute="/projects" />
      <CreateProjectForm />
    </div>
  );
};

export default CreateProjectPage;
