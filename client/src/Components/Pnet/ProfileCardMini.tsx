import React from 'react';

type Props = {
  profile: PnetProfileCard,
  canEdit?: boolean,
  onClickEdit?: () => void
}

const mkSelfIntroRow = (row: string) => {
  const regexpUrl = /https?:\/\/[\w/:%#$&?()~.=+\-\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g;
  const regexpMakeLink = (url: string, key: number) => {
    return <a href={url} target="blank" key={`link-${key}`}> {url} </a>;
  }

  const matchVals = row.match(regexpUrl);
  const splitVals = row.split(regexpUrl);

  if (matchVals === null) {
    return <span>{row}</span>;
  }

  const perseElements:JSX.Element[] = [];
  [...Array(matchVals.length).keys()].forEach((i) => {
    perseElements.push(<span key={`span-${i}`}>{splitVals[i]}</span>);
    perseElements.push(regexpMakeLink(matchVals[i], i));
  });
  perseElements.push(<span key={`span-${splitVals.length - 1}`}>{splitVals[splitVals.length - 1]}</span>);
  return perseElements;
}

const ProfileCardMini: React.FC<Props> = (props: Props) => {
  const editBtn = props.canEdit && typeof props.onClickEdit !== "undefined" ? (
    <button
      className="edit"
      onClick={props.onClickEdit}
    />
  ) : '';
  return (
    <div className="pnet-profile-card-mini">
      <div className="info">
        <div className="profile-image">
          <img alt="icon" src={props.profile.image} />
        </div>
        <div className="profile-info">
          <div className="rows belong">
            {props.profile.belong}
          </div>
          <div className="rows name">
            <span>
              {props.profile.name}
            </span>
            {editBtn}
          </div>
          <div className="rows sub">
            <span className="kana">
              {props.profile.name_kana}
            </span>
            <span className="id">
              @{props.profile.id}
            </span>
          </div>
        </div>
      </div>
      <div className="intro">
        {props.profile.self_intro.split('\n').map((v, i) => {return <div key={i}>{mkSelfIntroRow(v)}</div>})}
      </div>
    </div>
  )
}

export default ProfileCardMini
