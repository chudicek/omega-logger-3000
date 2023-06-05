import { FC } from 'react';
// forms
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
// import api from "../../api/api";

const LoginForm: FC = () => {
  type LoginFormData = {
    username: string;
    password: string;
  };
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    navigate('/projects/');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-screen max-w-[462px] p-8 flex flex-wrap gap-3 justify-center mx-auto"
    >
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="w-full"
          {...register('username')}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="w-full"
          {...register('password')}
        />
      </div>
      <div>
        <button className="bg-default-green w-full" type="submit">
          Sign in
        </button>
      </div>
      <div>
        <p className="text-dark-grey text-sm">Or Sign up With</p>
      </div>
      <div>
        <Link to="/signup">
          <button className="bg-default-green w-full" type="button">
            Sign Up
          </button>
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
