import React from 'react';

import HobbyEdit from '../HobbyEdit'

type Props = {
  hobbyData: HobbyEditType;
  onClose: () => void;
  onSubmit: (profile: HobbyEditType) => void;
  onDelete?: (tag_id: string) => void
}

const HobbyEditDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog-parent">
      <div className="pnet-dialog">
        <HobbyEdit
          hobby={props.hobbyData}
          onSubmit={props.onSubmit}
          cancelBtnInfo={{
            label: '閉じる',
            onClick: props.onClose
          }}
          onDelete={props.onDelete}
        />
      </div>
    </div>
  )
}

export default HobbyEditDialog;
