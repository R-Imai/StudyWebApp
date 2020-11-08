import React from 'react';

type Props = {
  career: Career,
  onClick: () => void
}

const mkYearMonth = (data: string) => {
  const date = new Date(data);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2)
  return `${year}-${month}`
}

const Career: React.FC<Props> = (props: Props) => {
  return (
    <li
      className="pnet-career"
      onClick={props.onClick}
    >
      <span className="year">
        {mkYearMonth(props.career.year)}
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
