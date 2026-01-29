using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Domain.Entities
{
    public class Transacao
    {
        public int TransacaoId { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; } //Usei decimal por ser valores monetários e o float/double podem gerar problemas
        public TipoTransacao Tipo { get; set; } //Decidir se é receita ou despesa
        public int PessoaId { get; set; } //FK para Pessoa
        public Pessoa Pessoa { get; set; } = null!;
        public int CategoriaId { get; set; }//FK para Categoria
        public Categoria Categoria { get; set; } = null!;
    }
}