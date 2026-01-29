namespace TesteT.Api.Controllers.Dtos.Relatorio
{
    public class TotaisPorCategoriaResponse
    {
        public List<TotalPorCategoriaItemResponse> Itens { get; set; } = new();
        public decimal TotalReceitasGeral { get; set; }
        public decimal TotalDespesasGeral { get; set; }
        public decimal SaldoLiquidoGeral { get; set; }
    }
}
