namespace YoreDemo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add controllers
            builder.Services.AddControllers();

            // Add CORS policy for React app
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

            // Serve static files (images in wwwroot)
            app.UseStaticFiles();

            app.UseRouting();

            // Enable CORS between UseRouting and UseAuthorization
            app.UseCors("AllowReactApp");

            app.UseAuthorization();

            // Map API controllers
            app.MapControllers();

            app.Run();
        }
    }
}
