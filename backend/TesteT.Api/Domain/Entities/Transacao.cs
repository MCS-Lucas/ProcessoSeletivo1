using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Domain.Entities
{
    public class Transacao
    {
        public int TransacaoId { get; set; }
        public string Descricao { get; set; } = string.Empty; //Usando string.Empty para evitar nulls
        public decimal Valor { get; set; } //Usei decimal e não float/double para evitar problemas de precisão com valores monetários
        public TipoTransacao Tipo { get; set; } //Decidir se é receita ou despesa
        public int PessoaId { get; set; } //FK para Pessoa
        public Pessoa Pessoa { get; set; } = null!;
        public int CategoriaId { get; set; }//FK para Categoria
        public Categoria Categoria { get; set; } = null!;
    }
}