import React from 'react';

type Props = {
  selfIntro: string
}

const SelfIntro: React.FC<Props> = (props: Props) => {
  return (
    <div className="pnet-self-intro">
      <span className="title">自己紹介</span>
      <div className="main">{props.selfIntro.split('\n').map((v) => {return <div>{v}</div>})}</div>
    </div>
  )
}

export default SelfIntro;
