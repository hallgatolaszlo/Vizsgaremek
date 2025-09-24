using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();
            builder.Services.AddHttpContextAccessor();

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

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("jwt-secret-key")!)),
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration.GetValue<string>("JwtSettings:Issuer"),
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration.GetValue<string>("JwtSettings:Audience"),
                    ValidateLifetime = true,
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.ContainsKey("accessToken"))
                        {
                            context.Token = context.Request.Cookies["accessToken"];
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            builder.Services.AddScoped<IAuthService, AuthService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();

                app.UseCors(
                policy => policy.WithOrigins("https://localhost:5173", "http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials()
                );
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
