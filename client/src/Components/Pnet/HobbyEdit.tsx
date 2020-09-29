import React from 'react';

type Props = {
  hobby: HobbyEditType;
  onSubmit: (hobby: HobbyEditType) => void;
  cancelBtnInfo?: {
    label: string;
    onClick: () => void
  }
  onDelete?: (tag_id: string) => void
}
type State = {
  hobbyLocal: HobbyEditType;
  formDetail: {
    title: {
      required: boolean;
      maxLength: number|null;
    }
  },
  isNew: boolean
}

class HobbyEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hobbyLocal: JSON.parse(JSON.stringify(props.hobby)),
      formDetail: {
        title: {
          required: true,
          maxLength: 128
        }
      },
      isNew: typeof props.hobby.id === 'undefined',
    }
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDetail = this.onChangeDetail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.isTitleFormError = this.isTitleFormError.bind(this);
    this.mkTitleForm = this.mkTitleForm.bind(this);
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const hobby: HobbyEditType = JSON.parse(JSON.stringify(this.state.hobbyLocal))
    hobby.title = e.target.value
    this.setState({
      hobbyLocal: hobby
    })
  }

  onChangeDetail(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const hobby: HobbyEditType = JSON.parse(JSON.stringify(this.state.hobbyLocal))
    hobby.detail = e.target.value
    this.setState({
      hobbyLocal: hobby
    })
  }

  onSubmit() {
    if(this.isTitleFormError().some((v) => {return v})) {
      return;
    }
    const hobby: HobbyEditType = JSON.parse(JSON.stringify(this.state.hobbyLocal))
    if (!hobby.detail) {
      hobby.detail = ''
    }
    this.props.onSubmit(this.state.hobbyLocal)
  }

  onDelete() {
    if (!this.props.onDelete || !this.state.hobbyLocal.id) {
      return;
    }
    const result = window.confirm('削除しますか?');
    if (result) {
      this.props.onDelete(this.state.hobbyLocal.id);
    }
  }

  isTitleFormError() {
    const formDetail = this.state.formDetail.title;

    const value = this.state.hobbyLocal.title;
    const isRequiredError = formDetail.required && (!value || value.length === 0);
    const isMaxLengthError = formDetail.maxLength !== null && typeof value !== 'undefined' && formDetail.maxLength < value.length;
    return [isRequiredError, isMaxLengthError];
  }

  mkTitleForm() {
    const formDetail = this.state.formDetail.title;
    const [isRequiredError, isMaxLengthError] = this.isTitleFormError()
    const isError = isRequiredError || isMaxLengthError;

    const errMsg = isError ? <span className="err-msg">
      {isRequiredError ? 'この項目は必須です。' : ''}
      {isMaxLengthError ? `${formDetail.maxLength}文字以内で入力してください。` : ''}
    </span>:'';


    return (
      <div>
        <label
          htmlFor={'pnet-tag-title'}
          className={`label ${isError ? 'label-error' : ''}`}
        >
          タイトル
        </label>
        <input
          id="pnet-tag-title"
          value={this.state.hobbyLocal.title ? this.state.hobbyLocal.title : ''}
          className={`input-form ${isError ? 'input-form-error' : ''}`}
          onChange={this.onChangeTitle}
        />
        {errMsg}
      </div>
    )
  }

  render() {
    return (
      <div className="pnet-form">
        <h1>
          趣味・特技
        </h1>
        {this.mkTitleForm()}
        <label
          htmlFor={'pnet-tag-self_intro'}
          className="label"
        >
          詳細
        </label>
        <textarea
          id="pnet-tag-self_intro"
          value={this.state.hobbyLocal.detail ? this.state.hobbyLocal.detail : ''}
          className="textarea-form"
          rows={10}
          onChange={this.onChangeDetail}
        />
        <div className="btn-space">
          { this.props.onDelete
            ? (
              <button
                className="delete"
                onClick={this.onDelete}
              >
                削除
              </button>
            ):''
          }
          {this.props.cancelBtnInfo
            ? (
              <button
                className="close"
                onClick={this.props.cancelBtnInfo.onClick}
              >
                {this.props.cancelBtnInfo.label}
              </button>
            ):''
          }
          <button
            className="save"
            onClick={this.onSubmit}
            disabled={this.isTitleFormError().some((v) => {return v})}
          >
            決定
          </button>
        </div>
      </div>
    )
  }
}


export default HobbyEdit;
