using Microsoft.EntityFrameworkCore;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Domain.Entities;

namespace TesteT.Api.Application.Services
{
    public class PessoaService : IPessoaService
    {
        private readonly IAppDbContext _db;
        public PessoaService(IAppDbContext db)
        {
            _db = db;
        }
        public async Task<Pessoa> CriarPessoaAsync(string nome, int idade, CancellationToken ct)
        {
            nome = (nome ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(nome))
            {
                throw new ArgumentException("Nome é obrigatório.", nameof(nome));
            }
            if (idade <= 0)
            {
                throw new ArgumentException("Idade inválida, use apenas números inteiros positivos.", nameof(idade));
            }

            var pessoa = new Pessoa
            {
                Nome = nome,
                Idade = idade
            };

            _db.Pessoas.Add(pessoa);
            await _db.SaveChangesAsync(ct);
            
            return pessoa;
        }

        public async Task<IReadOnlyList<Pessoa>> GetAllAsync(CancellationToken ct)
        {
            return await _db.Pessoas.AsNoTracking().OrderBy(p => p.PessoaId).ToListAsync(ct);
        }

        public async Task<bool> DeletarPessoaAsync(int pessoaId, CancellationToken ct)
        {
            var pessoa = await _db.Pessoas.FirstOrDefaultAsync(p => p.PessoaId == pessoaId, ct);
            if (pessoa == null)
            {
                return false;
            }

            //Ao deletar uma pessoa, vai remover também suas transações (garantido via Cascade no EF).
            _db.Pessoas.Remove(pessoa);
            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}