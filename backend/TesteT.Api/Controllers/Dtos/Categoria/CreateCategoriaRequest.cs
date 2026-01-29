using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Controllers.Dtos.Categoria
{
    public class CreateCategoriaRequest
    {
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
    }
}