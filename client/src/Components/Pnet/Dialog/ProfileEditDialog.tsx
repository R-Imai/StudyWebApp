import React from 'react';

import ProfileEdit from '../ProfileEdit'

type Props = {
  profile: PnetProfileCard;
  onClose: () => void;
  onSubmit: (profile: PnetProfileEditInfo) => void;
}

const ProfileEditDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog-parent">
      <div className="pnet-dialog">
        <ProfileEdit
          profile={props.profile}
          onSubmit={props.onSubmit}
          cancelBtnInfo={{
            label: '閉じる',
            onClick: props.onClose
          }}
        />
      </div>
    </div>
  )
}

export default ProfileEditDialog;
