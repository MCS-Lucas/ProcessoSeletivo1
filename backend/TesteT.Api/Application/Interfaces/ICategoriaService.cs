using TesteT.Api.Domain.Enums;
using TesteT.Api.Domain.Entities;

namespace TesteT.Api.Application.Interfaces
{
    public interface ICategoriaService
    {
        Task<Categoria> CriarCategoriaAsync(string descricao, FinalidadeCategoria finalidade, CancellationToken ct);
        Task<IReadOnlyList<Categoria>> GetAllAsync(CancellationToken ct);
    }
}