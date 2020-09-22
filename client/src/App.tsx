import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.scss';
import './Styles/Pnet.scss'
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import RegisterDonePage from './Pages/RegisterDonePage';
import PnetPage from './Pages/PnetPage';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/register/done" component={RegisterDonePage} />
        <Route exact path="/register" component={RegisterPage}/>
        <Route exact path="/home" component={HomePage}/>
        <Route exact path="/pnet" component={PnetPage}/>
        <Route exact path="">
          <Redirect to={'/login'}/>
        </Route>
      </Switch>
    </Router>
  )
}

export default Routes;
