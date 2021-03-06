import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import UserProfileDialog from './UserProfileDialog';
import SettingDialog from './SettingDialog';
import {logout} from '../Actions/AuthAction'
// import appLinkIcon from '../image/icooon/app.svg';
import PnetIcon from '../image/icons/PnetIcon.png';

import {getToken} from '../Utils/utils'

interface Props extends RouteComponentProps {
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  }|null;
}

type State = {
  isShowProfile: boolean;
  isShowSetting: boolean;
}

class GlobalNav extends React.Component<Props , State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isShowProfile: false,
      isShowSetting: false
    };
    this.toHome = this.toHome.bind(this);
    this.profileDialogStateChange = this.profileDialogStateChange.bind(this);
    this.settingDialogStateChange = this.settingDialogStateChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  toHome() {
    this.props.history.push('/home');
  }

  profileDialogStateChange() {
    this.setState({
      isShowProfile: !this.state.isShowProfile
    })
  }

  settingDialogStateChange() {
    this.setState({
      isShowSetting: !this.state.isShowSetting
    })
  }

  async logout() {
    const token = getToken();
    if (!token) {
      this.props.history.push('/login');
      return;
    }
    const responce = await logout(token);
    if (responce.status !== 200) {
      console.error(responce.statusText);
      return;
    }
    document.cookie = 'my-token=; max-age=0; path=/';
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
              <a href="/pnet">
                <img
                  alt="app"
                  src={PnetIcon}
                />
                <span>
                  People Network
                </span>
              </a>
            </li>
            { /**<li className="value">
              <a href="/home">
                <img
                  alt="app"
                  className="app-icon"
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
            </li> */}
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
          onClick={this.settingDialogStateChange}
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
          onClick={this.profileDialogStateChange}
        />
        {this.props.userInfo !== null && this.state.isShowProfile ? <UserProfileDialog userInfo={this.props.userInfo} dialogClose={this.profileDialogStateChange}/>:''}
        {this.state.isShowSetting ? <SettingDialog dialogClose={this.settingDialogStateChange}/>:''}
      </nav>
    );
  }
}

export default withRouter(GlobalNav)
