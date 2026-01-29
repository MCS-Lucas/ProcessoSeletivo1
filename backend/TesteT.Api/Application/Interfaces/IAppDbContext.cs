using Microsoft.EntityFrameworkCore;
using TesteT.Api.Domain.Entities;

namespace TesteT.Api.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Pessoa> Pessoas { get; }
        DbSet<Categoria> Categorias { get; }
        DbSet<Transacao> Transacoes { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
