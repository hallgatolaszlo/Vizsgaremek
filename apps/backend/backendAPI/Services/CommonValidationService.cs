using backend.Context;
using backend.DTOs;

namespace backend.Services
{
    public class CommonValidationService(AppDbContext context) : ICommonValidationService
    {
        public async Task<ServiceResponse<T?>> EntityExists<T>(Guid id) where T : class, IEntityWithId
        {
            var data = await context.Set<T>().FindAsync(id);

            if (data == null)
            {
                return new ServiceResponse<T?>
                {
                    Success = false,
                    Message = $"{typeof(T).Name} not found",
                };
            }

            return new ServiceResponse<T?> { Success = true, Data = data };
        }

        public ServiceResponse<TEnum> ValidateEnum<TEnum>(string value) where TEnum : struct, Enum
        {
            if (!Enum.TryParse<TEnum>(value, ignoreCase: true, out var parsedEnum) || !Enum.IsDefined(typeof(TEnum), parsedEnum))
            {
                return new ServiceResponse<TEnum>
                {
                    Success = false,
                    Message = $"Invalid {typeof(TEnum).Name} value"
                };
            }

            return new ServiceResponse<TEnum> { Success = true, Data = parsedEnum };
        }
        public ServiceResponse<bool> ValidateText(string value, int? minLength = null, int? maxLength = null)
        {
            int minimumLength = minLength ?? 3;
            int maximumLength = maxLength ?? 32;

            if (string.IsNullOrWhiteSpace(value))
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = $"{value} cannot be empty"
                };
            }

            if (value.Length < minimumLength)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = $"{value} must be at least {minimumLength} characters"
                };
            }

            if (value.Length > maximumLength)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = $"{value} must not exceed {maximumLength} characters"
                };
            }

            return new ServiceResponse<bool> { Success = true };
        }
    }
}
