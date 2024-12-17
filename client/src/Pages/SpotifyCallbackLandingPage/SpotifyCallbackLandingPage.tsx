import { useAuth } from "../../Context/useAuth";
import { useSearchParams } from "react-router-dom";
import { useEffect } from 'react';

const SpotifyCallbackLandingPage = () => {
  const { loginUserWithRedirectToken } = useAuth();
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    let token = searchParams.get('playolaToken');

    if (token) {
      loginUserWithRedirectToken(token);
    }
  }, []);

  
  return (<></>);
}

export default SpotifyCallbackLandingPage;
