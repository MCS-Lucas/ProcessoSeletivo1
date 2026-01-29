using Microsoft.AspNetCore.Mvc;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Controllers.Dtos.Pessoa;

namespace TesteT.Api.Controllers
{
    [ApiController]
    [Route("api/pessoas")]
    public class PessoaController : ControllerBase
    {
        private readonly IPessoaService _pessoaService;
        public PessoaController(IPessoaService pessoaService)
        {
            _pessoaService = pessoaService;
        }

        [HttpPost]
        public async Task<ActionResult<PessoaResponse>> Create([FromBody] CreatePessoaRequest request, CancellationToken ct)
        {
            var pessoa = await _pessoaService.CriarPessoaAsync(request.Nome, request.Idade, ct);

            var response = new PessoaResponse
            {
                PessoaId = pessoa.PessoaId,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade
            };
            return CreatedAtAction(nameof(GetAll), new { }, response);
        }
        
        [HttpGet]
        public async Task<ActionResult<List<PessoaResponse>>> GetAll(CancellationToken ct)
        {
            var pessoas = await _pessoaService.GetAllAsync(ct);
            var response = pessoas.Select(p => new PessoaResponse()
            {
                PessoaId = p.PessoaId,
                Nome = p.Nome,
                Idade = p.Idade

            }).ToList();

            return Ok(pessoas);
        }

        [HttpDelete("{pessoaId:int}")]
        public async Task<IActionResult> Delete([FromRoute] int pessoaId, CancellationToken ct)
        {
            var deletar = await _pessoaService.DeletarPessoaAsync(pessoaId, ct);
            if (!deletar)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}