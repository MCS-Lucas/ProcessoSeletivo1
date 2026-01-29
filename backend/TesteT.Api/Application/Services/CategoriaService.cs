using Microsoft.EntityFrameworkCore;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Domain.Entities;
using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Application.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IAppDbContext _db;
        public CategoriaService(IAppDbContext db)
        {
            _db = db;
        }
        public async Task<Categoria> CriarCategoriaAsync(string descricao, FinalidadeCategoria finalidade, CancellationToken ct)
        {
            descricao = (descricao ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(descricao))
            {
                throw new ArgumentException("Descrição é obrigatória.", nameof(descricao));
            }
            if(!Enum.IsDefined(typeof(FinalidadeCategoria), finalidade))
            {
                throw new ArgumentException("Finalidade inválida.", nameof(finalidade));
            }

            var categoria = new Categoria
            {
                Descricao = descricao,
                Finalidade = finalidade
            };

            _db.Categorias.Add(categoria);
            await _db.SaveChangesAsync(ct);

            return categoria;
        }

        public async Task<IReadOnlyList<Categoria>> GetAllAsync(CancellationToken ct)
        {
            return await _db.Categorias.AsNoTracking().OrderBy(c => c.CategoriaId).ToListAsync(ct);
        }

        public async Task<bool> DeletarCategoriaAsync(int categoriaId, CancellationToken ct)
        {
            var categoria = await _db.Categorias.FirstOrDefaultAsync(c => c.CategoriaId == categoriaId, ct);
            if (categoria == null)
            {
                return false;
            }

            //Verifica se a categoria tem transações relacionadas antes de deletar 
            var usando = await _db.Transacoes.AsNoTracking().AnyAsync(t => t.CategoriaId == categoriaId, ct);

            if (usando)
            {
                throw new InvalidOperationException("Não é possível deletar a categoria. Existem transações relacionadas a ela.");
            }

            _db.Categorias.Remove(categoria);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}