export function handleRegistrationError(error) {
  if (error instanceof Error) {
    switch (error.message) {
      case "Failed to create record.":
        return "Sorry, we couldn't create your account.";
      case "Email is already in use.":
        return "The email you provided is already used. Please use a different email.";
      case "Username is already in use.":
        return "The username you provided is already taken. Please choose a different username.";
      case "Something went wrong while processing your request.":
        return "Something went wrong while creating your account.";
      default:
        return "Oops, something went wrong. Please try again.";
    }
  } else {
    return "An unexpected error occurred.";
  }
}

export function handleLoginError(error) {
  if (error instanceof Error) {
    switch (error.message) {
      default:
        return "Username or password is invalid. Please try again.";
    }
  } else {
    return "An unexpected error occurred.";
  }
}
