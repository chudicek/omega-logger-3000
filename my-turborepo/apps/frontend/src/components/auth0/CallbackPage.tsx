import { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from './LogoutButton';
import TopBar from '../commons/TopBar';
import { useNavigate } from 'react-router-dom';
import Loading from '../commons/Loading';

const CallbackPage: FC = () => {
  const auth0 = useAuth0();
  const { isLoading, error, user, isAuthenticated } = auth0;
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (!isAuthenticated) {
    return <h1>Not authenticated</h1>;
  }

  const onProjects = () => {
    navigate('/projects');
  };

  return (
    <div>
      <TopBar title={'Profile'} backRoute={'/'} hideBackButton={true} />
      <div className="text-dark-grey text-lg m-8">
        <img src={user?.picture} alt={user?.name} className="pb-2" />
        <p>
          Email: <span className="text-sand-orange">{user?.name}</span>
        </p>
        <button onClick={onProjects} className="my-4">
          Projects
        </button>
        <LogoutButton />
      </div>
    </div>
  );
};

export default CallbackPage;
