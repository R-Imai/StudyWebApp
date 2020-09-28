import React from 'react';

type Props = {
  profile: PnetProfileCard;
  onSubmit: (profile: PnetProfileEditInfo) => void;
  cancelBtnInfo?: {
    label: string;
    onClick: () => void
  }
}
type State = {
  profileLocal: PnetProfileCard;
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
    this.onSubmit = this.onSubmit.bind(this);
    this.onCansel = this.onCansel.bind(this);
  }

  onChangeBelong(e: React.ChangeEvent<HTMLInputElement>) {
    const profile: PnetProfileCard = JSON.parse(JSON.stringify(this.state.profileLocal))
    profile.belong = e.target.value
    this.setState({
      profileLocal: profile
    })
  }

  onChangeNameKana(e: React.ChangeEvent<HTMLInputElement>) {
    const profile = JSON.parse(JSON.stringify(this.state.profileLocal))
    profile.name_kana = e.target.value
    this.setState({
      profileLocal: profile
    })
  }

  onChangeSelfIntro(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const profile = JSON.parse(JSON.stringify(this.state.profileLocal))
    profile.self_intro = e.target.value
    this.setState({
      profileLocal: profile
    })
  }

  onSubmit() {
    const editInfo:PnetProfileEditInfo = {
      id: this.state.profileLocal.id,
      name_kana: this.state.profileLocal.name_kana,
      belong: this.state.profileLocal.belong,
      self_intro: this.state.profileLocal.self_intro
    }

    this.props.onSubmit(editInfo);
  }

  onCansel() {
    if (!this.props.cancelBtnInfo) {
      return;
    }
    this.props.cancelBtnInfo.onClick();
  }

  render() {
    return (
      <div className="pnet-form">
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
          htmlFor={'pnet-profile-edit-name'}
          className="label"
        >
          氏名
        </label>
        <input
          id="pnet-profile-edit-name"
          value={this.state.profileLocal.name}
          className="input-form"
          disabled={true}
        />
        <label
          htmlFor={'pnet-profile-edit-name_kana'}
          className="label"
        >
          フリガナ
        </label>
        <input
          id="pnet-profile-edit-name_kana"
          value={this.state.profileLocal.name_kana}
          className="input-form"
          onChange={this.onChangeNameKana}
        />
        <label
          htmlFor={'pnet-profile-edit-self_intro'}
          className="label"
        >
          自己紹介
        </label>
        <textarea
          id="pnet-profile-edit-self_intro"
          value={this.state.profileLocal.self_intro}
          className="textarea-form"
          onChange={this.onChangeSelfIntro}
          rows={10}
        />
        <div className="btn-space">
          {this.props.cancelBtnInfo ? (
              <button
                className="close"
                onClick={this.onCansel}
              >
                {this.props.cancelBtnInfo.label}
              </button>
            ):''
          }
          <button
            className="save"
            onClick={this.onSubmit}
          >
            決定
          </button>
        </div>
      </div>
    )
  }
}

export default ProfileEdit;
