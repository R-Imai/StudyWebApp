import React from 'react';

import TagEdit from '../TagEdit'

type Props = {
  tagData: TagEditType;
  onClose: () => void;
  onSubmit: (profile: TagEditType) => void;
  onDelete?: (tag_id: string) => void,
  showWarning?: boolean;
}

const TagEditDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog-parent">
      <div className="pnet-dialog">
        <TagEdit
          tagData={props.tagData}
          onSubmit={props.onSubmit}
          cancelBtnInfo={{
            label: '閉じる',
            onClick: props.onClose
          }}
          showWarning={props.showWarning}
          onDelete={props.onDelete}
        />
      </div>
    </div>
  )
}

export default TagEditDialog;
