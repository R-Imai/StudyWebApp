import React from 'react';
import { withRouter, RouteComponentProps, StaticContext } from 'react-router';
import { Link } from 'react-router-dom';

type LocationState = {
  linkInfo?: {
    to: string,
    label: string,
  }
}

const InternalServerError: React.FC<RouteComponentProps<{}, StaticContext, LocationState>> = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  return (
    <div className="error-page">
      <h1>予期せぬエラーが発生しました</h1>
      <div className="image server-error" />
      <div className="message-area">
        <div className="message">
          <span>申し訳ありません。予期せぬエラーが発生しました。</span>
          <span>お手数ですが、再度操作をやり直してください。</span>
          <span>改善されない場合は、管理者へご連絡ください。</span>
        </div>
      </div>
      <div className="btn-space">
        <Link className="btn" to="/home">ホームへ戻る</Link>
        { props.location.state && props.location.state.linkInfo ? <Link className="btn" to={props.location.state.linkInfo.to}>{props.location.state.linkInfo.label}</Link> : '' }
      </div>
    </div>
  );
}

export default withRouter(InternalServerError);
