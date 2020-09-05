import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import defaultIcon from '../image/defaultIcon.png';
// import { sha256 } from 'js-sha256';

import AccountEdit from '../Components/AccountEdit'

type State = {
  id: string,
  name: string,
  pass1: string,
  pass2: string,
  image: string,
  email: string,
  imageSrc: string,
  isError: boolean,
  errMsg: string
}

class RegisterPage extends React.Component<RouteComponentProps , State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      id: '',
      name: '',
      pass1: '',
      pass2: '',
      image: '',
      email: '',
      imageSrc: defaultIcon,
      isError: false,
      errMsg: ''
    };

    this.idChange = this.idChange.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.pass1Change = this.pass1Change.bind(this);
    this.pass2Change = this.pass2Change.bind(this);
    this.imageChange = this.imageChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.imageClear = this.imageClear.bind(this);
    this.register = this.register.bind(this);
  }

  idChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      id: e.target.value
    });
  };

  nameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      name: e.target.value
    });
  };

  pass1Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      pass1: e.target.value
    });
  };

  pass2Change(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      pass2: e.target.value
    });
  };

  emailChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      email: e.target.value
    });
  }

  imageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if(e.target.files !== null){
      reader.onload = (e) => {
        if (e.target !== null && e.target.result !== null) {
          this.setState({
            imageSrc: e.target.result.toString()
          });
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    this.setState({
      image: e.target.value
    });
  }

  imageClear() {
    this.setState({
      imageSrc: defaultIcon,
      image: ''
    });
  }

  register() {
    console.log('register!');
    console.log(this.state);
  }

  render() {
    const accountInfo = {
      id: {
        value: this.state.id,
        editable: true,
        onChange: this.idChange
      },
      name: {
        value: this.state.name,
        editable: true,
        onChange: this.nameChange
      },
      pass1: {
        value: this.state.pass1,
        editable: true,
        onChange: this.pass1Change
      },
      pass2: {
        value: this.state.pass2,
        editable: true,
        onChange: this.pass2Change
      },
      email: {
        value: this.state.email,
        editable: true,
        onChange: this.emailChange
      },
      image: {
        value: this.state.image,
        editable: true,
        imageSrc: this.state.imageSrc,
        onChange: this.imageChange,
        imageClear: this.imageClear
      }
    }
    return (
      <div id="register-page">
        <h1> アカウント作成 </h1>
        <div className="main">
          <AccountEdit
            accountInfo={accountInfo}
            submitText="登録する"
            onClickSubmit={this.register}
          />
          <Link to="/login">
            <button
              type="button"
              className="to-login-button"
            >
              ログインフォームへ戻る
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(RegisterPage)
