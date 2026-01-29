using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Controllers.Dtos.Transacao
{
    public class CreateTransacaoRequest
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public int CategoriaId { get; set; }
        public int PessoaId { get; set; }
    }
}