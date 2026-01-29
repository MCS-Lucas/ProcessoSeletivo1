using TesteT.Api.Infra.DependencyInjection;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Application.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddInfra(builder.Configuration);

// Aqui estão os métodos que irão dizer ao DI qual classe implementar quando uma interface for requisitada
builder.Services.AddScoped<IPessoaService, PessoaService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
//builder.Services.AddScoped<ITransacaoService, TransacaoService>();
//builder.Services.AddScoped<IRelatorioService, RelatorioService>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCors");
}

/* Deixei comentado porque a API está rodando em HTTP neste teste,
   pra não depender de certificado HTTPS local.

   app.UseHttpsRedirection();    */   

app.MapControllers();

app.MapGet("/", () => Results.Ok("Api online"));

app.Run();

