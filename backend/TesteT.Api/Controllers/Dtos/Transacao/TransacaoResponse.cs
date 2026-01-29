using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Controllers.Dtos.Transacao
{
    public class TransacaoResponse
    {
        public int TransacaoId { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public TipoTransacao Tipo { get; set; }
        public decimal Valor { get; set; }

        public int PessoaId { get; set; }
        public string PessoaNome { get; set; } = string.Empty;

        public int CategoriaId { get; set; }
        public string CategoriaDescricao { get; set; } = string.Empty;
    }
}