
using System.Text;
using System.Text.Json.Serialization;
using backend.Context;
using backend.Hubs;
using backend.Services;
using backend.Services.Auth;
using backend.Services.Calendar;
using backend.Services.CalendarEntry;
using backend.Services.Friend;
using backend.Services.Habit;
using backend.Services.Profile;
using backend.Services.Registration;
using backend.Services.SharedCalendar;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().AddJsonOptions(options => 
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            //for quick endpoint test that needed authorization 
            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            //add context; username and password is in user-secrets - configuration needed
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
                if (connectionString.Contains("{USERNAME}"))
                {
                    connectionString = connectionString
                        .Replace("{USERNAME}", builder.Configuration.GetValue<string>("postgres-username"))
                        .Replace("{PASSWORD}", builder.Configuration.GetValue<string>("postgres-password"));
                }
                options.UseNpgsql(connectionString);
            });

            //cors policies
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration.GetValue<string>("AppSettings:Issuer"),
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration.GetValue<string>("AppSettings:Audience"),
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("jwt-secret-key")!)),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Try to get token from cookie first
                        context.Token = context.Request.Cookies["accessToken"];

                        // Fallback to SignalR
                        if (string.IsNullOrEmpty(context.Token))
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notifications"))
                            {
                                context.Token = accessToken;
                            }
                        }

                        // Fallback to Authorization header (useful for testing with Swagger)
                        if (string.IsNullOrEmpty(context.Token))
                        {
                            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                            if (authHeader != null && authHeader.StartsWith("Bearer "))
                            {
                                context.Token = authHeader.Substring("Bearer ".Length).Trim();
                            }
                        }

                        return Task.CompletedTask;
                    }
                };
            });

            //signalR for live requests
            builder.Services.AddSignalR();
            builder.Services.AddSingleton<IUserIdProvider, CustomUserProvider>();

            builder.Services
                .AddScoped<IAuthService, AuthService>()
                .AddScoped<IUserRegistration, UserRegistration>()
                .AddScoped<ICommonValidationService, CommonValidationService>()
                .AddScoped<IProfileValidationService, ProfileValidationService>()
                .AddScoped<ICalendarValidationService, CalendarValidationService>()
                .AddScoped<ICalendarEntryValidationService, CalendarEntryValidationService>()
                .AddScoped<IHabitValidationService, HabitValidationService>()
                .AddScoped<IFriendValidationService, FriendValidationService>()
                .AddScoped<ISharedCalendarValidationService, SharedCalendarValidationService>();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
            }

            // Configure the HTTP request pipeline.
            app.UseCors();
            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseHttpsRedirection();
            }


            app.UseAuthentication();
            app.UseAuthorization();
            app.MapHub<NotificationHub>("/notifications");

            app.MapControllers();

            app.Run();
        }
    }
}
