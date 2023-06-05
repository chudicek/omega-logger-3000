import TopBar from '../commons/TopBar';
import ProjectCard from './ProjectCard';
import BottomButton from '../commons/BottomButton';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '../../services/ProjectApi';

import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../commons/Loading';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, logout } = useAuth0();

  const onSignOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const onProfile = () => {
    navigate(`/callback`);
  };

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return await getAllProjects(token);
    },
  }); // todo maybe useEffect instead -> make dependant on getAccessTokenSilently; see https://developer.auth0.com/resources/guides/spa/react/basic-authentication

  if (!projects) return <Loading />;

  return (
    <div>
      <TopBar
        title={'Projects'}
        hideBackButton={true}
        backRoute={''}
        menuItems={[
          { name: 'Profile', onClick: onProfile },
          { name: 'Sign out', onClick: onSignOut },
        ]}
      />
      <div className="fixed top-0 inset-x-0 flex flex-wrap gap-y-0 gap-x-4 mx-4 mt-20 justify-center max-h-screen overflow-y-auto">
        {projects.data.map((project) => (
          <ProjectCard key={project.id} id={project.id} name={project.name} />
        ))}
        <div className="h-20 m-20 w-screen"></div>
      </div>
      <Link to="/projects/create">
        <BottomButton text="Add Project" />
      </Link>
    </div>
  );
};

export default ProjectsPage;
