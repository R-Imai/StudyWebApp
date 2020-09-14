import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import UserProfileDialog from './UserProfileDialog';
import {logout} from '../Actions/AuthAction'
import appLinkIcon from '../image/icooon/app.svg';

interface Props extends RouteComponentProps {
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  }|null;
}

type State = {
  isShowProfile: boolean
}

class GlobalNav extends React.Component<Props , State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isShowProfile: false
    };
    this.toHome = this.toHome.bind(this);
    this.dialogStateChange = this.dialogStateChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  toHome() {
    this.props.history.push('/home');
  }

  dialogStateChange() {
    this.setState({
      isShowProfile: !this.state.isShowProfile
    })
  }

  async logout() {
    const cookies = document.cookie;
    const token = cookies.split(';').find(row => row.startsWith('my-token'))?.split('=')[1];
    if (!token) {
      this.props.history.push('/login');
      return;
    }
    const responce = await logout(token);
    if (responce.status !== 200) {
      console.error(responce.statusText);
      return;
    }
    document.cookie = "my-token=; max-age=0";
    this.props.history.push('/login');
  }

  render() {
    return (
      <nav className="gloval-nav">
        <button
          className="to-home"
          onClick={this.toHome}
        />
        <div className="accodion">
          <input
            id="accodion-box"
            type="checkbox"
          />
          <label
            htmlFor="accodion-box"
            className="accodion-hook"
          />
          <ul className="accodion-main">
            <li className="value">
              <a href="/home">
                <img
                  alt="app"
                  src={appLinkIcon}
                />
                <span>
                  メニュー1
                </span>
              </a>
            </li>
            <li className="value">
            <a href="/home">
              <img
                alt="app"
                src={appLinkIcon}
              />
              <span>
                メニュー2
              </span>
            </a>
            </li>
            <li className="value">
            <a href="/home">
              <img
                alt="app"
                src={appLinkIcon}
              />
              <span>
                メニュー3
              </span>
            </a>
            </li>
          </ul>
        </div>
        <div className="nav-message">
        </div>
        <button
          className="sqew-button"
        >
          <div className="notice" />
        </button>
        <button
          className="sqew-button"
        >
          <div className="setting" />
        </button>
        <button
          className="sqew-button sqew-button-end"
          onClick={this.logout}
          title="ログアウト"
        >
          <div className="exit" />
        </button>
        <img
          className="profile-icon"
          src={this.props.userInfo !== null ? this.props.userInfo.image : ""}
          alt={this.props.userInfo !== null ? this.props.userInfo.name : ""}
          onClick={this.dialogStateChange}
        />
        {this.props.userInfo !== null && this.state.isShowProfile ? <UserProfileDialog userInfo={this.props.userInfo} dialogClose={this.dialogStateChange}/>:''}
      </nav>
    );
  }
}

export default withRouter(GlobalNav)
