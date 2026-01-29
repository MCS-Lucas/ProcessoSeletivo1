namespace TesteT.Api.Domain.Entities
{
    public class Pessoa
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public List<Transacao> Transacoes { get; set; } = new ();
    }
}