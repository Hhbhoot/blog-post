function validatePassword(password) {
  if (typeof password !== 'string') return false;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[\]}|:;"'<>,.?/~`]).{8,32}$/;

  return passwordRegex.test(password);
}

export default validatePassword;
