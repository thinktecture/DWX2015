﻿using Microsoft.Owin.Cors;
using Owin;

namespace Thinktecture.Dwx2015.SignalR
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			app.Use<FailSafeMiddleware>();
			app.UseCors(CorsOptions.AllowAll);
			app.MapSignalR();
		}
	}
}