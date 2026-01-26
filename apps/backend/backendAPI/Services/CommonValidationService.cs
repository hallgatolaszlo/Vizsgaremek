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
            if(!Enum.TryParse<TEnum>(value, ignoreCase: true, out var parsedEnum) || !Enum.IsDefined(typeof(TEnum), parsedEnum))
            {
                return new ServiceResponse<TEnum> { 
                    Success = false,
                    Message = $"Invalid {typeof(TEnum).Name} value"
                };
            }

            return new ServiceResponse<TEnum> { Success = true, Data = parsedEnum };
        }
    }
}
