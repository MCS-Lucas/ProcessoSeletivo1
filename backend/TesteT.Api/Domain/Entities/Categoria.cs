using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Domain.Entities
{
    public class Categoria
    {
        public int CategoriaId { get; set; }
        public string Descricao { get; set; } = string.Empty; //Usei string.Empty para evitar nulls
        public FinalidadeCategoria Finalidade { get; set; }
    }
}