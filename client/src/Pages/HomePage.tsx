import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {logout} from '../Actions/AuthAction'
import {getUserDetail} from '../Actions/UserAction'

import UserProfile from '../Components/UserProfile'

type State = {
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
}

class HomePage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      userInfo: null
    };
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
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
    console.log(userInfo);
    this.setState({
      userInfo: userInfo
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
    const dom = this.state.userInfo === null ? <span>読み込み中...</span> : <UserProfile userInfo={this.state.userInfo}></UserProfile>
    return (
      <div>
        {dom}
        <button onClick={this.logout}>logout</button>
      </div>
    )
  }
}

export default withRouter(HomePage)
