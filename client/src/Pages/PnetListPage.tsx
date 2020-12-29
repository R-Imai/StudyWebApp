import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {getUserDetail} from '../Actions/UserAction'
import {getUserList, getProfile} from '../Actions/PnetAction'

import GlobalNav from '../Components/GlobalNav'
import Indicator from '../Components/Indicator'
import ProfileCard from '../Components/Pnet/ProfileCard'
import {getToken} from '../Utils/utils'


type State = {
  loginUserInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  } | null;
  userList: PnetUserListElem[];
  showIndicator: boolean;
  pageOffset: number;
  allDataCnt: number;
}

const checkHeight = () => {
  const height = document.documentElement.clientHeight;

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollPosition = height + scrollTop;
  const proximity = 0;

  return (scrollHeight - scrollPosition) / scrollHeight <= proximity;
}

const PAGE_UNIT = 3

class PnetListPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loginUserInfo: null,
      userList: [],
      showIndicator: false,
      pageOffset: 0,
      allDataCnt: 0
    };
    this.scrollEvent = this.scrollEvent.bind(this);
    this.getData = this.getData.bind(this);
  }

  gotoProfile(userId: string) {
    const url = `/pnet/user/info/${userId}`
    this.props.history.push(url);
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
    let responce;
    try {
      responce = await Promise.all([
        getUserDetail(token),
        getUserList(token, PAGE_UNIT, this.state.pageOffset),
        getProfile(token)
      ]);
    }
    catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith('【Pnet-E001】')) {
          this.props.history.push('/pnet/register');
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
    const userList = responce[1]

    if (typeof loginUserInfo === 'undefined') {
      this.props.history.push('/error/401-unauthorized');
      return;
    }
    if (typeof userList === 'undefined') {
      this.props.history.push('/error/500-internal-server-error');
      return;
    }

    // スクロールイベントを定義
    window.addEventListener('scroll', this.scrollEvent)

    this.setState({
      loginUserInfo: loginUserInfo,
      userList: userList.data,
      allDataCnt: userList.cnt,
      showIndicator: false,
      pageOffset: this.state.pageOffset + PAGE_UNIT
    })

    // 初期表示時にまだ取得する場合
    this.scrollEvent();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollEvent);
  }

  async getData() {
    if (this.state.pageOffset > this.state.allDataCnt){
      return;
    }
    const token = getToken();
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    const getData = await getUserList(token, PAGE_UNIT, this.state.pageOffset);
    const userList = this.state.userList.concat(getData.data);
    this.setState({
      userList: userList,
      allDataCnt: getData.cnt,
      pageOffset: this.state.pageOffset + PAGE_UNIT
    })
  }

  scrollEvent() {
    if (checkHeight()) {
      this.getData();
    }
  }

  mkMain() {
    if (this.state.userList === null) {
      return '';
    }
    if (this.state.loginUserInfo === null) {
      return '';
    }

    const loginUserInfo = this.state.loginUserInfo

    const myInfo = this.state.userList.find((v) => {return v.id === loginUserInfo.id});
    const userList = this.state.userList.filter((v) => {return  v.id !== loginUserInfo.id});

    const cards = userList.map((v) => {
      return (
        <ProfileCard
          profile={v}
          onClick={() => {this.gotoProfile(v.id)}}
          key={v.id}
        />
      )
    })
    if (typeof myInfo !== 'undefined') {
      cards.unshift(
        <ProfileCard
          profile={myInfo}
          onClick={() => {this.gotoProfile(myInfo.id)}}
          key={myInfo.id}
          cardStyle="own"
        />
      )
    }
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
        <h1> ユーザ一覧 </h1>
        {this.mkMain()}
        <Indicator show={this.state.showIndicator} />
      </div>
    )
  }
}

export default withRouter(PnetListPage);
