using System;
using System.Threading.Tasks;
using Microsoft.Owin;

namespace Thinktecture.Dwx2015.SignalR
{
	public class FailSafeMiddleware : OwinMiddleware
	{
		public FailSafeMiddleware(OwinMiddleware next) : base(next)
		{
		}

		public override async Task Invoke(IOwinContext context)
		{
			try
			{
				await Next.Invoke(context);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
			}
		}
	}
}