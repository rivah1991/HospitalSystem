using System.Security.Claims;
using System.Text;
using HospitalAPI.Data;
using HospitalAPI.Mappers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Ajouter les contrôleurs
builder.Services.AddControllers();

// Ajouter AutoMapper
// builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Ajouter EF Core avec SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("HospitalConnection"));
});

// Configurer Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
}).AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configurer l'authentification JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false, // Tu peux ajuster si tu utilises des auditoires dans ton projet
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        RoleClaimType = ClaimTypes.Role
    };

    // Ajouter cette ligne pour récupérer les données de l'utilisateur dans le middleware d'authentification
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Vérifie si le token est envoyé dans le header "Authorization"
            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(Options =>
{
    Options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    Options.AddPolicy("UserPolicy", policy => policy.RequireRole("Professional"));
});

var app = builder.Build();

// Configurer la politique CORS avant l'utilisation des middlewares d'authentification
app.UseCors(options => options.WithOrigins("http://localhost:4200")  // Autoriser ton frontend Angular
                               .AllowAnyMethod()
                               .AllowAnyHeader()
                               .AllowCredentials());

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();

    // Vérifier et créer les rôles s'ils n'existent pas déjà
    string[] roleNames = { "Admin", "Professional" };
    foreach (var roleName in roleNames)
    {
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    // Créer un utilisateur Admin par défaut si nécessaire
    // var adminUser = await userManager.FindByNameAsync("adminHospital");
    var adminUser = await userManager.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserName == "adminHospital").ConfigureAwait(false);
    if (adminUser == null)
    {
        var user = new IdentityUser
        {
            UserName = "adminHospital",
            Email = "admin@hospital.com"
        };
        var result = await userManager.CreateAsync(user, "AdminTest@");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "Admin");
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

// Activer l'authentification et autorisation
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<AuditMiddleware>();

// Activer les contrôleurs
app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
