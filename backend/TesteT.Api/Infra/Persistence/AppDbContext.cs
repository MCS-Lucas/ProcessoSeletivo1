using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TesteT.Api.Application.Interfaces;
using TesteT.Api.Domain.Entities;

namespace TesteT.Api.Infra.Persistence
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas => Set<Pessoa>();
        public DbSet<Categoria> Categorias => Set<Categoria>();
        public DbSet<Transacao> Transacoes => Set<Transacao>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigurarPessoa(modelBuilder);
            ConfigurarCategoria(modelBuilder);
            ConfigurarTransacao(modelBuilder);
        }
        private void ConfigurarPessoa(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.ToTable("Pessoas");
                entity.HasKey(p => p.PessoaId);
                entity.Property(p => p.Nome).IsRequired().HasMaxLength(100);
                entity.Property(p => p.Idade).IsRequired();
            });
        }
        private void ConfigurarCategoria(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("Categorias");
                entity.HasKey(c => c.CategoriaId);
                entity.Property(c => c.Descricao).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Finalidade).IsRequired();
            });
        }
        private void ConfigurarTransacao(ModelBuilder modelBuilder)
        {
            var decimalConverter = new ValueConverter<decimal, string>(
                v => v.ToString(CultureInfo.InvariantCulture),
                v => decimal.Parse(v, CultureInfo.InvariantCulture));

            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.ToTable("Transacoes");
                entity.HasKey(t => t.TransacaoId);
                entity.Property(t => t.Descricao).IsRequired().HasMaxLength(200);
                entity.Property(t => t.Valor).IsRequired().HasConversion(decimalConverter).HasColumnType("TEXT");
                entity.Property(t => t.Tipo).IsRequired();
                entity.HasOne(t => t.Pessoa).WithMany(p => p.Transacoes).HasForeignKey(t => t.PessoaId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(t => t.Categoria).WithMany(c => c.Transacoes).HasForeignKey(t => t.CategoriaId).OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(t => t.PessoaId);
                entity.HasIndex(t => t.CategoriaId);

                //O Cascade ta sendo utilizado para que ao deletar uma pessoa, todas as transações associadas a ela também sejam deletadas.


            });
        }
    }
}