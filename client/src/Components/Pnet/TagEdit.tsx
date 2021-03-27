import React from 'react';

import Message from '../../Components/Message'

type Props = {
  tagData: TagEditType;
  onSubmit: (tag: TagEditType) => void;
  cancelBtnInfo?: {
    label: string;
    onClick: () => void
  };
  onDelete?: (tag_id: string) => void;
  showWarning?: boolean;
}
type State = {
  tagDataLocal: TagEditType;
  isNewTag: boolean;
  isNewReaction: boolean;
  formDetail: {
    title: {
      required: boolean;
      maxLength: number|null;
    }
  }
}

class TagEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tagDataLocal: JSON.parse(JSON.stringify(props.tagData)),
      isNewTag: typeof props.tagData.id === 'undefined',
      isNewReaction: typeof props.tagData.comment === 'undefined',
      formDetail: {
        title: {
          required: true,
          maxLength: 100
        }
      }
    }
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isTitleFormError = this.isTitleFormError.bind(this);
    this.mkTitleForm = this.mkTitleForm.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    if (!this.state.isNewTag) {
      return;
    }
    const tag: TagEditType = JSON.parse(JSON.stringify(this.state.tagDataLocal))
    tag.title = e.target.value
    this.setState({
      tagDataLocal: tag
    })
  }

  onChangeComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const tag: TagEditType = JSON.parse(JSON.stringify(this.state.tagDataLocal))
    tag.comment = e.target.value
    this.setState({
      tagDataLocal: tag
    })
  }

  onSubmit() {
    if(this.isTitleFormError().some((v) => {return v})) {
      return;
    }
    const tag: TagEditType = JSON.parse(JSON.stringify(this.state.tagDataLocal))
    if (!tag.comment) {
      tag.comment = ''
    }
    this.props.onSubmit(this.state.tagDataLocal)
  }

  onDelete() {
    if (!this.props.onDelete || !this.state.tagDataLocal.id) {
      return;
    }
    const result = window.confirm('この反応を削除しますか?');
    if (result) {
      this.props.onDelete(this.state.tagDataLocal.id);
    }
  }

  isTitleFormError() {
    const formDetail = this.state.formDetail.title;

    const value = this.state.tagDataLocal.title;
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
          value={this.state.tagDataLocal.title ? this.state.tagDataLocal.title : ''}
          className={`input-form ${isError ? 'input-form-error' : ''}`}
          onChange={this.state.isNewTag ? this.onChangeTitle : () => {}}
          disabled={!this.state.isNewTag}
        />
        {errMsg}
      </div>
    )
  }

  render() {
    const title = this.state.isNewTag
      ? '情報追加'
      : `${this.props.tagData.title} - ${{good: '賛成', bad: '反対'}[this.props.tagData.reaction]}`
    return (
      <div className="pnet-form">
        <h1>
          {title}
        </h1>
        {this.props.showWarning ? <Message value="現在と反対の評価に変更しようとしています。" type="warn" /> : ''}
        {this.mkTitleForm()}
        <label
          htmlFor={'pnet-tag-self_intro'}
          className="label"
        >
          コメント
        </label>
        <textarea
          id="pnet-tag-self_intro"
          value={this.state.tagDataLocal.comment ? this.state.tagDataLocal.comment : ''}
          className="textarea-form"
          rows={10}
          onChange={this.onChangeComment}
        />
        <div className="pnet-btn-space">
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

export default TagEdit;
