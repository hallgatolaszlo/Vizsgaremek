namespace backend.Common
{
    public static class AuthErrors
    {
        public const string InvalidEmail =
            "Invalid email format.";

        public const string InvalidPassword =
            "Password must be 8–128 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";

        public const string UserAlreadyExists =
            "User with this email already exists.";

        public const string InvalidCredentials =
            "Invalid email or password.";
    }
}
