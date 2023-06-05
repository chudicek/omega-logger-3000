import { getPriorityColor, getStateColor } from '../commons/Utils';

type TaskCardProps = {
  id: string;
  name: string;
  deadline: string;
  priority: string;
  state: string;
};

const TaskCard = ({
  /*id,*/
  name,
  deadline,
  priority,
  state,
}: TaskCardProps) => {
  return (
    <button className="relative flex justify-between bg-transparent border-2 border-light-grey p-2 pb-0 w-full h-16 mt-2">
      <div className="truncate text-left h-full">
        <h3 className="text-dark-grey truncate">{name}</h3>
        <p className="text-dark-red text-xs">
          {deadline}
          <span
            className={`text-white-smoke ${getPriorityColor(
              priority
            )} rounded-full p-1.5 mx-2`}
          >
            {priority}
          </span>
        </p>
      </div>
      <div
        className={`w-6 h-6 rounded-full my-auto mb-5 shrink-0 ${getStateColor(
          state
        )}`}
      ></div>
    </button>
  );
};

export default TaskCard;
