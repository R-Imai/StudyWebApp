import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {getUserDetail} from '../../Actions/UserAction'
import {getProfile, registerProfile} from '../../Actions/PnetAction'

import GlobalNav from '../../Components/GlobalNav'
import Indicator from '../../Components/Indicator'
import ProfileEdit from '../../Components/Pnet/ProfileEdit'
import Message, {msgType} from '../../Components/Message'

type State = {
  loginUserInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  msgInfo: {
    value: string;
    type: msgType;
  } | null;
  pnetUserInfo: PnetProfileCard | null;
  showIndicator: boolean;
}

class PnetUserEditPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      msgInfo: null,
      loginUserInfo: null,
      pnetUserInfo: null,
      showIndicator: false
    };
    this.goHome = this.goHome.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  getToken() {
    const cookies = document.cookie;
    const token = cookies.split(';').find(row => row.startsWith('my-token'))?.split('=')[1];
    return token;
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
    let loginUserInfo;
    try {
      loginUserInfo = await getUserDetail(token);
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

    if (typeof loginUserInfo === 'undefined') {
      this.props.history.push('/error/401-unauthorized');
      return;
    }

    let isExist:boolean = true;
    try {
      await getProfile(token);
    }
    catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith('【Pnet-E001】')) {
          isExist = false;
        }
      }
    };
    if (isExist) {
      this.props.history.push('/pnet');
      return;
    }

    const userProfile: PnetProfileCard = {
      id: loginUserInfo.id,
      name: loginUserInfo.name,
      name_kana: '',
      belong: '',
      image: loginUserInfo.image,
      self_intro: ''
    }

    this.setState({
      loginUserInfo: loginUserInfo,
      pnetUserInfo: userProfile,
      showIndicator: false
    })
  }

  goHome(){
    this.props.history.push('/home');
  }

  async onClickSubmit(profile: PnetProfileEditInfo) {
    this.setState({
      showIndicator: true
    });
    const token = this.getToken()
    if (!token) {
      this.props.history.push('/error/401-unauthorized');
      return;
    }
    try {
      await registerProfile(token, profile);
    }
    catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        const msgType:msgType = 'error';
        const errInfo = {
          type: msgType,
          value: e.message
        }
        this.setState({
          msgInfo: errInfo,
          showIndicator: false
        });
        return;
      } else {
        throw e;
      }
    };

    this.props.history.push('/pnet');
  }

  mkMain() {
    if (this.state.pnetUserInfo === null) {
      return '';
    }
    if (this.state.loginUserInfo === null) {
      return '';
    }

    return (
      <div>
        {this.state.msgInfo !== null ? <Message value={this.state.msgInfo.value} type={this.state.msgInfo.type} /> : ''}
        <ProfileEdit
          profile={this.state.pnetUserInfo}
          onSubmit={this.onClickSubmit}
          cancelBtnInfo={{
            label: 'ホームへ戻る',
            onClick: this.goHome
          }}
        />
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

export default withRouter(PnetUserEditPage);
