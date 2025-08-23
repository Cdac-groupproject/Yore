using Microsoft.EntityFrameworkCore;
using YoreDemo.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register DbContext (Update with your actual connection string)
builder.Services.AddDbContext<YoreContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors((corsoptions) =>
{
    corsoptions.AddPolicy("Policy1", (policy) =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Middlewares
app.UseStaticFiles();
app.UseRouting();
app.UseCors("Policy1");
app.UseAuthorization();
app.MapControllers();
app.Run();
