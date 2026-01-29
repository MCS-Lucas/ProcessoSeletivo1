namespace TesteT.Api.Controllers.Dtos.Pessoa
{
    public class CreatePessoaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }
}