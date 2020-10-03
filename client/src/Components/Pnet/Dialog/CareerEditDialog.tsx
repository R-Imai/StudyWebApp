import React from 'react';

import CareerEdit from '../CareerEdit'

type Props = {
  careerData: CareerEditType;
  onClose: () => void;
  onSubmit: (career: CareerEditType) => void;
  onDelete?: (career_id: string) => void
}

const CareerEditDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog-parent">
      <div className="pnet-dialog">
        <CareerEdit
          career={props.careerData}
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

export default CareerEditDialog;
