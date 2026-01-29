using Microsoft.AspNetCore.Mvc;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Controllers.Dtos.Categoria;

namespace TesteT.Api.Controllers
{
    [ApiController]
    [Route("api/categoria")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;
        public CategoriaController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaResponse>> Create([FromBody] CreateCategoriaRequest request, CancellationToken ct)
        {
            var categoria = await _categoriaService.CriarCategoriaAsync(request.Descricao, request.Finalidade, ct);

            var response = new CategoriaResponse
            {
                CategoriaId = categoria.CategoriaId,
                Descricao = categoria.Descricao,
                Finalidade = categoria.Finalidade
            };
            return CreatedAtAction(nameof(GetAll), new {}, response);
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoriaResponse>>> GetAll(CancellationToken ct)
        {
            var categorias = await _categoriaService.GetAllAsync(ct);

            var response = categorias.Select(c => new CategoriaResponse
            {
                CategoriaId = c.CategoriaId,
                Descricao = c.Descricao,
                Finalidade = c.Finalidade
            }).ToList();

            return Ok(response);
        }

        [HttpDelete("{categoriaId:int}")]
        public async Task<IActionResult> DeletarCategoria(int categoriaId, CancellationToken ct)
        {
            try
            {
                var deletar = await _categoriaService.DeletarCategoriaAsync(categoriaId, ct);
                if (!deletar)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}