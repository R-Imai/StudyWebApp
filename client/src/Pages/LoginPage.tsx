import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { sha256 } from 'js-sha256';

import {login} from '../Actions/AuthAction'

type State = {
  id: string,
  pass: string
}

class LoginPage extends React.Component<RouteComponentProps , State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      id: '',
      pass: ''
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
    const userInfo = await login(id, pass).catch((e: Error) => {
      console.error(e.message);
    });
    if (!userInfo) {
      return;
    }
    console.log(userInfo);
    this.props.history.push('/home');
  }

  render() {
    return (
      <form style={{width: '200rem'}}>
        <div>
          <label className="form-label" style={{width: '5rem'}}>
            ID
          </label>
          <input
            type="text"
            value={this.state.id}
            onChange={this.idChange}
          />
        </div>
        <div>
          <label className="form-label"  style={{width: '5rem'}}>
            パスワード
          </label>
          <input
            type="password"
            value={this.state.pass}
            onChange={this.passChange}
          />
        </div>
        <button
          type="button"
          onClick={this.onClickLogin}
        >
          ログイン
        </button>
      </form>
    );
  }
}

export default withRouter(LoginPage)
