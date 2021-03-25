import React from 'react';

type Props = {
  msg?: string,
  onClick?: () => void,
}

const ProfileCardShadow: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="pnet-profile-card-shadow"
      onClick={props.onClick}
    >
      <div className="left">
        <div className="image">
          <div className="img" />
        </div>
        <div className="belong">
          <span className="shadow" />
        </div>
        <div className="name">
          <span className="shadow" />
        </div>
        <div className="id">
          <span className="shadow" />
        </div>
      </div>
      <div className="right">
        <div className="intro" />
        <div className="buttons" />
      </div>
      {props.msg ? <div className="msg">{props.msg}</div> : ''} 
    </div>
  )
}

export default ProfileCardShadow
