using System;
using System.Timers;

namespace Thinktecture.Dwx2015.SignalR.Data
{
	public class ConsumptionUpdater
	{
		private readonly DataProvider _dataProvider;
		private readonly Random _random;
		private readonly Timer _timer;

		private const int MinUpdateIntervalInMilliseconds = 1;
		private const int MaxUpdateIntervalInMilliseconds = 1000;

		public ConsumptionUpdater(DataProvider dataProvider)
		{
			_dataProvider = dataProvider;
			_random = new Random();

			_timer = new Timer();
			_timer.Elapsed += TimerElapsed;
		}

		public IGummibearClientHub Clients { get; set; }

		public void Start()
		{
			_timer.Start();
		}

		private void TimerElapsed(object sender, ElapsedEventArgs e)
		{
			UpdateConsumptionData();
			SetNextInterval();
		}

		private void UpdateConsumptionData()
		{
			var data = _dataProvider.Data;

			var continent = (Continent)_random.Next(0, data.Count);
			var newValue = _random.NextDouble()*100;

			Clients.UpdateConsumption(continent.ToString(), newValue);
			Console.WriteLine("Update contintent {0} to be {1}", continent, newValue);
		}

		private void SetNextInterval()
		{
			_timer.Interval = _random.Next(MinUpdateIntervalInMilliseconds, MaxUpdateIntervalInMilliseconds);
		}
	}
}