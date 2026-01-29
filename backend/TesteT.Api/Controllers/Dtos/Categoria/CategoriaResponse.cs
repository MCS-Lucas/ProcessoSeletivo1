using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Controllers.Dtos.Categoria
{
    public class CategoriaResponse
    {
        public int CategoriaId { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
    }
}