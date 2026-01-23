
using backend.Context;

namespace backend.Services
{
    public class CommonValidationService : ICommonValidationService
    {
        private readonly AppDbContext _context;
        public CommonValidationService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<T?> FindByIdAsync<T>(Guid id) where T : class, IEntityWithId
        {
            return await _context.Set<T>().FindAsync(id);
        }
    }
}
