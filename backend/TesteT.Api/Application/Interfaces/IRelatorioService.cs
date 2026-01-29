using TesteT.Api.Controllers.Dtos.Relatorio;

namespace TesteT.Api.Application.Interfaces
{
    public interface IRelatorioService
    {
        Task<TotaisPorPessoaResponse> ObterTotaisPorPessoaAsync(CancellationToken ct);
        Task<TotaisPorCategoriaResponse> ObterTotaisPorCategoriaAsync(CancellationToken ct);
    }
}


