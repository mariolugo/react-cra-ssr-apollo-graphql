import { createError } from "apollo-errors";

const WrongCredentialsError = createError("WrongCredentialsError", {
    message: "The provided credentials are invalid."
});

export { WrongCredentialsError }
