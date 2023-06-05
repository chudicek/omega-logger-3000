type ResponseSingle<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};

type ResponseMulti<T> = {
  data: T[];
  status: 'success' | 'error';
  message?: string;
};

export { type ResponseSingle, type ResponseMulti };
