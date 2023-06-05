import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FC } from 'react';
import Loading from '../commons/Loading';

type AuthenticationGuardProps<P> = {
  component: React.ComponentType<P>;
};

export const AuthenticationGuard: FC<AuthenticationGuardProps<any>> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <Loading />
      </div>
    ),
  });

  return <Component />;
};
