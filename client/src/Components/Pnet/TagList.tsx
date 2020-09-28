import React from 'react';
import Tag from './Tag'

type Props = {
  tagList: Tag[],
  loginUserId: string,
  onClickNew: () => void
  reactionClick: (tagInfo: Tag, reaction: tagReactionType) => void
}

const TagList: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-tag-list">
      <span className="title">スキル・特徴</span>
      <div className="main">
        {props.tagList.map((tag) => {return <Tag key={tag.id} tag={tag} loginUserId={props.loginUserId} reactionClick={(reaction: tagReactionType) => {props.reactionClick(tag, reaction)}}/>})}
        <button
          className="tag-add"
          onClick={props.onClickNew}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default TagList;
