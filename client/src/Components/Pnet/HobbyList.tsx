import React from 'react';
import Hobby from './Hobby'

type Props = {
  hobbyList: Hobby[]
}

const HobbyList: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-hobby-list">
      <span className="title">趣味特技</span>
      <ul className="main">
        {props.hobbyList.map((hobby) => {return <Hobby key={hobby.id} hobby={hobby} />})}
      </ul>
    </div>
  )
}

export default HobbyList;
