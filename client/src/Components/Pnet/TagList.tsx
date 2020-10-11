import React from 'react';
import Tag from './Tag'

type Props = {
  tagList: TagType[],
  loginUserId: string,
  onClickNew: () => void
  reactionClick: (tagInfo: TagType, reaction: tagReactionType) => void
}

const TagList: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-tag-list pnet-detail-contents">
      <span className="title">スキル・特徴</span>
      <div className="main">
        {props.tagList.map((tag) => {return <Tag key={tag.id} tag={tag} loginUserId={props.loginUserId} reactionClick={(reaction: tagReactionType) => {props.reactionClick(tag, reaction)}}/>})}
        <button
          className="add-btn"
          onClick={props.onClickNew}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default TagList;
