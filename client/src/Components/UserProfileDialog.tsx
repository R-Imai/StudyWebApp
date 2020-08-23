import React from 'react';

import UserProfile from './UserProfile'

type Props = {
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  };
  dialogClose: () => void
}

const UserProfileDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog">
      <UserProfile userInfo={props.userInfo}/>
      <div>
        <button onClick={props.dialogClose}>
          close
        </button>
      </div>
    </div>
  );
}

export default UserProfileDialog
