import React from 'react';

import loadingIcon from '../image/loading.svg';

type Props = {
  show: boolean
}

const Indicator: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="indicator"
      style={{
        display: props.show ? 'flex' : 'none'
      }}
    >
      <img
        src={loadingIcon}
        alt="読み込み中"
      />
    </div>
  );
}

export default Indicator
