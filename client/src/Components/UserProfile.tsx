import React from 'react';

type Props = {
  userInfo: {
    id: string;
    name: string;
    image: string;
    email: string;
  };
}

const UserProfile: React.FC<Props> = (props: Props) => {
  return (
    <div className="profile">
      <img alt={props.userInfo.id} src={props.userInfo.image} className="icon" />
      <div className="id"> @{props.userInfo.id} </div>
      <div className="name"> {props.userInfo.name} </div>
      <div> {props.userInfo.email} </div>
    </div>
  );
}

export default UserProfile
