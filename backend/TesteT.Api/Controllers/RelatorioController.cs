using Microsoft.AspNetCore.Mvc;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Controllers.Dtos.Relatorio;

namespace TesteT.Api.Controllers
{
    [ApiController]
    [Route("api/relatorios")]
    public class RelatorioController : ControllerBase
    {
        private readonly IRelatorioService _relatorioService;
        public RelatorioController(IRelatorioService relatorioService)
        {
            _relatorioService = relatorioService;
        }

        [HttpGet("pessoas")]
        public async Task<ActionResult<TotaisPorPessoaResponse>> GetTotaisPorPessoa(CancellationToken ct)
        {
            var resultado = await _relatorioService.ObterTotaisPorPessoaAsync(ct);
            return Ok(resultado);
        }

        [HttpGet("categorias")]
        public async Task<ActionResult<TotaisPorCategoriaResponse>> GetTotaisPorCategoria(CancellationToken ct)
        {
            var resultado = await _relatorioService.ObterTotaisPorCategoriaAsync(ct);
            return Ok(resultado);
        }

    }
}