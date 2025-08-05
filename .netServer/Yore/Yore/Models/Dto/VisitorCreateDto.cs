using System;
using System.ComponentModel.DataAnnotations;

namespace VisitorsApi.Models.DTOs
{
    public class VisitorCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        public DateTime VisitDate { get; set; }

        [Required]
        [StringLength(10)]
        public string PhoneNo { get; set; } = string.Empty;

        public int Age { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
    }
}
