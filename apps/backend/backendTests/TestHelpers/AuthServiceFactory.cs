using backend.Context;
using backend.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestHelpers
{
    public static class AuthServiceFactory
    {
        public static AuthService Create(string databaseName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName)
                .Options;

            var context = new AppDbContext(options);

            var inMemorySettings = new Dictionary<string, string>
            {
                {"jwt-secret-key", "test-secret-key-with-at-least-64-bytes-for-hmacsha512-algorithm!!"},
                {"AppSettings:Issuer", "test-issuer"},
                {"AppSettings:Audience", "test-audience"}
            };

            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();

            return new AuthService(context, configuration);
        }
    }
}
