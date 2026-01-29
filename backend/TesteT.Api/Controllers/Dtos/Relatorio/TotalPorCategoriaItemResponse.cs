namespace TesteT.Api.Controllers.Dtos.Relatorio
{
    public class TotalPorCategoriaItemResponse
    {
        public int CategoriaId { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}
