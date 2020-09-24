import React from 'react';
import Tag from './Tag'

type Props = {
  tagList: Tag[]
}

const TagList: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-tag-list">
      <span className="title">スキル・特徴</span>
      <div className="main">
        {props.tagList.map((tag) => {return <Tag key={tag.id} tag={tag} />})}
      </div>
    </div>
  )
}

export default TagList;
