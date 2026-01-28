# ProcessoSeletivo1

Repositório do teste técnico: Web API (.NET) + Frontend (React + TypeScript).  
Persistência via SQLite (dados permanecem após reiniciar).

## Requisitos

- .NET SDK 10.x
- Node.js (recomendado 18+)

## Rodar (Backend)

Execute a partir da **raiz do repositório**.

### bash

dotnet restore
dotnet tool restore
dotnet build
dotnet run --project backend/TesteT.Api/TesteT.Api.csproj

## Banco (SQLite + EF Core Migrations)

Rode após 'dotnet tool restore'.

dotnet ef migrations add InitialCreate --project backend/TesteT.Api/TesteT.Api.csproj --startup-project backend/TesteT.Api/TesteT.Api.csproj -o Infra/Persistence/Migrations

dotnet ef database update --project backend/TesteT.Api/TesteT.Api.csproj --startup-project backend/TesteT.Api/TesteT.Api.csproj

## Rodar (Frontend)

cd frontend
npm install

### PowerShell

Copy-Item .\.env.example .\.env

npm run dev
