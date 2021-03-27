import React from 'react';
import { withRouter, RouteComponentProps, StaticContext } from 'react-router';
import { Link } from 'react-router-dom';

type LocationState = {
  linkInfo?: {
    to: string,
    label: string,
  }
}

const Forbidden: React.FC<RouteComponentProps<{}, StaticContext, LocationState>> = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  return (
    <div className="error-page">
      <h1>許可されていないページです</h1>
      <div className="image forbidden" />
      <div className="message-area">
        <div className="message">
          <span>このページの表示に必要な権限が不足しています。</span>
          <span>ホーム画面に戻り、別の操作を試みてください。</span>
        </div>
      </div>
      <div className="btn-space">
        <Link className="btn" to="/home">ホームへ戻る</Link>
        { props.location.state && props.location.state.linkInfo ? <Link className="btn" to={props.location.state.linkInfo.to}>{props.location.state.linkInfo.label}</Link> : '' }
      </div>
    </div>
  );
}

export default withRouter(Forbidden);
