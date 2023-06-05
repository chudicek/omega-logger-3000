import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { FC } from 'react';

type Auth0ProviderWithNavigateProps = {
  children: React.ReactNode;
};

export const Auth0ProviderWithNavigate: FC<Auth0ProviderWithNavigateProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN; // todo - add to .env
  const clientId = import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri && audience)) {
    console.error('Missing Auth0 env vars'); // todo remove once working
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
