
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            // Add DbContext with PostgreSQL configuration
            builder.Services.AddDbContext<DatabaseContext>(options =>
            {
                // Replace placeholders in the connection string with actual values from configuration (user-secrets)
                string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection")?
                .Replace("{USERNAME}", builder.Configuration.GetValue<string>("postgres-username"))
                .Replace("{PASSWORD}", builder.Configuration.GetValue<string>("postgres-password"));

                try
                {
                    options.UseNpgsql(connectionString);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error configuring the database: " + ex.Message);
                    throw;
                }
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
