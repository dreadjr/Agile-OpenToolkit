import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../state/helpers/history';

import { userActions } from '../../state/actions/user';

import sideImage from '../../assets/login_image';

import styled from 'styled-components';
import {User} from 'styled-icons/fa-solid/User';
import {UnlockAlt} from 'styled-icons/fa-solid/UnlockAlt';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 800px;
  border-radius: 6px;
  overflow: hidden;
  padding: 55px 55px 37px 55px;
  background-color: #ffffff;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
     -moz-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
          box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: Calc(50% - 1px) 2px Calc(50% - 1px);
  grid-template-rows: 100%;
`;

const Left = styled.div`
  padding-right: 5px;
`

const Middle = styled.div`
  border: 1px dashed #000000;
`

const Right = styled.div`
  padding-left: 5px;
  background-image: url("${props => props.image}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

const LoginForm = styled.form`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 30px;
  color: #000000;
  line-height: 1.2;
  text-align: left;
  text-transform: uppercase;
  display: block;
`;

const EmailWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.24);
  margin-bottom: 30px;
  color: #000000;
`;

const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.24);
  margin-bottom: 30px;
  color: #000000;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;


const Footer = styled.div`
  text-align: center;
  padding-top: 90px;
`;

const LoginButton = styled.button`
  font-size: 16px;
  color: #ffffff;
  background-color: #1565f0;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 150px;
  height: 50px;
  border-radius: 25px;
  border: none;
`;

const ToRegisterButton = styled.button`
  font-size: 16px;
  color: #1565f0;
  background-color: #ffffff;
  border: 2px solid #1565f0;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  min-width: 150px;
  height: 50px;
  border-radius: 25px;
`

const EmailInput = styled.input`
  font-size: 16px;
  color: #0000000;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px 0 38px;
  border: none;
  outline: none;
`;

const PasswordInput = styled.input`
  font-size: 16px;
  color: #000000;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px 0 38px;
  border: none;
  outline: none;
`;

class Login extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    };
    this.login = this.login.bind(this)
    this.toRegister = this.toRegister.bind(this)
    this.changeEmailInputValue = this.changeEmailInputValue.bind(this)
    this.changePasswordInputValue = this.changePasswordInputValue.bind(this)
  }

  componentDidMount() {

  }

  login(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    if (this.state.email && this.state.password) {
      dispatch(userActions.login(this.state.email, this.state.password));
    }
  }

  toRegister(e) {
    e.preventDefault();

    history.push('/register');
  }

  changeEmailInputValue(value) {
    this.setState({
      email: value
    });
  }

  changePasswordInputValue(value) {
    this.setState({
      password: value
    });
  }

  render() {

    return (
      <Container>
        <Wrapper>
          <Left>
            <LoginForm>
              <Title>Login</Title>
              <EmailWrapper>
                <span>Email</span>
                <InputWrapper>
                  <User size="1em" />
                  <EmailInput type="text" name="email" value={this.state.email} onChange={e => this.changeEmailInputValue(e.target.value)} placeholder="email" required />
                </InputWrapper>
              </EmailWrapper>
              <PasswordWrapper>
                <span>Password</span>
                <InputWrapper>
                  <UnlockAlt size="1em" />
                  <PasswordInput type="password" name="password" value={this.state.password} onChange={e => this.changePasswordInputValue(e.target.value)} placeholder="Password" required />
                </InputWrapper>
              </PasswordWrapper>
              <ButtonsWrapper>
                <ToRegisterButton onClick={e => this.toRegister(e)}>
                    To Register
                </ToRegisterButton>
                <LoginButton onClick={e => this.login(e)}>
                    Login
                </LoginButton>
              </ButtonsWrapper>
              <Footer></Footer>
            </LoginForm>
          </Left>
          <Middle></Middle>
          <Right image={sideImage}>

          </Right>
        </Wrapper>
      </Container>
    );
  }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(Login);
export { connectedLoginPage as Login }; 