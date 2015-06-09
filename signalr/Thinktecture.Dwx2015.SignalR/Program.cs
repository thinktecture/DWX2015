using System;
using System.Threading.Tasks;
using Microsoft.Owin.Hosting;
using Thinktecture.Dwx2015.SignalR.Data;

namespace Thinktecture.Dwx2015.SignalR
{
	class Program
	{
		static void Main(string[] args)
		{
			using (WebApp.Start<Startup>("http://+:8080"))
			{
				Console.WriteLine("DWX 2015 SignalR server running.");
#if __MonoCS__
				Console.WriteLine("... on Mono!");
#endif

				Task.Factory.StartNew(() => new DataUpdater());
				
				Console.ReadLine();
			}
		}
	}
}
