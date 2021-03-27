import React from 'react';
import { withRouter, RouteComponentProps, StaticContext } from 'react-router';
import { Link } from 'react-router-dom';


type LocationState = {
  linkInfo?: {
    to: string,
    label: string,
  }
}

const NotFound: React.FC<RouteComponentProps<{}, StaticContext, LocationState>> = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  return (
    <div className="error-page">
      <h1>ページが見つかりませんでした</h1>
      <div className="image not-found" />
      <div className="message-area">
        <div className="message">
          <span>該当のページが見つかりませんでした。</span>
          <span>URLが正しいかどうかをご確認の上、再度アクセスしてください。</span>
          <span>もしくは、ホーム画面に戻ってから再度アクセスを試みてください。</span>
        </div>
      </div>
      <div className="btn-space">
        <Link className="btn" to="/home">ホームへ戻る</Link>
        { props.location.state && props.location.state.linkInfo ? <Link className="btn" to={props.location.state.linkInfo.to}>{props.location.state.linkInfo.label}</Link> : '' }
      </div>
    </div>
  );
}

export default withRouter(NotFound);
