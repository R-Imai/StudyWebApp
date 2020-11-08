import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {getUserDetail} from '../Actions/UserAction'
import PnetIcon from '../image/icons/PnetIcon.png'

import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'

type State = {
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  showIndicator: boolean;
}

class HomePage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      userInfo: null,
      showIndicator: false
    };
  }

  async componentDidMount() {
    this.setState({
      showIndicator: true
    })
    const cookies = document.cookie;
    const token = cookies.split(';').find(row => row.startsWith('my-token'))?.split('=')[1];
    if (!token) {
        this.props.history.push('/login');
      return;
    }
    const userInfo = await getUserDetail(token).catch((e: Error) => {
      console.error(e.message);
      this.props.history.push('/login');
      return;
    });
    if (!userInfo) {
      this.props.history.push('/login');
      return;
    }
    this.setState({
      userInfo: userInfo,
      showIndicator: false
    })
  }

  render() {
    const txt = this.state.userInfo === null ? '' : `ようこそ ${this.state.userInfo.name} さん`
    return (
      <div className="global-nav-page indicator-parent">
        <GlobalNav userInfo={this.state.userInfo}/>
        <div>{txt}</div>
        <div className="home-app-list">
          <a className="icon-btn" href="/pnet">
            <img src={PnetIcon} height={120} width={120} alt="people network"/>
          </a>
        </div>
        <Indicator show={this.state.showIndicator} />
      </div>
    )
  }
}

export default withRouter(HomePage)
