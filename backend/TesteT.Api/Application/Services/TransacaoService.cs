using Microsoft.EntityFrameworkCore;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Domain.Entities;
using TesteT.Api.Domain.Enums;

namespace TesteT.Api.Application.Services
{
    public class TransacaoService : ITransacaoService
    {
        private readonly IAppDbContext _db;
        public TransacaoService(IAppDbContext db)
        {
            _db = db;
        }
        public async Task<Transacao> CriarTransacaoAsync(string descricao, decimal valor, TipoTransacao tipo, int pessoaId, int categoriaId, CancellationToken ct)
        {
            descricao = (descricao ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(descricao))
            {
                throw new ArgumentException("Descrição é obrigatória.", nameof(descricao));
            }
            if (valor <= 0)
            {
                throw new ArgumentException("Valor inválido, deve ser maior que zero.", nameof(valor));
            }
            if (!Enum.IsDefined(typeof(TipoTransacao), tipo))
            {
                throw new ArgumentException("Tipo de transação inválido.", nameof(tipo));
            }

            var pessoa = await _db.Pessoas.FirstOrDefaultAsync(p => p.PessoaId == pessoaId, ct);
            if (pessoa == null)
            {
                throw new KeyNotFoundException("Pessoa não encontrada.");
            }

            // Aqui aplica a regra: menor de 18 anos não pode cadastrar receitas.
            if (pessoa.Idade < 18 && tipo == TipoTransacao.Receita)
            {
                throw new InvalidOperationException("Menores de 18 anos não podem cadastrar receita, apenas despesas.");
            }

            var categoria = await _db.Categorias.FirstOrDefaultAsync(c => c.CategoriaId == categoriaId, ct);
            if (categoria == null)
            {
                throw new KeyNotFoundException("Categoria não encontrada.");
            }

            var categoriaTransacao =
                categoria.Finalidade == FinalidadeCategoria.Ambas ||
                (categoria.Finalidade == FinalidadeCategoria.Despesa && tipo == TipoTransacao.Despesa) ||
                (categoria.Finalidade == FinalidadeCategoria.Receita && tipo == TipoTransacao.Receita);

            // Aqui verifica se a categoria é compatível com a transação.
            if (!categoriaTransacao)
            {
                throw new InvalidOperationException("Categoria não é compatível com o tipo de transação.");
            }

            var transacao = new Transacao
            {
                Descricao = descricao,
                Valor = valor,
                Tipo = tipo,
                PessoaId = pessoaId,
                CategoriaId = categoriaId
            };

            _db.Transacoes.Add(transacao);
            await _db.SaveChangesAsync(ct);

            return transacao;
        }

        public async Task<IReadOnlyList<Transacao>> GetAllAsync(CancellationToken ct)
        {
            return await _db.Transacoes
                .AsNoTracking()
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .OrderBy(t => t.TransacaoId)
                .ToListAsync(ct);
        }
    }
}