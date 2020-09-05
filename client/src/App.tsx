import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.scss';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
      <Route exact path="/login" component={LoginPage}/>
      <Route exact path="/register" component={RegisterPage}/>
      <Route exact path="/home" component={HomePage}/>
        <Route exact path="">
          <Redirect to={'/login'}/>
        </Route>
      </Switch>
    </Router>
  )
}

export default Routes;
