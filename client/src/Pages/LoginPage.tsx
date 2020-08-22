import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import LoginForm from '../Components/LoginForm'

const LoginPage: React.FC<RouteComponentProps> = () => {
  return (
    <div id="login-page">
      <LoginForm />
    </div>
  );
}

export default withRouter(LoginPage)
