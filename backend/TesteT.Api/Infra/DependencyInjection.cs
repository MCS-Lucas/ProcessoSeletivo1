using Microsoft.EntityFrameworkCore;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Infra.Persistence;

namespace TesteT.Api.Infra.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfra(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("Default");

            if(string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string 'Default' not found.");
            }

            services.AddDbContext<AppDbContext>(options => 
                options.UseSqlite(connectionString));

            services.AddScoped<IAppDbContext>(sp =>     
                sp.GetRequiredService<AppDbContext>());

            return services;
        }
    }
}