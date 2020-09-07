import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { sha256 } from 'js-sha256';

import {login} from '../Actions/AuthAction'
import Indicator from '../Components/Indicator'

type State = {
  id: string,
  pass: string,
  isError: boolean,
  errMsg: string,
  showIndicator: boolean
}

class LoginForm extends React.Component<RouteComponentProps , State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      id: '',
      pass: '',
      isError: false,
      errMsg: '',
      showIndicator: false
    };

    this.idChange = this.idChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  idChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      id: e.target.value
    });
  };

  passChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      pass: e.target.value
    });
  };

  async onClickLogin() {
    const id = this.state.id;
    const pass = sha256(this.state.pass);
    this.setState({
      showIndicator: true
    })
    const userInfo = await login(id, pass).catch((e: Error) => {
      console.error(e.message);
      this.setState({
        isError: true,
        errMsg: e.message
      })
    });
    this.setState({
      showIndicator: false
    })
    if (!userInfo) {
      return;
    }
    console.log(userInfo);
    this.props.history.push('/home');
  }

  render() {
    return (
      <form id="login-form" className="indicator-parent">
        <div className="form-style">
          {this.state.isError ? <span style={{color: '#ff0000'}}> {this.state.errMsg} </span> : ''}
          <label
            htmlFor="loginform-id"
            className="label"
            style={{width: '5rem'}}
          >
            ID
          </label>
          <input
            id="loginform-id"
            type="text"
            className="input-form"
            value={this.state.id}
            onChange={this.idChange}
          />
        </div>
        <div className="form-style">
          <label className="label"  style={{width: '5rem'}}>
            パスワード
          </label>
          <input
            type="password"
            className="input-form"
            value={this.state.pass}
            onChange={this.passChange}
          />
        </div>
        <button
          type="button"
          className="login-button"
          onClick={this.onClickLogin}
        >
          ログイン
        </button>
        <Link to="/register">
          <button
            type="button"
            className="register-button"
          >
            アカウント作成
          </button>
        </Link>
        <Indicator show={this.state.showIndicator} />
      </form>
    );
  }
}

export default withRouter(LoginForm)
