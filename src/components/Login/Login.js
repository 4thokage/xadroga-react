import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import AuthService from '../../services/auth.service';
import GoogleAuthService from '../../services/auth.google.service';
import './login.scss';
import { Link } from 'react-router-dom';
import {API_URL} from '../Utils/XadrogaConstants';

const API_ORIGIN = API_URL.split('/api')[0];

const required = value => {
  if (!value)
    return (
      <div className = 'alert alert-danger' role = 'alert'>
        This field is required!
      </div>
    );
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.handleGoogleOAuthError = this.handleGoogleOAuthError.bind(this);
    this.handleLichessLogin = this.handleLichessLogin.bind(this);
    this.registerLoginJWT = this.registerLoginJWT.bind(this);

    this.state = {
      username: '',
      password: '',
      loading: false,
      message: ''
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  // Gets called when a user signs in using google
  onSignIn(googleUser) {
    const id_token = googleUser.tokenObj.id_token;

    this.setState({
      message: '',
      loading: true
    });


    GoogleAuthService.signIn(id_token).then(
      () => {
        this.props.history.push('/play');
        window.location.reload();
      },
      error => {
        const resMessage =
          ( error.response &&
            error.response.data &&
            error.response.data.msg
          )
          || error.message
          || error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  handleGoogleOAuthError(response) {
    console.log("Google Authentication Failed");
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: '',
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.history.push('/play');
          window.location.reload();
        },
        error => {
          const resMessage =
            ( error.response &&
              error.response.data &&
              error.response.data.msg
            )
            || error.message
            || error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  registerLoginJWT(event) {
    if (event.origin !== API_ORIGIN) {
      return;
    }

    if (event.data.success){
      localStorage.setItem('user', JSON.stringify(event.data));
      this.props.history.push('/play');
      window.location.reload();
    } else {
      this.setState({message: event.data.success});
    }

    window.removeEventListener("message", this.registerLoginJWT);
  }

  handleLichessLogin(e) {
    e.preventDefault();
    window.open(API_ORIGIN+'/api/signin/lichess/', "Login With Lichess", "width=650, height=900");

    window.addEventListener("message", this.registerLoginJWT);
  }

  render() {
    return (
      <div className = 'col-md-12'>

        <div className = 'card card-container login-card'>
          <img
            src = 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Prescription02&hairColor=Black&facialHairType=BeardLight&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Gray01&eyeType=Squint&eyebrowType=Default&mouthType=Twinkle&skinColor=Pale'
            alt = 'profile-img'
            className = 'profile-img-card'
          />

          <Form
            name = 'login'
            ref = {c => {
              this.form = c;
            }}
          >
            <div className = 'form-group'>
              <label htmlFor = 'username'> Username </label>

              <Input
                type = 'text'
                className = 'form-control'
                name = 'username'
                value = { this.state.username }
                onChange = { this.onChangeUsername }
                validations = { [required] }
              />
            </div>

            <div className = 'form-group'>
              <label htmlFor = 'password'> Password </label>
              <Input
                type = 'password'
                className = 'form-control'
                name = 'password'
                value = { this.state.password }
                onChange = { this.onChangePassword }
                validations = { [required] }
              />
            </div>

            <div className = 'form-group'>
              <button
                className = 'btn btn-block mybtn'
                disabled = { this.state.loading }
                onClick={this.handleLogin}
              >
                {this.state.loading && (
                  <span className = 'spinner-border spinner-border-sm'/>
                )}
                <span>Login</span>
              </button>

              <button className = "btn btn-block lichessbtn"
                      onClick={this.handleLichessLogin}>
                Login with Lichess
              </button>
            </div>

            {this.state.message && (
              <div className = 'form-group'>
                <div className = 'alert alert-danger' role = 'alert'>
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style = {{ display: 'none' }}
              ref = {c => {
                this.checkBtn = c;
              }}
            />
          </Form>
          <div style = {{ textAlign: 'center' }}>
              <p style = {{ margin: '0px' }}>
                <strong>Don't have an account?</strong>
              </p>
              <Link
                style = {{ color: '#647dfc', fontWeight: 'bold' }}
                to = '/register'
              >
                Register here
              </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
