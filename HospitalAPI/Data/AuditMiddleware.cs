using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace HospitalAPI.Data
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;

        public AuditMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
        {
            _next = next;
            _scopeFactory = scopeFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // 🔹 Ignore GET requests
            if (context.Request.Method == "GET" ||
            context.Request.Path.StartsWithSegments("/api/Auth/register") ||
            context.Request.Path.StartsWithSegments("/api/Auth/login"))
            {
                await _next(context);
                return; // Skip further processing for GET requests
            }

            // Récupérer l'utilisateur authentifié (ou "Anonymous" si non authentifié)
            var username = context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                              ?? context.User?.FindFirst(ClaimTypes.Name)?.Value
                              ?? "Anonymous";

            // Récupérer l'UserId du patient (si disponible dans le JWT)
            var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Si l'UserId n'est pas trouvé, utiliser une valeur par défaut ou générer une erreur
            if (string.IsNullOrEmpty(userId))
            {
                userId = "Unknown";
            }

            // Récupérer l'action (URL de la requête)
            var action = context.Request.Path;
            var method = context.Request.Method;

            // 🔍 Extraire dynamiquement l'EntityType et EntityId
            var entityType = "Unknown";
            var entityId = "N/A";

            // Correspondance d'URL avec regex pour extraire {entity} et {id}
            var match = Regex.Match(action, @"/api/(?<entity>\w+)/(?<id>\d+)");
            if (match.Success)
            {
                entityType = match.Groups["entity"].Value;  // Exemple: "patients"
                entityId = match.Groups["id"].Value;        // Exemple: "1"

                // Convertir "patients" en "Patient" (si nécessaire)
                entityType = char.ToUpper(entityType[0]) + entityType.Substring(1).TrimEnd('s');
            }
            else
            {
                // Si l'URL ne correspond pas, définir une valeur par défaut
                entityType = "General";  // Exemple de catégorie générale
                entityId = "Unknown";
            }

            // Créer une entrée dans la base de données pour l'audit
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                // Déterminer le verbe d'action (création, mise à jour, suppression)
                var actionVerb = method switch
                {
                    "POST" => "created",
                    "PUT" => "updated",
                    "DELETE" => "deleted",
                    _ => method.ToLower() // Conserver d'autres méthodes, comme GET, sans modification
                };

                // Créer l'objet de log d'audit
                var auditLog = new AuditLog
                {
                    UserId = userId,  // Enregistrer l'ID de l'utilisateur ici
                    ActionType = method,
                    EntityType = entityType,
                    EntityId = entityId,
                    Description = $"{userId} {actionVerb} {entityType} (ID: {entityId})",
                    ActionDate = DateTime.UtcNow
                };

                // Ajouter et sauvegarder dans la base de données
                dbContext.AuditLog.Add(auditLog);
                await dbContext.SaveChangesAsync();
            }

            // Continuer avec le pipeline de la requête
            await _next(context);
        }

    }
}
