import React from 'react';

type Props = {
  profile: PnetProfileCard,
  canEdit?: boolean,
  onClickEdit?: () => void
}

const ProfileCardMini: React.FC<Props> = (props: Props) => {
  const editBtn = props.canEdit && typeof props.onClickEdit !== "undefined" ? (
    <button
      className="edit"
      onClick={props.onClickEdit}
    />
  ) : '';
  return (
    <div className="pnet-profile-card-mini">
      <div className="info">
        <div className="profile-image">
          <img alt="icon" src={props.profile.image} />
        </div>
        <div className="profile-info">
          <div className="rows belong">
            {props.profile.belong}
          </div>
          <div className="rows name">
            <span>
              {props.profile.name}
            </span>
            {editBtn}
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
      <div className="intro">
        {props.profile.self_intro.split('\n').map((v, i) => {return <div key={i}>{v}</div>})}
      </div>
    </div>
  )
}

export default ProfileCardMini
