import React from 'react';

type Props = {
  param: UserSearchParam;
  onSubmit: (param: UserSearchParam) => void
}
type State = {
  paramLocal: UserSearchParam;
  isOpen: boolean;
}

class UserSearchForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paramLocal: JSON.parse(JSON.stringify(props.param)),
      isOpen: false
    }
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeKana = this.onChangeKana.bind(this);
    this.onChangeBelong = this.onChangeBelong.bind(this);
    this.onChangeTag = this.onChangeTag.bind(this);
    this.onChangeDetail = this.onChangeDetail.bind(this);
    this.onClickTriggerBtn = this.onClickTriggerBtn.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const param: UserSearchParam = JSON.parse(JSON.stringify(this.state.paramLocal))
    param.name = e.target.value
    this.setState({
      paramLocal: param
    })
  }

  onChangeKana(e: React.ChangeEvent<HTMLInputElement>) {
    const param: UserSearchParam = JSON.parse(JSON.stringify(this.state.paramLocal))
    param.kana = e.target.value
    this.setState({
      paramLocal: param
    })
  }

  onChangeBelong(e: React.ChangeEvent<HTMLInputElement>) {
    const param: UserSearchParam = JSON.parse(JSON.stringify(this.state.paramLocal))
    param.belong = e.target.value
    this.setState({
      paramLocal: param
    })
  }

  onChangeTag(e: React.ChangeEvent<HTMLInputElement>) {
    const param: UserSearchParam = JSON.parse(JSON.stringify(this.state.paramLocal))
    param.tag = e.target.value
    this.setState({
      paramLocal: param
    })
  }

  onChangeDetail(e: React.ChangeEvent<HTMLInputElement>) {
    const param: UserSearchParam = JSON.parse(JSON.stringify(this.state.paramLocal))
    param.detail = e.target.value
    this.setState({
      paramLocal: param
    })
  }

  onClickTriggerBtn() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onSubmit() {
    this.props.onSubmit(this.state.paramLocal);
  }

  render() {
    return (
      <div className="pnet-user-search-form">
        <div>
          <button className={`trigger-btn trigger-btn-${this.state.isOpen ? 'open' : 'close'}`} onClick={this.onClickTriggerBtn}>
            {this.state.isOpen ? "閉じる" : "絞り込み検索"}
          </button>
        </div>
        <form className={`pnet-form ${this.state.isOpen ? 'open' : 'close'}`}>
          <div className="form-half">
            <label
              htmlFor={'pnet-search-user-name'}
              className="label"
            >
              氏名
            </label>
            <input
              id="pnet-search-user-name"
              value={this.state.paramLocal.name}
              className="input-form"
              onChange={this.onChangeName}
            />
          </div>
          <div className="form-half">
            <label
              htmlFor={'pnet-search-user-kana'}
              className="label"
            >
              フリガナ
            </label>
            <input
              id="pnet-search-user-kana"
              value={this.state.paramLocal.kana}
              className="input-form"
              onChange={this.onChangeKana}
            />
          </div>
          <div className="form-half">
            <label
              htmlFor={'pnet-search-user-kana'}
              className="label"
            >
              所属
            </label>
            <input
              id="pnet-search-user-belong"
              value={this.state.paramLocal.belong}
              className="input-form"
              onChange={this.onChangeBelong}
            />
          </div>
          <div className="form-half">
            <label
              htmlFor={'pnet-search-user-belong'}
              className="label"
            >
              スキル・特徴
            </label>
            <input
              id="pnet-search-user-tag"
              value={this.state.paramLocal.tag}
              className="input-form"
              onChange={this.onChangeTag}
            />
          </div>
          <label
            htmlFor={'pnet-search-user-detail'}
            className="label"
          >
            その他（自己紹介文・経歴・趣味）
          </label>
          <input
            id="pnet-search-user-detail"
            value={this.state.paramLocal.detail}
            className="input-form"
            onChange={this.onChangeDetail}
          />
          <div className="btn-space">
            <button type="button" className="save" onClick={this.onSubmit}>
              検索
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserSearchForm;
