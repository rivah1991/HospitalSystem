# Étape de base
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copier le fichier csproj et restaurer les dépendances
COPY ["HospitalAPI/HospitalAPI.csproj", "HospitalAPI/"]
RUN dotnet restore "HospitalAPI/HospitalAPI.csproj"

# Copier le reste des fichiers
COPY . .

# Exposer le port pour l'API
EXPOSE 5000

# Exécuter dotnet watch run pour le développement
ENTRYPOINT ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:5000"]
