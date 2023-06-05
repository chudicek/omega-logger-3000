import { FC } from 'react';
import workerIcon from '../../assets/images/worker-2.png';
import { LoginButton } from '../auth0/LoginButton';

const LoginPage: FC = () => {
  return (
    <div className="bg-login-background bg-contain md:bg-cover bg-no-repeat w-screen h-screen">
      <div className="bg-white-smoke rounded-t-[35px] absolute inset-x-0 bottom-0 h-[75%] md:h-[50%]">
        <img
          src={workerIcon}
          alt="icon"
          className="h-20 w-20 mx-auto mt-20 mb-5"
        />
        <h1>Construction Diary</h1>
        <LoginButton />
      </div>
    </div>
  );
};

export default LoginPage;
