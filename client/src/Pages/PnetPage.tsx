import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {getUserDetail} from '../Actions/UserAction'
import {getProfile, updateProfile} from '../Actions/PnetAction'

import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'
import ProfileCardMini from '../Components/Pnet/ProfileCardMini'
import TagList from '../Components/Pnet/TagList'
import CareerList from '../Components/Pnet/CareerList'
import HobbyList from '../Components/Pnet/HobbyList'
import ProfileEditDialog from '../Components/Pnet/Dialog/ProfileEditDialog'
import Message, {msgType} from '../Components/Message'

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
  pnetUserInfo: PnetUserInfo | null;
  showIndicator: boolean;
  showProfileEdit: boolean;
}

class PnetPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loginUserInfo: null,
      msgInfo: null,
      pnetUserInfo: null,
      showIndicator: false,
      showProfileEdit: false
    };
    this.onClickProfileEdit = this.onClickProfileEdit.bind(this);
    this.closeProfileEditDialog = this.closeProfileEditDialog.bind(this);
    this.submitPeofile = this.submitPeofile.bind(this);
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
    let responce;
    try {
      responce = await Promise.all([
        getUserDetail(token),
        getProfile(token)
      ]);
    }
    catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith('【Pnet-E001】')) {
          console.log('登録画面へ遷移')
          this.props.history.push('/home');
          return;
        }
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
    const userProfile = responce[1]

    if (typeof loginUserInfo === 'undefined') {
      this.props.history.push('/error/401-unauthorized');
      return;
    }
    if (typeof userProfile === 'undefined') {
      this.props.history.push('/error/500-internal-server-error');
      return;
    }

    this.setState({
      loginUserInfo: loginUserInfo,
      pnetUserInfo: userProfile,
      showIndicator: false
    })
  }

  onClickProfileEdit() {
    this.setState({
      showProfileEdit: true
    })
  }

  closeProfileEditDialog(){
    this.setState({
      showProfileEdit: false
    })
  }

  async submitPeofile(profile: PnetProfileEditInfo) {
    this.setState({
      showIndicator: true
    });
    const token = this.getToken()
    if (!token) {
      this.props.history.push('/error/401-unauthorized');
      return;
    }
    try {
      await updateProfile(token, profile);
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
          showProfileEdit: false,
          showIndicator: false
        });
        return;
      } else {
        throw e;
      }
    };

    let pnetProfile: PnetUserInfo
    try {
      pnetProfile = await getProfile(token);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        this.props.history.push('/error/500-internal-server-error');
        return;
      } else {
        throw e;
      }
    }

    const msgType:msgType = 'info';
    const msgInfo = {
      type: msgType,
      value: 'プロフィールを更新しました。'
    }
    this.setState({
      msgInfo: msgInfo,
      pnetUserInfo: pnetProfile,
      showProfileEdit: false,
      showIndicator: false
    });
    setTimeout(() => {
      this.setState({
        msgInfo: null
      })
    }, 5000);
  }

  mkMain() {
    if (this.state.pnetUserInfo === null) {
      return '';
    }
    if (this.state.loginUserInfo === null) {
      return '';
    }

    const dialog = this.state.showProfileEdit
      ? (
          <ProfileEditDialog
            profile={this.state.pnetUserInfo}
            onClose={this.closeProfileEditDialog}
            onSubmit={this.submitPeofile}
          />
        )
      : '';
    return (
      <div className="pnet-main">
        {this.state.msgInfo !== null ? <Message value={this.state.msgInfo.value} type={this.state.msgInfo.type} /> : ''}
        <ProfileCardMini
          profile={this.state.pnetUserInfo}
          canEdit={this.state.pnetUserInfo.id === this.state.loginUserInfo.id}
          onClickEdit={this.onClickProfileEdit}
        />
        <TagList tagList={this.state.pnetUserInfo.tag} />
        <HobbyList hobbyList={this.state.pnetUserInfo.hobby}/>
        <CareerList careerList={this.state.pnetUserInfo.career} />

        {dialog}
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
