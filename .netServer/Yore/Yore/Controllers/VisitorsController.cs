using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VisitorsApi.Models;
using VisitorsApi.Models.DTOs;

namespace VisitorsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitorsController : ControllerBase
    {
        private readonly BsDb _context;

        public VisitorsController(BsDb context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visitor>>> GetVisitors()
        {
            return await _context.Visitors.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Visitor>> AddVisitor([FromBody] VisitorCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var visitor = new Visitor
            {
                FullName = dto.FullName,
                VisitDate = dto.VisitDate,
                PhoneNo = dto.PhoneNo,
                Age = dto.Age,
                Email = dto.Email
            };

            _context.Visitors.Add(visitor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVisitors), new { id = visitor.VisitorId }, visitor);
        }
    }
}
