import { Link } from 'react-router-dom';

type ProjectCardProps = {
  id: string;
  name: string;
};

const ProjectCard = ({ id, name }: ProjectCardProps) => {
  return (
    <Link to={`/projects/${id}`}>
      <button className="relative bg-transparent border-2 border-light-grey text-dark-grey p-1 w-24 lg:w-52 h-24 mt-4 truncate">
        {name}
        <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-default-green bg-default-green"></span>
      </button>
    </Link>
  );
};

export default ProjectCard;
