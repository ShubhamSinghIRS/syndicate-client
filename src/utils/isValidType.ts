export function validRegex(option: "email" | "password"): RegExp {
  if (option === "email") {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/;
  }

  if (option === "password") {
    // At least one lowercase letter, one uppercase letter, one digit, and
    // one special character - length is checked separately via minLength.
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  }

  return /0/;
}
