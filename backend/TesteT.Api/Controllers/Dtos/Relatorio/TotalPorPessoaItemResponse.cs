namespace TesteT.Api.Controllers.Dtos.Relatorio
{
    public class TotalPorPessoaItemResponse
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}
