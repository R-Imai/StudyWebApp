import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.scss';
import './Styles/Pnet.scss'
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import RegisterDonePage from './Pages/tempPage/RegisterDonePage';
import PnetUserEditPage from './Pages/tempPage/PnetUserEditPage';
import PnetPage from './Pages/PnetPage';
import PnetListPage from './Pages/PnetListPage';
import ProfileEditPage from './Pages/ProfileEditPage';
import PasswordUpdatePage from './Pages/PasswordUpdatePage';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/register/done" component={RegisterDonePage} />
        <Route exact path="/register" component={RegisterPage}/>
        <Route exact path="/home" component={HomePage}/>
        <Route exact path="/profile/edit" component={ProfileEditPage}/>
        <Route exact path="/password/update" component={PasswordUpdatePage}/>
        <Route exact path="/pnet" component={PnetListPage}/>
        <Route exact path="/pnet/profile" component={PnetPage}/>
        <Route exact path="/pnet/user/info/:id" component={PnetPage}/>
        <Route exact path="/pnet/register" component={PnetUserEditPage}/>
        <Route exact path="/error/401-unauthorized" component={LoginPage}/>
        <Route exact path="/error/403-forbidden" component={HomePage}/>
        <Route exact path="/error/404-notfound" component={HomePage}/>
        <Route exact path="/error/500-internal-server-error" component={HomePage}/>
        <Route exact path="">
          <Redirect to={'/error/404-notfound'}/>
        </Route>
      </Switch>
    </Router>
  )
}

export default Routes;
