import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import UserProfileDialog from './UserProfileDialog'

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
  }

  toHome() {
    this.props.history.push('/home');
  }

  dialogStateChange() {
    this.setState({
      isShowProfile: !this.state.isShowProfile
    })
  }

  render() {
    return (
      <nav className="gloval-nav">
        <div
          className="to-home"
          onClick={this.toHome}
        >
          WebApp
        </div>
        <div className="link-list">
          <div className="link-val">aaaaaaaaaaaaaaa</div>
          <div className="link-val">bbb</div>
          <div className="link-val">ccc</div>
        </div>
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
