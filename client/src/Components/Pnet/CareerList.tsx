import React from 'react';
import Career from './Career'

type Props = {
  careerList: Career[]
}

const CareerList: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-career-list">
      <span className="title">経歴</span>
      <ul className="main">
        {props.careerList.map((career) => {return <Career key={career.history_id} career={career} />})}
      </ul>
    </div>
  )
}

export default CareerList;
