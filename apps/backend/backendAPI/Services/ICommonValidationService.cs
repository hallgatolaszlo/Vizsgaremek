namespace backend.Services
{
    public interface ICommonValidationService
    {
        Task<T?> FindByIdAsync<T>(Guid id) where T : class, IEntityWithId;
    }
}
