using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace VisitorsApi.Models
{
    [Table("visitors")] 
    public class Visitor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("visitor_id")]
        public int VisitorId { get; set; }

        [Column("full_name")]
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Column("visit_date")]
        public DateTime VisitDate { get; set; }

        [Column("phone_no")]
        [StringLength(10)]
        public string PhoneNo { get; set; } = string.Empty;

        [Column("age")]
        public int Age { get; set; }

        [Column("email")]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
    }
public class BsDb : DbContext
{

        public BsDb(DbContextOptions<BsDb> options) : base(options)
        {
        }
        public DbSet<Visitor> Visitors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Yore;Integrated Security=True;Encrypt=True;");
    }
}
}
