import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import defaultIcon from '../image/defaultIcon.png';

import AccountEdit from '../Components/AccountEdit'
import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'
import {profileUpdate, getUserDetail} from '../Actions/UserAction'
import Message, {msgType} from '../Components/Message'
import {getToken} from '../Utils/utils'

type State = {
  id: string;
  name: string;
  image: string;
  email: string;
  imageSrc: string;
  isError: boolean;
  showIndicator: boolean;
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  msgInfo: {
    value: string;
    type: msgType;
  } | null;
}

class ProfileEditPage extends React.Component<RouteComponentProps , State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      id: '',
      name: '',
      image: '',
      email: '',
      imageSrc: defaultIcon,
      isError: false,
      showIndicator: false,
      userInfo: null,
      msgInfo: null
    };

    this.idChange = this.idChange.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.imageChange = this.imageChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.imageClear = this.imageClear.bind(this);
    this.imageDelete = this.imageDelete.bind(this);
    this.register = this.register.bind(this);
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
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      imageSrc: userInfo.image,
      showIndicator: false
    });
  }

  idChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      id: e.target.value
    });
  };

  nameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      name: e.target.value
    });
  };

  emailChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      email: e.target.value
    });
  }

  imageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if(e.target.files !== null){
      reader.onload = (e) => {
        if (e.target !== null && e.target.result !== null) {
          this.setState({
            imageSrc: e.target.result.toString()
          });
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    this.setState({
      image: e.target.value
    });
  }

  imageClear() {
    this.setState({
      imageSrc: this.state.userInfo !== null ? this.state.userInfo.image : defaultIcon,
      image: ''
    });
  }

  imageDelete() {
    this.setState({
      imageSrc: defaultIcon,
      image: ''
    });
  }

  async register() {
    this.setState(({
      showIndicator: true
    }));
    const userInfo = {
      id: this.state.id,
      name: this.state.name,
      image: this.state.imageSrc,
      email: this.state.email,
    }
    const token = getToken();
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    try {
      await profileUpdate(token, userInfo);
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
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        imageSrc: userInfo.image,
        showIndicator: false
      });
    }
    this.setState({
      msgInfo: {
        value: 'プロフィールを更新しました。',
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
    const accountInfo = {
      id: {
        value: this.state.id,
        editable: false,
        onChange: this.idChange
      },
      name: {
        value: this.state.name,
        editable: true,
        onChange: this.nameChange
      },
      email: {
        value: this.state.email,
        editable: true,
        onChange: this.emailChange
      },
      image: {
        value: this.state.image,
        editable: true,
        imageSrc: this.state.imageSrc,
        onChange: this.imageChange,
        imageClear: this.imageClear,
        imageDelete: this.imageDelete
      }
    }
    return (
      <div id="profile-edit-page" className="global-nav-page indicator-parent">
        <GlobalNav userInfo={this.state.userInfo}/>
        <h1>プロフィール更新</h1>
        <div className="main">
          { this.state.msgInfo !== null ? <Message value={this.state.msgInfo.value} type={this.state.msgInfo.type} /> : ''}
          <AccountEdit
            accountInfo={accountInfo}
            submitText="更新"
            onClickSubmit={this.register}
          />
        </div>
        <Indicator show={this.state.showIndicator} />
      </div>
    );
  }
}

export default withRouter(ProfileEditPage)
