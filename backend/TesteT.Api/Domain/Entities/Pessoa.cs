namespace TesteT.Api.Domain.Entities
{
    public class Pessoa
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty; //Achei melhor usar o string.Empty para evitar nulls
        public int Idade { get; set; }
        public List<Transacao> Transacoes { get; set; } = new ();
    }
}