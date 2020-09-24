import React from 'react';

import ProfileEdit from '../ProfileEdit'

type Props = {
  profile: PnetProfile
}

const ProfileEditDialog: React.FC<Props> = (props: Props) => {
  return (
    <div className="dialog-parent">
      <ProfileEdit profile={props.profile} />
    </div>
  )
}

export default ProfileEditDialog;
