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
      <ProfileEdit
        profile={props.profile}
        onSubmit={props.onSubmit}
        cancelBtnInfo={{
          label: '閉じる',
          onClick: props.onClose
        }}
      />
    </div>
  )
}

export default ProfileEditDialog;
