using TesteT.Api.Domain.Enums;
using TesteT.Api.Domain.Entities;

namespace TesteT.Api.Application.Interfaces
{
    public interface ITransacaoService
    {
        Task<Transacao> CriarTransacaoAsync(string descricao, decimal valor, TipoTransacao tipo, int pessoaId, int categoriaId, CancellationToken ct);
        Task<IReadOnlyList<Transacao>> GetAllAsync(CancellationToken ct);
    }
}