using System;
using System.Threading;
using Microsoft.AspNet.SignalR;

namespace Thinktecture.Dwx2015.SignalR.Data
{
	public class DataUpdater
	{
		private const int IntervalInMilliseconds = 200;
		private const int MaxValue = 100;

		private readonly IHubContext _hub;
		private readonly Timer _taskTimer;
		private readonly Random _random;

		public DataUpdater()
		{
			_hub = GlobalHost.ConnectionManager.GetHubContext<GummibearHub>();
			_taskTimer = new Timer(OnTimerElapsed, null, IntervalInMilliseconds, IntervalInMilliseconds);

			_random = new Random();
		}

		private void OnTimerElapsed(object state)
		{
			var continent = (Continent)_random.Next(0, DataProvider.Data.Count);
			var newValue = _random.NextDouble() * MaxValue;

			DataProvider.Data[continent] = newValue;

			Console.WriteLine("Update consumption of {0} to {1}", continent, newValue);
			_hub.Clients.All.UpdateConsumption(continent.ToString(), newValue);
		}

		public void Stop()
		{
			_taskTimer.Dispose();
		}
	}
}