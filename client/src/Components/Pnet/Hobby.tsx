import React from 'react';

type Props = {
  hobby: Hobby,
  onClick: () => void
}

const Hobby: React.FC<Props> = (props: Props) => {
  return (
    <li
      className="pnet-hobby"
      onClick={props.onClick}
    >
      <span className="hobby-title">
        {props.hobby.title}
      </span>
      <span className="detail">
        {props.hobby.detail}
      </span>
    </li>
  )
}

export default Hobby;
