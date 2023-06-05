import TopBar from '../commons/TopBar';
import BottomButton from '../commons/BottomButton';
import TaskCard from './TaskCard';
import { useQuery } from '@tanstack/react-query';
import { getProjectDetail } from '../../services/ProjectApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { TaskBasicModel } from '../../models/ProjectDetailModel';
import sortIcon from '../../assets/images/sort-icon.png';
import { useAuth0 } from '@auth0/auth0-react';
import FilterTasksPanel from './FilterTasksPanel';
import Loading from '../commons/Loading';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return (await getProjectDetail(projectId!, token)).data;
    },
  });

  const [tasks, setTasks] = useState(data?.tasks ?? []);

  useEffect(() => {
    if (data != undefined) {
      setTasks(data.tasks);
    }
  }, [data]);

  const onEdit = () => {
    navigate(`/projects/${projectId}/edit`, { state: { project: data } });
  };

  const onParticipants = () => {
    navigate(`/projects/${projectId}/participants`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <TopBar
        title={data.name}
        subtitle={'Project'}
        backRoute="/projects"
        menuItems={[
          { name: 'Participants', onClick: onParticipants },
          { name: 'Edit', onClick: onEdit },
        ]}
      />
      <div className="fixed top-0 inset-x-0 w-screen p-4 mt-20 text-dark-grey flex flex-col gap-1">
        <div>
          <span>Start date: </span>
          <span className="text-sand-orange">
            {new Date(data.createdAt).toLocaleString()}
          </span>
        </div>
        <div>
          <div>Progress</div>
          <div className="w-full bg-light-grey rounded-full mb-1">
            <ProgressBar progressPercentage={computePercentage(data.tasks)} />
          </div>
        </div>
        <div>
          <div>Description: </div>
          <div className="text-sand-orange">{data.description}</div>
        </div>
        <hr className="border-light-grey mt-1 mx-0 w-full" />

        <div className="flex justify-between">
          <h1 className="font-medium text-2xl text-left mt-2">Tasks</h1>
          <button
            className="bg-transparent p-0 w-fit"
            onClick={() => setShowFilters(!showFilters)}
          >
            <img alt="sort" src={sortIcon} className="w-9 h-9" />
          </button>
        </div>

        {showFilters ? <FilterTasksPanel setTasks={setTasks} /> : <></>}

        <div className="flex flex-col flex-grow gap-1 max-h-[60vh] overflow-y-auto">
          {tasks.map((task) => (
            <Link to={`/projects/${projectId}/tasks/${task.id}`} key={task.id}>
              <TaskCard
                key={task.id}
                id={task.id}
                name={task.name}
                deadline={new Date(task.deadline).toLocaleDateString()}
                priority={task.priority}
                state={task.state}
              />
            </Link>
          ))}
          <div className="h-32 m-32"></div>
        </div>
      </div>
      <Link to={`/projects/${projectId}/task-create`}>
        <BottomButton text={'Add Task'} />
      </Link>
    </div>
  );
};

const computePercentage = (tasks: TaskBasicModel[]) => {
  const [totalWeight, completedWeight] = tasks.reduce(
    (acc, task) => {
      acc[0] += task.weight;
      if (task.state === 'DONE') {
        acc[1] += task.weight;
      }
      return acc;
    },
    [0, 0]
  );
  if (totalWeight === 0) {
    return '0%';
  }
  return `${Math.trunc((completedWeight / totalWeight) * 100)}%`;
};

type ProgressBarProps = {
  progressPercentage: string;
};

const ProgressBar: FC<ProgressBarProps> = ({ progressPercentage }) => {
  if (progressPercentage === '0%') {
    return (
      <div
        className={
          'bg-transparent text-xs font-medium text-dark-grey text-left p-1 leading-none rounded-full'
        }
      >
        0%
      </div>
    );
  }
  return (
    <div
      className={
        'bg-light-orange text-xs font-medium text-dark-grey text-left p-1 leading-none rounded-full'
      }
      style={{ width: progressPercentage }}
    >
      {progressPercentage}
    </div>
  );
};

export default ProjectDetailPage;
