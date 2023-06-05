import { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton: FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex justify-center m-4">
      <button className="w-fit" onClick={() => loginWithRedirect()}>
        Sign In
      </button>
    </div>
  );
};

export { LoginButton };
