using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YoreDemo.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("price", TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [MaxLength(255)]
        [Column("image_url")]
        public string ImageUrl { get; set; } = string.Empty;
    }



        public class YoreContext : DbContext
        {
            public YoreContext(DbContextOptions<YoreContext> options)
                : base(options)
            {
            }

            public DbSet<Product> Products { get; set; }
        }
    }


