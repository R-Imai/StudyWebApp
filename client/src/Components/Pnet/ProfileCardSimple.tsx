import React from 'react';

type Props = {
  profile: PnetProfileCard,
  onClickToProfile?: () => void
}

const ProfileCardSimple: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="pnet-profile-card-simple"
    >
      <div className="left">
        <div className="image">
          <img alt="icon" src={props.profile.image} />
        </div>
        <div className="belong">
          {props.profile.belong}
        </div>
        <div className="name">
          {props.profile.name}
        </div>
        <div className="id">
            @{props.profile.id}
        </div>
      </div>
      <div className="right">
        <div className="intro">
          {props.profile.self_intro.split('\n').map((v, i) => {return <div key={i}>{v}</div>})}
        </div>
        <div className="buttons">
          {props.onClickToProfile ? <button className="to-profile" onClick={props.onClickToProfile}> プロフィールへ </button> : ''}
        </div>
      </div>
    </div>
  )
}

export default ProfileCardSimple
