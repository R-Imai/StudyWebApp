import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {getUserDetail} from '../Actions/UserAction'
import {getUserList} from '../Actions/PnetAction'

import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'
import ProfileCard from '../Components/Pnet/ProfileCard'


type State = {
  loginUserInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  userList: PnetUserListElem[];
  showIndicator: boolean;
}

class PnetListPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loginUserInfo: null,
      userList: [],
      showIndicator: false
    };
  }

  getToken() {
    const cookies = document.cookie;
    const token = cookies.split(';').find(row => row.startsWith('my-token'))?.split('=')[1];
    return token;
  }

  gotoProfile(userId: string) {
    const url = `/pnet/user/info/${userId}`
    this.props.history.push(url);
  }

  async componentDidMount() {
    this.setState({
      showIndicator: true
    })
    const token = this.getToken()
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    let responce;
    try {
      responce = await Promise.all([
        getUserDetail(token),
        getUserList(token)
      ]);
    }
    catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        this.props.history.push('/error/500-internal-server-error');
        return;
      } else {
        throw e;
      }
    };
    if (!responce) {
      this.props.history.push('/error/500-internal-server-error');
      return
    }

    const loginUserInfo = responce[0];
    const userList = responce[1]

    if (typeof loginUserInfo === 'undefined') {
      this.props.history.push('/error/401-unauthorized');
      return;
    }
    if (typeof userList === 'undefined') {
      this.props.history.push('/error/500-internal-server-error');
      return;
    }

    this.setState({
      loginUserInfo: loginUserInfo,
      userList: userList,
      showIndicator: false
    })
  }

  mkMain() {
    if (this.state.userList === null) {
      return '';
    }
    if (this.state.loginUserInfo === null) {
      return '';
    }

    const cards = this.state.userList.map((v) => {
      return (
        <ProfileCard
          profile={v}
          onClick={() => {this.gotoProfile(v.id)}}
          key={v.id}
        />
      )
    })
    return (
      <div className="cards-area">
        {cards}
      </div>
    )
  }

  render() {
    return (
      <div className="pnet-list-page global-nav-page indicator-parent">
        <GlobalNav userInfo={this.state.loginUserInfo}/>
        {this.mkMain()}
        <Indicator show={this.state.showIndicator} />
      </div>
    )
  }
}

export default withRouter(PnetListPage);
