import React from 'react';

type Props = {
  career: Career,
  onClick: () => void
}

const Career: React.FC<Props> = (props: Props) => {
  return (
    <li
      className="pnet-career"
      onClick={props.onClick}
    >
      <span className="year">
        {props.career.year}
      </span>
      <span className="career-title">
        {props.career.title}
      </span>
      <span className="detail">
        {props.career.detail}
      </span>
    </li>
  )
}

export default Career;
