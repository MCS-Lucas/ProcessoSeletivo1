using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace TesteT.Api.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
               await HandleAsync(context, ex);
            }
        }

        private async Task HandleAsync(HttpContext context, Exception ex)
        {
            var (statusCode, title, detail) = MapException(ex);

            _logger.LogError(ex, "Unhandled exception. TraceId = {TraceId} Path = {Path} StatusCode = {StatusCode}", GetTraceId(context), context.Request.Path.Value, statusCode);

            if (context.Response.HasStarted)
            {
                return;
            }

            context.Response.Clear();
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = context.Request.Path
            };

            problem.Extensions["traceId"] = GetTraceId(context);

            if (_env.IsDevelopment())
            {
                problem.Extensions["exceptionType"] = ex.GetType().FullName;
                problem.Extensions["exceptionMessage"] = ex.Message;
            }

            var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

            await context.Response.WriteAsync(JsonSerializer.Serialize(problem, jsonOptions));
        }

        private static (int StatusCode, string Title, string Detail) MapException(Exception ex)
        {
            return ex switch
            {
                ArgumentException ae => (
                    StatusCodes.Status400BadRequest,
                    "Requisição Invalida",
                    ae.Message
                ),

                JsonException je => (
                    StatusCodes.Status400BadRequest,
                    "JSON invalido",
                    je.Message
                ),

                KeyNotFoundException knf => (
                    StatusCodes.Status404NotFound,
                    "Recurso não encontrado",
                    knf.Message
                ),

                InvalidOperationException ioe => (
                    StatusCodes.Status422UnprocessableEntity,
                    "Quebra na regra de negocio",
                    ioe.Message
                ),

                DbUpdateConcurrencyException due => (
                    StatusCodes.Status409Conflict,
                    "Operação não permitida devido ao estado atual dos dados",
                    due.InnerException?.Message ?? due.Message
                ),

                _ => (
                    StatusCodes.Status500InternalServerError,
                    "Erro interno no servidor",
                    ex.Message
                )
            };
        }
        private static string GetTraceId(HttpContext context)
        {
           return Activity.Current?.Id ?? context.TraceIdentifier;
        }
    }
}