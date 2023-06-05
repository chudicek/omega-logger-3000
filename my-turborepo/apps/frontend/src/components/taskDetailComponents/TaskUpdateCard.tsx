type TaskUpdateCardProps = {
  name: string;
  date: string;
};

const TaskUpdateCard = ({ name, date }: TaskUpdateCardProps) => {
  return (
    <button className="relative flex justify-between font-medium bg-transparent border-2 border-light-grey p-2 w-full h-16 mt-2">
      <h3 className="text-dark-grey text-left my-auto text-xl truncate">
        {name}
      </h3>
      <p className="text-dark-grey text-sm my-auto text-md">{date}</p>
    </button>
  );
};

export default TaskUpdateCard;
