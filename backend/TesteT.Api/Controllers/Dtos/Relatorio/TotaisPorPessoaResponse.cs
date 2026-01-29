namespace TesteT.Api.Controllers.Dtos.Relatorio
{
   public class TotaisPorPessoaResponse
   {
       public List<TotalPorPessoaItemResponse> Itens { get; set; } = new();
       public decimal TotalReceitasGeral { get; set; }
       public decimal TotalDespesasGeral { get; set; }
       public decimal SaldoLiquidoGeral { get; set; }

    }
}
