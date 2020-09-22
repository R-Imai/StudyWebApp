import React from 'react';

import goodIcon from '../../image/icooon/good.svg'
import badIcon from '../../image/icooon/bad.svg'

type Props = {
  tag: Tag
}

const Tag: React.FC<Props> = (props: Props) => {
  return (
    <span className="pnet-tag">
      <span className="tag-title">
        {props.tag.title}
      </span>
      <span className="reaction good">
        <img alt="good" src={goodIcon} />
        <span>
          {props.tag.good.length}
        </span>
      </span>
      <span className="reaction bad">
        <img alt="bad" src={badIcon} />
        <span>
          {props.tag.bad.length}
        </span>
      </span>
    </span>
  )
}

export default Tag;
