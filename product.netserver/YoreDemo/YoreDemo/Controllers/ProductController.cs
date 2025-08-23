using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using YoreDemo.Models;
namespace YoreDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("Policy1")]
    public class ProductController : ControllerBase
    {
        private readonly YoreContext _context;

        public ProductController(YoreContext context)
        {
            _context = context;
        }

        // GET: api/<ProductController>
        [HttpGet]
        public IEnumerable<Product> Get()
        {
            return _context.Products.ToList();
        }

        // GET api/<ProductController>/5
        [HttpGet("{id}")]
        public Product? Get(int id)
        {
            return _context.Products.Find(id);

        }

        // POST api/<ProductController>
        //[HttpPost]
        //public void Post([FromBody] Product prdt)
        //{
        //    _context.Products.Add(prdt);
        //    _context.SaveChanges();
        //}
        [HttpPost]
        public IActionResult Post([FromForm] string name,
                                  [FromForm] string description,
                                  [FromForm] decimal price,
                                  [FromForm] IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            // Save image to wwwroot/images
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            var product = new Product
            {
                Name = name,
                Description = description,
                Price = price,
                ImageUrl = "/images/" + uniqueFileName
            };

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok(product);
        }

        // PUT api/<ProductController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Product prdt)
        {
            Product prdtToUpdate = _context.Products.Find(id);
            if (prdtToUpdate != null)
            {
                prdtToUpdate.Name = prdt.Name;
                prdtToUpdate.Description = prdt.Description;
                prdtToUpdate.Price = prdt.Price;
                _context.SaveChanges();
            }
        }

        // DELETE api/<ProductController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Product product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
        }
    }
}
