import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {getUserDetail} from '../Actions/UserAction'
import {getProfile} from '../Actions/PnetAction'

import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'
import ProfileCardMini from '../Components/Pnet/ProfileCardMini'
import SelfIntro from '../Components/Pnet/SelfIntro'
import TagList from '../Components/Pnet/TagList'


type State = {
  loginUserInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  pnetUserInfo: PnetUserInfo | null;
  showIndicator: boolean;
}

class PnetPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loginUserInfo: null,
      pnetUserInfo: null,
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
    let responce;
    try {
      responce = await Promise.all([
        getUserDetail(token),
        getProfile(token)
      ]);
    }
    catch (e) {
      if (e.message.startsWith('【Pnet-E001】')) {
        console.log('登録画面へ遷移')
        this.props.history.push('/home');
        return;
      }
      console.error(e.message);
      this.props.history.push('/login');
      return;
    };
    if (!responce) {
      this.props.history.push('/login');
      return
    }

    const loginUserInfo = responce[0];
    const userProfile = responce[1]

    if (typeof loginUserInfo === 'undefined') {
      this.props.history.push('/login');
      return;
    }
    if (typeof userProfile === 'undefined') {
      this.props.history.push('/home');
      return;
    }

    this.setState({
      loginUserInfo: loginUserInfo,
      pnetUserInfo: userProfile,
      showIndicator: false
    })
  }

  mkMain() {
    if (this.state.pnetUserInfo === null) {
      return '';
    }
    return (
      <div>
        <ProfileCardMini profile={this.state.pnetUserInfo} />
        <SelfIntro selfIntro={this.state.pnetUserInfo.self_intro} />
        <TagList tagList={this.state.pnetUserInfo.tag} />
      </div>
    )
  }

  render() {
    return (
      <div className="global-nav-page indicator-parent">
        <GlobalNav userInfo={this.state.loginUserInfo}/>
        {this.mkMain()}
        <Indicator show={this.state.showIndicator} />
      </div>
    )
  }
}

export default withRouter(PnetPage)
