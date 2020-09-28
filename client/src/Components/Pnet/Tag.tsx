import React from 'react';

import goodIcon from '../../image/icooon/good.svg'
import badIcon from '../../image/icooon/bad.svg'
import goodActionIcon from '../../image/icooon/good-action.svg'
import badActionIcon from '../../image/icooon/bad-action.svg'

type Props = {
  tag: Tag;
  loginUserId: string;
  reactionClick: (reaction: tagReactionType) => void;
}

const Tag: React.FC<Props> = (props: Props) => {
  const goodUsers = props.tag.good.map((v) => {return v.user_id});
  const badUsers = props.tag.bad.map((v) => {return v.user_id});
  const showGoodIcon = goodUsers.indexOf(props.loginUserId) >= 0 ? goodActionIcon : goodIcon;
  const showBadIcon = badUsers.indexOf(props.loginUserId) >= 0 ? badActionIcon : badIcon;
  return (
    <span className="pnet-tag">
      <span className="tag-title">
        {props.tag.title}
      </span>
      <span className="reaction good" onClick={() => {props.reactionClick('good')}}>
        <img alt="good" src={showGoodIcon} />
        <span>
          {props.tag.good.length}
        </span>
      </span>
      <span className="reaction bad" onClick={() => {props.reactionClick('bad')}}>
        <img alt="bad" src={showBadIcon} />
        <span>
          {props.tag.bad.length}
        </span>
      </span>
    </span>
  )
}

export default Tag;
