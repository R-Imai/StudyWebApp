import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { sha256 } from 'js-sha256';

import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'
import {UserInfo, getUserDetail} from '../Actions/UserAction'
import {updatePassword} from '../Actions/AuthAction'
import Message, {msgType} from '../Components/Message'
import PasswordUpdateForm from '../Components/PasswordUpdateForm'
import {getToken} from '../Utils/utils'

type State = {
  showIndicator: boolean;
  userInfo: UserInfo | null;
  currentPass: string,
  newPass1: string,
  newPass2: string,
  msgInfo: {
    value: string;
    type: msgType;
  } | null;
}

class PasswordUpdatePage extends React.Component<RouteComponentProps , State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      showIndicator: false,
      userInfo: null,
      currentPass: '',
      newPass1: '',
      newPass2: '',
      msgInfo: null
    };

    this.onchangeCurrentPass = this.onchangeCurrentPass.bind(this);
    this.onchangeNewPass1 = this.onchangeNewPass1.bind(this);
    this.onchangeNewPass2 = this.onchangeNewPass2.bind(this);
    this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    this.setState({
      showIndicator: true
    })
    const token = getToken();
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    const userInfo = await getUserDetail(token).catch((e: Error) => {
      console.error(e.message);
      this.props.history.push('/error/401-unauthorized');
      return;
    });
    if (!userInfo) {
      this.props.history.push('/error/401-unauthorized');
      return;
    };
    this.setState({
      userInfo: userInfo,
      showIndicator: false
    });
  }

  onchangeCurrentPass(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      currentPass: e.target.value
    });
  }

  onchangeNewPass1(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newPass1: e.target.value
    });
  }

  onchangeNewPass2(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newPass2: e.target.value
    });
  }

  async submit() {
    this.setState(({
      showIndicator: true
    }));
    if (!this.state.userInfo) {
      this.props.history.push('/error/500-internal-server-error');
      return;
    };
    const passwordInfo = {
      id: this.state.userInfo.id,
      current_password: sha256(this.state.currentPass),
      new_password: sha256(this.state.newPass1)
    }
    const token = getToken();
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    try {
      await updatePassword(token, passwordInfo);
    }
    catch (e) {
      this.setState({
        msgInfo: {
          value: e.message,
          type: 'error'
        }
      });
      return;
    }
    finally {
      this.setState({
        showIndicator: false
      });
    }
    this.setState({
      currentPass: '',
      newPass1: '',
      newPass2: '',
      msgInfo: {
        value: 'パスワードを更新しました。',
        type: 'info'
      }
    });
    setTimeout(() => {
      this.setState({
        msgInfo: null
      })
    }, 5000);
  }

  render() {
    const formData = {
      currentPass: {
        value: this.state.currentPass,
        editable: true,
        onChange: this.onchangeCurrentPass
      },
      newPass1: {
        value: this.state.newPass1,
        editable: true,
        onChange: this.onchangeNewPass1
      },
      newPass2: {
        value: this.state.newPass2,
        editable: true,
        onChange: this.onchangeNewPass2
      }
    }
    return (
      <div id="password-update-page" className="global-nav-page indicator-parent">
        <GlobalNav userInfo={this.state.userInfo}/>
        <h1>パスワード変更</h1>
        <div className="main">
          { this.state.msgInfo !== null ? <Message value={this.state.msgInfo.value} type={this.state.msgInfo.type} /> : ''}
          <PasswordUpdateForm formData={formData} onClickSubmit={this.submit} />
        </div>
        <Indicator show={this.state.showIndicator} />
      </div>
    );
  }
}

export default withRouter(PasswordUpdatePage)
