using backend.DTOs;

namespace backend.Services
{
    public interface ICommonValidationService
    {
        Task<ServiceResponse<T?>> EntityExists<T>(Guid id) where T : class, IEntityWithId;
        ServiceResponse<TEnum> ValidateEnum<TEnum>(string value) where TEnum : struct, Enum;
    }
}
