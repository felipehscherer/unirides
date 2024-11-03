import React, { useState, useEffect } from 'react';

const regexUpperCase = /[A-Z]/;
const regexLowerCase = /[a-z]/;
const regexNumber = /\d/;
const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

const PasswordValidator = ({ password, passwordConfirm, onPasswordError, isTyping }) => {
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    let error = '';

    if (password !== passwordConfirm) {
      error = 'As senhas não coincidem';
    } else if (password.length < 8) {
      error = 'A senha deve ter 8 caracteres ou mais';
    } else if (!regexUpperCase.test(password)) {
      error = 'A senha deve conter ao menos uma letra maiúscula';
    } else if (!regexSpecialChar.test(password)) {
      error = 'A senha deve conter ao menos um caractere especial';
    } else if (!regexNumber.test(password)) {
      error = 'A senha deve conter ao menos um número';
    } else if (!regexLowerCase.test(password)) {
      error = 'A senha deve conter ao menos uma letra minúscula';
    }

    setPasswordError(error);
    onPasswordError(error);
  }, [password, passwordConfirm, onPasswordError]);

  return (
    <div id='box-senha'>
      {isTyping && (
        <>
          <label className="errorLabel">{passwordError}</label>
          <div className={passwordError === '' ? 'tooltip-hidden' : 'tooltip'}>
            <span className="circle">?</span>
            <span className="tooltip-text">
              A senha deve conter, no mínimo: 8 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 símbolo especial
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordValidator;
