
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Network, {Node, Edge} from '../Components/Pnet/Network';
import {getToken} from '../Utils/utils'
import {getNetworkRelation} from '../Actions/PnetAction'


type State = {
  nodes: Node[],
  edges: Edge[],
}

class Test extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      nodes: [],
      edges: []
    };
  }

  async componentDidMount() {
    const token = getToken();
    if (!token) {
        this.props.history.push('/error/401-unauthorized');
      return;
    }
    let responce;
    try {
      responce = await getNetworkRelation(token, 'sample')
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
        color: v.id === 'sample' ? '#cc0088' : v.id === 'test_user' ? '#00cc88' : '#555555',
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
      edges
    })
  }

  render() {
    return (
      <div>
        <Network id="network-graph-id" nodes={this.state.nodes} edges={this.state.edges}/>
      </div>
    )
  }
}

export default withRouter(Test);
