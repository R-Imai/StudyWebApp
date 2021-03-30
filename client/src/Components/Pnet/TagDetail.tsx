import React from 'react';

type Props = {
  tagData: TagType;
  maxHeight?: string;
  onClose: () => void;
}

const TagDetail: React.FC<Props> = (props: Props) => {
  const goodData = props.tagData.good.length > 0 ? props.tagData.good.map(v => {
    return (
      <div className="tag-detail-data" key={`good-${v.user_id}`}>
        <div className="user-name"><span className="name">{v.user_name}</span> さん</div>
        <div className="comment">{v.comment.split('\n').map((v, i) => {return <div key={i}>{v}</div>})}</div>
      </div>
    )
  }) : <div className="tag-detail-empty">ユーザが存在しません</div>;
  const badData = props.tagData.bad.length > 0 ? props.tagData.bad.map(v => {
    return (
      <div className="tag-detail-data" key={`bad-${v.user_id}`}>
        <div className="user-name"><span className="name">{v.user_name}</span> さん</div>
        <div className="comment">{v.comment.split('\n').map((v, i) => {return <div key={i}>{v}</div>})}</div>
      </div>
    )
  }) : <div className="tag-detail-empty">ユーザが存在しません</div>;
  return (
    <div>
      <h1>{props.tagData.title}</h1>
      <div className="pnet-tag-detail-space" style={props.maxHeight ? {maxHeight: props.maxHeight}: {}}>
        <h2>賛成</h2>
        {goodData}
        <h2>反対</h2>
        {badData}
      </div>
    </div>
  )
}

export default TagDetail;
