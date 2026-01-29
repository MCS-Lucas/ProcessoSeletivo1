namespace TesteT.Api.Controllers.Dtos.Pessoa
{
    public class PessoaResponse
    {
        public int PessoaId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }
}