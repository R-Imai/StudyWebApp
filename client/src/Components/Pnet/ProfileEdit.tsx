import React from 'react';

type Props = {
  profile: PnetProfile
}
type State = {
  profileLocal: PnetProfile;
}

class ProfileEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profileLocal: JSON.parse(JSON.stringify(props.profile))
    }
    this.onChangeBelong = this.onChangeBelong.bind(this);
    this.onChangeNameKana = this.onChangeNameKana.bind(this);
    this.onChangeSelfIntro = this.onChangeSelfIntro.bind(this);
  }

  onChangeBelong(e: React.ChangeEvent<HTMLInputElement>) {
    const profile = JSON.parse(JSON.stringify(this.state))
    profile.belong = e.target.value
    this.setState({
      profileLocal: profile
    })
  }

  onChangeNameKana(e: React.ChangeEvent<HTMLInputElement>) {
    const profile = JSON.parse(JSON.stringify(this.state))
    profile.name_kana = e.target.value
    this.setState({
      profileLocal: profile
    })
  }

  onChangeSelfIntro(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const profile = JSON.parse(JSON.stringify(this.state))
    profile.self_intro = e.target.value
    this.setState({
      profileLocal: profile
    })
  }

  render() {
    console.log(this.state.profileLocal)
    return (
      <div className="pnet-profile-edit">
        <h1>
          People Network プロフィール
        </h1>
        <label
          htmlFor={'pnet-profile-edit-belong'}
          className="label"
        >
          所属
        </label>
        <input
          id="pnet-profile-edit-belong"
          value={this.state.profileLocal.belong}
          className="input-form"
          onChange={this.onChangeBelong}
        />
        <label
          htmlFor={'pnet-profile-edit-belong'}
          className="label"
        >
          氏名
        </label>
        <input
          id="pnet-profile-edit-belong"
          value={this.state.profileLocal.name}
          className="input-form"
          disabled={true}
        />
        <label
          htmlFor={'pnet-profile-edit-belong'}
          className="label"
        >
          フリガナ
        </label>
        <input
          id="pnet-profile-edit-belong"
          value={this.state.profileLocal.name_kana}
          className="input-form"
          onChange={this.onChangeNameKana}
        />
        <label
          htmlFor={'pnet-profile-edit-belong'}
          className="label"
        >
          自己紹介
        </label>
        <textarea
          id="pnet-profile-edit-belong"
          value={this.state.profileLocal.self_intro}
          className="input-form"
          onChange={this.onChangeSelfIntro}
        />
      </div>
    )
  }
}

export default ProfileEdit;
