import React from 'react';
import { withRouter, RouteComponentProps, StaticContext } from 'react-router';

type LocationState = {
  id: string,
  name: string
}

const RegisterDonePage: React.FC<RouteComponentProps<{}, StaticContext, LocationState>> = (props: RouteComponentProps<{}, StaticContext, LocationState>) => {
  if (typeof props.location.state === 'undefined' || props.location.state === null) {
    props.history.push('/login');
    return (<div/>);
  };
  const name = props.location.state.name;
  const id = props.location.state.id;
  return (
    <div id="register-done-page">
      <h1>
        ようこそ!
      </h1>
      <div className="main-space">
        <span className="text-line"><span className="bold">{name}</span>さんのユーザ登録が完了しました!</span>
        <span className="text-line">ログインすることで、サービスを利用できます。</span>
        <span className="text-line id-space">登録されたID: {id}</span>
        <button
          type="button"
          onClick={() => {props.history.push('/login')}}
          className="to-login-button"
        >
          ログインページへ
        </button>
      </div>
    </div>
  );
}

export default withRouter(RegisterDonePage)
