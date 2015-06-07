using Autofac;
using Autofac.Integration.SignalR;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Owin;
using Thinktecture.Dwx2015.SignalR.Data;

namespace Thinktecture.Dwx2015.SignalR
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			var container = BuildDependencies();

			app.UseCors(CorsOptions.AllowAll);
			app.MapSignalR(new HubConfiguration
			{
				Resolver = new AutofacDependencyResolver(container),
				EnableDetailedErrors = true
			});
		}

		private static IContainer BuildDependencies()
		{
			var builder = new ContainerBuilder();
			builder.RegisterType<DataProvider>().SingleInstance();
			builder.RegisterType<ConsumptionUpdater>().SingleInstance();
			builder.RegisterHubs(typeof(Startup).Assembly);

			return builder.Build();
		}
	}
}