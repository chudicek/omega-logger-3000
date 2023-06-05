import { FC } from 'react';
import TopBar from '../commons/TopBar';
import CreateTaskForm from './CreateTaskForm';
import { MenuItem } from '../commons/TopBar';
import { useParams } from 'react-router-dom';
import { type Priority } from '../../models/Priority';

export type CreateEditTaskPageProps = {
  name?: string;
  priority?: Priority;
  deadline?: Date;
  description?: string;
  menuItems?: MenuItem[];
};

const CreateTaskPage: FC<CreateEditTaskPageProps> = (props) => {
  const { projectId } = useParams();
  return (
    <div>
      <TopBar
        title={'Create Task'}
        backRoute={`/projects/${projectId}`}
        menuItems={props.menuItems}
      />
      <CreateTaskForm />
    </div>
  );
};

export default CreateTaskPage;
