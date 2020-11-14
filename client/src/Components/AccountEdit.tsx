import React from 'react';

import Message from './Message'

type FormKey = 'id'|'name'|'pass1'|'pass2'|'email'|'image'

type FormData = {
  value: string;
  editable: boolean;
  imageSrc?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageClear?: ()=> void;
  imageDelete?: ()=>void;
}

type Props = {
  accountInfo: {[key in FormKey]?: FormData},
  submitText: string,
  onClickSubmit: () => void,
  errorMessage?: string
}

type FormDetail = {
  label: string;
  required: boolean;
  maxLength: number|null;
  matchRef: FormKey|null;
  type: 'text'|'password'|'image';
}

const formInfo: {[key in FormKey]: FormDetail} = {
  id: {
    label: 'ID',
    required: true,
    maxLength: 100,
    matchRef: null,
    type: 'text'
  },
  name: {
    label: '名前',
    required: true,
    maxLength: 4000,
    matchRef: null,
    type: 'text'
  },
  pass1: {
    label: 'パスワード',
    required: false,
    maxLength: null,
    matchRef: null,
    type: 'password'
  },
  pass2: {
    label: 'パスワード（確認）',
    required: false,
    maxLength: null,
    matchRef: 'pass1',
    type: 'password'
  },
  email: {
    label: 'メールアドレス',
    required: false,
    maxLength: 255,
    matchRef: null,
    type: 'text'
  },
  image: {
    label: 'プロフィール画像',
    required: false,
    maxLength: null,
    matchRef: null,
    type: 'image'
  },
}

const mkImageForm = (accountInfo: Props['accountInfo'], key:FormKey) => {
  const formDetail = formInfo[key];
  const formData = accountInfo[key];
  if (typeof formData === 'undefined') {
    return;
  };
  return (
    <div>
      <div>
        <span
          className="label"
        >
          {formDetail.label}
        </span>
      </div>
      <img
        className="icon-prev"
        src={formData.imageSrc}
        alt={formData.value}
      />
      <div className="btn-space">
        <label
          htmlFor={`account-form-${key}`}
          className="img-select"
        >
          <span>ファイルを選択</span>
          <input
            id={`account-form-${key}`}
            className="img-input"
            type="file"
            accept="image/*"
            value={formData.value}
            onChange={formData.onChange}
          />
        </label>
        <span
          className="clear-btn"
          onClick={formData.imageClear}
        >
          クリア
        </span>
        {
          typeof formData.imageDelete !== 'undefined' ? (
            <span
              className="clear-btn"
              onClick={formData.imageDelete}
            >
              削除
            </span>
          ): ''
        }
      </div>
    </div>
  )
}

const canSubmit = (accountInfo:Props['accountInfo']) => {
  return (Object.keys(formInfo) as FormKey[]).every((key) => {
    const formData = accountInfo[key];
    const formDetail = formInfo[key];
    if (typeof formData === 'undefined') {
      return true;
    };
    const isRequiredError = formDetail.required && formData.value.length === 0;
    const isMaxLengthError = formDetail.maxLength !== null && formDetail.maxLength < formData.value.length;
    const matchRef = formDetail.matchRef !== null ? accountInfo[formDetail.matchRef] : null;
    const isMatchError = matchRef !== null && (typeof matchRef === 'undefined' || formData.value !== matchRef.value);
    const isError = formData.editable && (isRequiredError || isMaxLengthError || isMatchError);
    return !isError
  });
}

const onSubmit = (accountInfo:Props['accountInfo'], callback: Props['onClickSubmit']) => {
  if (canSubmit(accountInfo)) {
    callback();
  }
}

const mkInput = (accountInfo: Props['accountInfo'], key:FormKey) => {
  const formData = accountInfo[key];
  const formDetail = formInfo[key];
  if (typeof formData === 'undefined') {
    return;
  };
  const isRequiredError = formDetail.required && formData.value.length === 0;
  const isMaxLengthError = formDetail.maxLength !== null && formDetail.maxLength < formData.value.length;
  const matchRef = formDetail.matchRef !== null ? accountInfo[formDetail.matchRef] : null;
  const isMatchError = matchRef !== null && (typeof matchRef === 'undefined' || formData.value !== matchRef.value);
  const isError = formData.editable && (isRequiredError || isMaxLengthError || isMatchError);
  return (
    <div>
      <label
        htmlFor={`account-form-${key}`}
        className={`label ${isError ? 'label-error' : ''}`}
      >
        {formDetail.label}
      </label>
      {formData.editable && formDetail.required ? <div className="tag-required"> 必須 </div> : ''}
      <input
        id={`account-form-${key}`}
        type={formDetail.type}
        className={`input-form ${isError ? 'input-form-error' : ''}`}
        title={formData.value}
        value={formData.value}
        disabled={!formData.editable}
        onChange={formData.editable ? formData.onChange : undefined}
      />
      { isError ? <span className="err-msg">
        {isRequiredError ? 'この項目は必須です。' : ''}
        {isMaxLengthError ? `${formDetail.maxLength}文字以内で入力してください。` : ''}
        {isMatchError ? `${formInfo[formDetail.matchRef!].label} に入力された内容と一致しません。` : ''}
      </span>:''}
    </div>
  )
}

const mkForm = (accountInfo:Props['accountInfo'], showList:string[]) => {
  return (Object.keys(formInfo) as FormKey[]).filter((key) => {
    return showList.indexOf(key) > -1;
  }).map((key) => {
    return(
      <div key={`account-form-${key}`}>
        { formInfo[key].type === 'image' ? mkImageForm(accountInfo, key): mkInput(accountInfo, key) }
      </div>
    );
  });
}

const AccountEdit: React.FC<Props> = (props: Props) => {
  const left = ['id','name','pass1','pass2','email'];
  const right = ['image'];
  return (
    <form id="account-form">
      {typeof props.errorMessage !== 'undefined' && props.errorMessage !== '' ? <Message value={props.errorMessage} type="error" /> : ''}
      <div className="main">
        <div className="form-style">
          { mkForm(props.accountInfo, left) }
        </div>
        <div className="form-style">
          { mkForm(props.accountInfo, right) }
        </div>
      </div>
      <button
        type="button"
        className="submit-btn"
        onClick={() => {onSubmit(props.accountInfo, props.onClickSubmit)}}
        disabled={!canSubmit(props.accountInfo)}
      >
        {props.submitText}
      </button>
    </form>
  );
}

export default AccountEdit;
