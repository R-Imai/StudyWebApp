import React from 'react';
import Tag from './Tag'

type Props = {
  profile: PnetUserListElem,
  onClick: () => void
}

const ProfileCard: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="pnet-profile-card"
      onClick={props.onClick}
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
        <div className="tags">
          {props.profile.tag.map((tag) => {return <Tag key={tag.tag_id} tag={tag} />})}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
