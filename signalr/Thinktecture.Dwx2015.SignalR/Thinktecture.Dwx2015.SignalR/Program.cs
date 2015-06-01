using System;
using Microsoft.Owin.Hosting;

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

				Console.ReadLine();
			}
		}
	}
}
