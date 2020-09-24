import React from 'react';

type Props = {
  hobby: Hobby
}

const Tag: React.FC<Props> = (props: Props) => {
  return (
    <li className="pnet-hobby">
      <span className="hobby-title">
        {props.hobby.title}
      </span>
      <span className="detail">
        {props.hobby.detail}
      </span>
    </li>
  )
}

export default Tag;
