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
    }
}