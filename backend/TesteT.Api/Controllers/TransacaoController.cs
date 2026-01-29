using Microsoft.AspNetCore.Mvc;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Controllers.Dtos.Transacao;

namespace TesteT.Api.Controllers
{
    [ApiController]
    [Route("api/transacoes")]
    public class TransacaoController : ControllerBase
    {
        private readonly ITransacaoService _transacaoService;
        private readonly IAppDbContext _db;

        public TransacaoController(ITransacaoService transacaoService, IAppDbContext db)
        {
            _transacaoService = transacaoService;
            _db = db;
        }

        [HttpPost]
        public async Task<ActionResult<TransacaoResponse>> Create([FromBody] CreateTransacaoRequest request, CancellationToken ct)
        {
            var transacao = await _transacaoService.CriarTransacaoAsync(
            request.Descricao,
            request.Valor,
            request.Tipo,
            request.PessoaId,
            request.CategoriaId,
            ct);

            var pessoa = await _db.Pessoas.FindAsync(new object[] { request.PessoaId }, ct);

            var categoria = await _db.Categorias.FindAsync(new object[] { request.CategoriaId }, ct);

            var response = new TransacaoResponse
            {
                TransacaoId = transacao.TransacaoId,
                Descricao = transacao.Descricao,
                Tipo = transacao.Tipo,
                Valor = transacao.Valor,
                PessoaId = transacao.PessoaId,
                PessoaNome = pessoa?.Nome ?? string.Empty,
                CategoriaId = transacao.CategoriaId,
                CategoriaDescricao = categoria?.Descricao ?? string.Empty
            };

            return CreatedAtAction(nameof(GetAll), new { }, response);
        }

        [HttpGet]
        public async Task<ActionResult<List<TransacaoResponse>>> GetAll(CancellationToken ct)
        {
            var transacoes = await _transacaoService.GetAllAsync(ct);

            var response = transacoes.Select(t => new TransacaoResponse
            {
                TransacaoId = t.TransacaoId,
                Descricao = t.Descricao,
                Tipo = t.Tipo,
                Valor = t.Valor,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa?.Nome ?? string.Empty,
                CategoriaId = t.CategoriaId,
                CategoriaDescricao = t.Categoria?.Descricao ?? string.Empty
            }).ToList();

            return Ok(response);
        }
    }
}