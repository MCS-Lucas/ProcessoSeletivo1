using Microsoft.EntityFrameworkCore;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Domain.Enums;
using TesteT.Api.Controllers.Dtos.Relatorio;

namespace TesteT.Api.Application.Services
{
    public class RelatorioService : IRelatorioService
    {
        private readonly IAppDbContext _db;
        public RelatorioService(IAppDbContext db)
        {
            _db = db;
        }
        public async Task<TotaisPorPessoaResponse> ObterTotaisPorPessoaAsync(CancellationToken ct)
        {
            var pessoas = await _db.Pessoas
                .AsNoTracking()
                .OrderBy(p => p.PessoaId)
                .ToListAsync(ct);

            var transacaoes = await _db.Transacoes
                .AsNoTracking()
                .ToListAsync(ct);

            var transacoesPorPessoa = transacaoes
                .GroupBy(t => t.PessoaId)
                .ToDictionary(g => g.Key, g => g.ToList());

            var response = new TotaisPorPessoaResponse();

            foreach (var pessoa in pessoas)
            {
                transacoesPorPessoa.TryGetValue(pessoa.PessoaId, out var lista);
                lista ??= new List<Domain.Entities.Transacao>();

                var totalReceitas = lista.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var totalDespesas = lista.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

                response.Itens.Add(new TotalPorPessoaItemResponse
                {
                    PessoaId = pessoa.PessoaId,
                    Nome = pessoa.Nome,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    SaldoLiquido = totalReceitas - totalDespesas
                });

                response.TotalReceitasGeral += totalReceitas;
                response.TotalDespesasGeral += totalDespesas;
            }

            response.SaldoLiquidoGeral = response.TotalReceitasGeral - response.TotalDespesasGeral;

            return response;
        }

        public async Task<TotaisPorCategoriaResponse> ObterTotaisPorCategoriaAsync(CancellationToken ct)
        {
            var categorias = await _db.Categorias
                .AsNoTracking()
                .OrderBy(c => c.CategoriaId)
                .ToListAsync(ct);

            var transacaoes = await _db.Transacoes
                .AsNoTracking()
                .ToListAsync(ct);

            var transacoesPorCategoria = transacaoes
                .GroupBy(t => t.CategoriaId)
                .ToDictionary(g => g.Key, g => g.ToList());

            var response = new TotaisPorCategoriaResponse();

            foreach (var categoria in categorias)
            {
                transacoesPorCategoria.TryGetValue(categoria.CategoriaId, out var lista);
                lista ??= new List<Domain.Entities.Transacao>();

                var totalReceitas = lista.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var totalDespesas = lista.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

                response.Itens.Add(new TotalPorCategoriaItemResponse
                {
                    CategoriaId = categoria.CategoriaId,
                    Descricao = categoria.Descricao,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    SaldoLiquido = totalReceitas - totalDespesas
                });

                response.TotalReceitasGeral += totalReceitas;
                response.TotalDespesasGeral += totalDespesas;
            }
            response.SaldoLiquidoGeral = response.TotalReceitasGeral - response.TotalDespesasGeral;

            return response;
        }
    }
}