
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Network, {Node, Edge} from '../Network';
import {getToken} from '../../../Utils/utils'
import {getNetworkRelation, getUserInfo} from '../../../Actions/PnetAction'
import ProfileCardSimple from '../ProfileCardSimple'
import ProfileCardShadow from '../ProfileCardShadow'
import Indicator from '../../Indicator'

type State = {
  nodes: Node[],
  edges: Edge[],
  clickUserInfo: PnetUserInfo | null,
  showProfileIndicator: boolean,
  showNetworkIndicator: boolean,
  isInit: boolean,
}

interface Props extends RouteComponentProps {
  userCd1: string,
  userCd2: string,
  onClose: () => void,
}

class NetworkDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nodes: [],
      edges: [],
      clickUserInfo: null,
      showProfileIndicator: false,
      showNetworkIndicator: false,
      isInit: false,
    };
    this.onDblclick = this.onDblclick.bind(this);
    this.onClickToProfile = this.onClickToProfile.bind(this);
  }

  async componentDidMount() {
    this.setState({
      showNetworkIndicator: true,
    });
    const token = getToken();
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    let responce;
    try {
      responce = await getNetworkRelation(token, this.props.userCd2)
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
    const nodes = responce.user_info.map((v): Node => {
      return {
        id: v.id,
        label: v.name,
        color: v.id === this.props.userCd2 ? '#cc0088' : v.id === this.props.userCd1 ? '#00cc88' : '#555555',
        icon: v.icon
      }
    });
    const edges = responce.data.map((v): Edge => {
      return {
        source: v.from_id,
        target: v.to_id,
        cnt: v.cnt
      }
    })
    this.setState({
      nodes,
      edges,
      isInit: true,
      showNetworkIndicator: false,
    })
  }

  async onDblclick(id: string) {
    this.setState({
      showProfileIndicator: true,
    });
    const token = getToken();
    if (!token) {
      this.props.history.push('/error/401-unauthorized');
      return;
    }
    try {
      const userInfo = await getUserInfo(token, id);
      this.setState({
        clickUserInfo: userInfo,
        showProfileIndicator: false,
      })
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
  }

  onClickToProfile() {
    if (!this.state.clickUserInfo) {
      return;
    }
    const url = `/pnet/user/info/${this.state.clickUserInfo.id}`
    window.open(url, "profile") 
  }

  render() {
    return (
      <div className="dialog-parent">
        <div className="pnet-dialog pnet-network-dialog">
          <h1>
            ネットワーク
          </h1>
          <div className="profile-card indicator-parent">
            {this.state.clickUserInfo ? <ProfileCardSimple profile={this.state.clickUserInfo} onClickToProfile={this.onClickToProfile}/> : <ProfileCardShadow msg="ユーザダブルクリックで、プロフィールが表示されます。"/>}
            <Indicator show={this.state.showProfileIndicator} />
          </div>
          <div className="pnet-network-space-dialog indicator-parent">
            {this.state.isInit && this.state.nodes.length === 0 ? <div className="empty-network">関連のあるユーザが存在しません。</div>
            : (
              <Network
                id="network-graph-id"
                nodes={this.state.nodes}
                edges={this.state.edges}
                onDblclick={this.onDblclick}
              />
            )}
            <Indicator show={this.state.showNetworkIndicator} />
          </div>
          <div className="pnet-btn-space">
            <button className="close" onClick={this.props.onClose}>閉じる</button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(NetworkDialog);
