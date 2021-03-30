import React from 'react';

import TagEdit from '../TagDetail'

type Props = {
  tagData: TagType;
  onClose: () => void;
}

const TagDetailDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog-parent">
      <div className="pnet-dialog">
        <TagEdit maxHeight="75vh" tagData={props.tagData} onClose={props.onClose} />
        <div className="pnet-btn-space">
          <button className="close" onClick={props.onClose}>閉じる</button>
        </div>
      </div>
    </div>
  )
}

export default TagDetailDialog;
