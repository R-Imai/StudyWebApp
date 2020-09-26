import React from 'react';

import infoIcon from '../image/info.svg';
import warnIcon from '../image/warn.svg';
import errorIcon from '../image/error.svg';

export type msgType = 'error' | 'warn' | 'info'

type Props = {
  value: string,
  type: msgType
}

const Message: React.FC<Props> = (props: Props) => {
  const iconSrc = {
    'error': errorIcon,
    'warn': warnIcon,
    'info': infoIcon
  }[props.type]
  return (
    <div className={`message-space message-space-${props.type}`}>
      <img src={iconSrc} alt={props.type}/> {props.value}
    </div>
  );
}

export default Message
