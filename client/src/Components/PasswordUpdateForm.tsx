import React from 'react';

type FormKey = 'currentPass'|'newPass1'|'newPass2';

type FormData = {
  value: string;
  editable: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type Props = {
  formData: {[key in FormKey]: FormData},
  onClickSubmit: () => void
}

type FormDetail = {
  label: string;
  required: boolean;
  maxLength: number|null;
  matchRef: FormKey|null;
  type: 'text'|'password'|'image';
}

const formInfo: {[key in FormKey]: FormDetail} = {
  currentPass: {
    label: '現在のパスワード',
    required: false,
    maxLength: null,
    matchRef: null,
    type: 'password'
  },
  newPass1: {
    label: '新規パスワード',
    required: false,
    maxLength: null,
    matchRef: null,
    type: 'password'
  },
  newPass2: {
    label: '新規パスワード（確認）',
    required: false,
    maxLength: null,
    matchRef: 'newPass1',
    type: 'password'
  }
}

const mkInput = (key: FormKey, formData: Props['formData']) => {
  const data = formData[key];
  const formDetail = formInfo[key];

  const isRequiredError = formDetail.required && data.value.length === 0;
  const isMaxLengthError = formDetail.maxLength !== null && formDetail.maxLength < data.value.length;

  const matchRef = formDetail.matchRef !== null ? formData[formDetail.matchRef] : null;
  const isMatchError = matchRef !== null && (typeof matchRef === 'undefined' || data.value !== matchRef.value);
  const isError = data.editable && (isRequiredError || isMaxLengthError || isMatchError);

  return (
    <div key={key}>
      <label
        htmlFor={`account-form-${key}`}
        className={`label ${isError ? 'label-error' : ''}`}
      >
        {formDetail.label}
      </label>
      {data.editable && formDetail.required ? <div className="tag-required"> 必須 </div> : ''}
      <input
        id={`account-form-${key}`}
        type={formDetail.type}
        className={`input-form ${isError ? 'input-form-error' : ''}`}
        title={data.value}
        value={data.value}
        disabled={!data.editable}
        onChange={data.editable ? data.onChange : undefined}
      />
      { isError ? <span className="err-msg">
        {isRequiredError ? 'この項目は必須です。' : ''}
        {isMaxLengthError ? `${formDetail.maxLength}文字以内で入力してください。` : ''}
        {isMatchError ? `${formInfo[formDetail.matchRef!].label} に入力された内容と一致しません。` : ''}
      </span>:''}
    </div>
  )
}

const canSubmit = (formData:Props['formData']) => {
  return (Object.keys(formInfo) as FormKey[]).every((key) => {
    const data = formData[key];
    const formDetail = formInfo[key];
    if (typeof data === 'undefined') {
      return true;
    };
    const isRequiredError = formDetail.required && data.value.length === 0;
    const isMaxLengthError = formDetail.maxLength !== null && formDetail.maxLength < data.value.length;
    const matchRef = formDetail.matchRef !== null ? formData[formDetail.matchRef] : null;
    const isMatchError = matchRef !== null && (typeof matchRef === 'undefined' || data.value !== matchRef.value);
    const isError = data.editable && (isRequiredError || isMaxLengthError || isMatchError);
    return !isError
  });
}

const onSubmit = (formData:Props['formData'], callback: Props['onClickSubmit']) => {
  if (canSubmit(formData)) {
    callback();
  }
}

const PasswordUpdateForm: React.FC<Props> = (props: Props) => {
  const keys: FormKey[] = ['currentPass', 'newPass1', 'newPass2'];
  const formMain = keys.map((k) => {return mkInput(k, props.formData)});
  return (
    <form id="password-update-form">
      <div className="form-main">
        {formMain}
      </div>
      <button
        type="button"
        className="submit-btn"
        onClick={() => {onSubmit(props.formData, props.onClickSubmit)}}
        disabled={!canSubmit(props.formData)}
      >
        更新する
      </button>
    </form>
  );
}

export default PasswordUpdateForm;
