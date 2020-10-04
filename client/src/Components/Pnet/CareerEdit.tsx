import React from 'react';

interface Props extends DefaultProps {
  career: CareerEditType;
  onSubmit: (career: CareerEditType) => void;
  cancelBtnInfo?: {
    label: string;
    onClick: () => void;
  }
  onDelete?: (career_id: string) => void
}
type State = {
  careerLocal: CareerEditType;
  dateLocal: string,
  formDetail: {
    title: {
      required: boolean;
      maxLength: number|null;
    },
    date: {
      required: boolean;
      maxLength: number|null;
    }
  },
  isNew: boolean
}
interface DefaultProps {
  isReference: boolean;
}


const zeropadding = (num: number) => {
  return `0${num}`.slice(-2);
}

const date2str = (date: Date) => {
  return `${date.getFullYear()}-${zeropadding(date.getMonth() + 1)}-${zeropadding(date.getDate())}`
}

class CareerEdit extends React.Component<Props, State> {
  public static defaultProps: DefaultProps = {
    isReference: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      careerLocal: JSON.parse(JSON.stringify(props.career)),
      dateLocal: props.career.year ? date2str(props.career.year) : '',
      formDetail: {
        title: {
          required: true,
          maxLength: 128
        },
        date: {
          required: true,
          maxLength: null
        }
      },
      isNew: typeof props.career.history_id === 'undefined',
    }
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeDetail = this.onChangeDetail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.isTitleFormError = this.isTitleFormError.bind(this);
    this.mkTitleForm = this.mkTitleForm.bind(this);
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const career: CareerEditType = JSON.parse(JSON.stringify(this.state.careerLocal))
    career.title = e.target.value
    this.setState({
      careerLocal: career
    })
  }

  onChangeYear(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      dateLocal: e.target.value
    })
  }

  onChangeDetail(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const career: CareerEditType = JSON.parse(JSON.stringify(this.state.careerLocal))
    career.detail = e.target.value
    this.setState({
      careerLocal: career
    })
  }

  onSubmit() {
    if(this.isTitleFormError().some((v) => {return v})) {
      return;
    }
    const career: CareerEditType = JSON.parse(JSON.stringify(this.state.careerLocal))
    career.year = new Date(this.state.dateLocal);
    if (!career.detail) {
      career.detail = ''
    }
    this.props.onSubmit(career);
  }

  onDelete() {
    if (!this.props.onDelete || !this.state.careerLocal.history_id) {
      return;
    }
    const result = window.confirm('削除しますか?');
    if (result) {
      this.props.onDelete(this.state.careerLocal.history_id);
    }
  }

  isTitleFormError() {
    const formDetail = this.state.formDetail.title;

    const value = this.state.careerLocal.title;
    const isRequiredError = formDetail.required && (!value || value.length === 0);
    const isMaxLengthError = formDetail.maxLength !== null && typeof value !== 'undefined' && formDetail.maxLength < value.length;
    return [isRequiredError, isMaxLengthError];
  }

  isDateFormError() {
    const formDetail = this.state.formDetail.date;

    const value = this.state.dateLocal;
    const isRequiredError = formDetail.required && (!value);
    return isRequiredError;
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
          htmlFor={'pnet-career-title'}
          className={`label ${isError ? 'label-error' : ''}`}
        >
          タイトル
        </label>
        <input
          id="pnet-career-title"
          value={this.state.careerLocal.title ? this.state.careerLocal.title : ''}
          className={`input-form ${isError ? 'input-form-error' : ''}`}
          onChange={this.onChangeTitle}
          disabled={this.props.isReference}
        />
        {errMsg}
      </div>
    )
  }

  mkDateInputForm() {
    const isRequiredError = this.isDateFormError();

    const errMsg = isRequiredError
      ? (
        <span className="err-msg">
          {isRequiredError ? 'この項目は必須です。' : ''}
        </span>)
      :'';


    return (
      <div>
        <label
          htmlFor={'pnet-tag-self_intro'}
          className={`label ${isRequiredError ? 'label-error' : ''}`}
        >
          年月
        </label>
        <input
          id="pnet-career-year"
          type="date"
          value={this.state.dateLocal}
          className={`input-form ${isRequiredError ? 'input-form-error' : ''}`}
          onChange={this.onChangeYear}
          disabled={this.props.isReference}
        />
        {errMsg}
      </div>
    )
  }

  isFormError() {
    return this.isTitleFormError().some((v) => {return v}) || this.isDateFormError();
  }

  render() {
    return (
      <div className="pnet-form">
        <h1>
          趣味・特技
        </h1>
        {this.mkTitleForm()}
        {this.mkDateInputForm()}
        <label
          htmlFor={'pnet-carerr-detail'}
          className="label"
        >
          詳細
        </label>
        <textarea
          id="pnet-career-detail"
          value={this.state.careerLocal.detail ? this.state.careerLocal.detail : ''}
          className="textarea-form"
          rows={10}
          onChange={this.onChangeDetail}
          disabled={this.props.isReference}
        />
        <div className="btn-space">
          { this.props.onDelete && !this.props.isReference
            ? (
              <button
                className="delete"
                onClick={this.onDelete}
              >
                削除
              </button>
            ):''
          }
          { this.props.cancelBtnInfo
            ? (
              <button
                className="close"
                onClick={this.props.cancelBtnInfo.onClick}
              >
                {this.props.cancelBtnInfo.label}
              </button>
            ):''
          }
          { !this.props.isReference
            ? (
              <button
                className="save"
                onClick={this.onSubmit}
                disabled={this.isFormError()}
              >
                決定
              </button>
            ):''
          }
        </div>
      </div>
    )
  }
}


export default CareerEdit;
