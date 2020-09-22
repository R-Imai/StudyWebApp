import React from 'react';

type Props = {
  profile: PnetProfile
}

const ProfileCardMini: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-profile-card-mini">
      <div className="profile-image">
        <img alt="icon" src={props.profile.image} />
      </div>
      <div className="profile-info">
        <div className="rows belong">
          {props.profile.belong}
        </div>
        <div className="rows name">
          {props.profile.name}
        </div>
        <div className="rows sub">
          <span>
            {props.profile.name_kana}
          </span>
          <span>
            @{props.profile.id}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCardMini
