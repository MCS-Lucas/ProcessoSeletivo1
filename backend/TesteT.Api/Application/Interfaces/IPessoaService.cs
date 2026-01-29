using TesteT.Api.Domain.Entities;

namespace TesteT.Api.Application.Interfaces
{
    public interface IPessoaService
    {
        Task<Pessoa> CreateAsync(string nome, int idade, CancellationToken ct);
        Task<IReadOnlyList<Pessoa>> GetAllAsync(CancellationToken ct);
        Task<bool> DeleteAsync(int pessoaId, CancellationToken ct);
    }
}