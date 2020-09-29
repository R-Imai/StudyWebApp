import React from 'react';
import Hobby from './Hobby'

type Props = {
  hobbyList: Hobby[],
  showAddBtn: boolean,
  onClickNew: () => void
  hobbyClick: (hobby: Hobby) => void
}

const HobbyList: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-hobby-list">
      <span className="title">趣味・特技</span>
      <ul className="main">
        {props.hobbyList.map((hobby) => {return <Hobby key={hobby.id} hobby={hobby} onClick={() => {props.hobbyClick(hobby)}}/>})}
        <li><button className="add-btn" onClick={props.onClickNew}>+</button></li>
      </ul>
    </div>
  )
}

export default HobbyList;
