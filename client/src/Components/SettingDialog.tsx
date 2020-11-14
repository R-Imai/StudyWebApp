import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps {
  dialogClose: () => void;
}

const toProfileEdit = (props: Props) => {
  props.history.push('/profile/edit');
}

const toPasswordUpdate = (props: Props) => {
  props.history.push('/password/update');
}

const SettingDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog setting-dialog">
      <button className="link-btn" onClick={() => {toProfileEdit(props)}}>
        プロフィール更新
      </button>
      <button className="link-btn" onClick={() => {toPasswordUpdate(props)}}>
        パスワード変更
      </button>
      <button className="close-btn" onClick={props.dialogClose}>
        閉じる
      </button>
    </div>
  );
}

export default withRouter(SettingDialog);
