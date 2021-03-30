import React from 'react';

import goodIcon from '../../image/icooon/good.svg'
import badIcon from '../../image/icooon/bad.svg'
import goodActionIcon from '../../image/icooon/good-action.svg'
import badActionIcon from '../../image/icooon/bad-action.svg'

type Props = {
  tag: TagType | PnetUserListTag;
  loginUserId?: string;
  reactionClick?: (reaction: tagReactionType) => void;
  onClick?: () => void;
}

const isTagType = (tag: TagType | PnetUserListTag): tag is TagType => {
  return typeof tag.good !== "number";
}

const Tag: React.FC<Props> = (props: Props) => {
  const goodUsers = isTagType(props.tag)? props.tag.good.map((v) => {return v.user_id}) : [];
  const badUsers = isTagType(props.tag)? props.tag.bad.map((v) => {return v.user_id}) : [];
  const showGoodIcon = isTagType(props.tag) && props.loginUserId? goodUsers.indexOf(props.loginUserId) >= 0 ? goodActionIcon : goodIcon : goodIcon;
  const showBadIcon = isTagType(props.tag) && props.loginUserId? badUsers.indexOf(props.loginUserId) >= 0 ? badActionIcon : badIcon : badIcon;

  const goodCnt = isTagType(props.tag) ? props.tag.good.length : props.tag.good;
  const badCnt = isTagType(props.tag) ? props.tag.bad.length : props.tag.bad;

  const reactionClick = props.reactionClick ? props.reactionClick : (reaction: tagReactionType) => {};
  const tagClick = props.onClick ? props.onClick : () => {};

  return (
    <span className="pnet-tag">
      <span className={`tag-title ${props.onClick ? 'tag-title-can-click can-click' : ''}`} onClick={() => {tagClick()}}>
        {props.tag.title}
      </span>
      <span className={`reaction good ${props.reactionClick ? 'reaction-can-click can-click' : ''}`} onClick={() => {reactionClick('good')}}>
        <img alt="good" src={showGoodIcon} />
        <span>
          {goodCnt}
        </span>
      </span>
      <span className={`reaction bad ${props.reactionClick ? 'reaction-can-click can-click' : ''}`} onClick={() => {reactionClick('bad')}}>
        <img alt="bad" src={showBadIcon} />
        <span>
          {badCnt}
        </span>
      </span>
    </span>
  )
}

export default Tag;
