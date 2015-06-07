using System.Collections.Generic;
using Microsoft.AspNet.SignalR;
using Thinktecture.Dwx2015.SignalR.Data;

namespace Thinktecture.Dwx2015.SignalR
{
	public class GummibearHub : Hub<IGummibearClientHub>, IGummibearServerHub
	{
		private readonly DataProvider _dataProvider;
		private readonly ConsumptionUpdater _updater;

		public GummibearHub(DataProvider dataProvider, ConsumptionUpdater updater)
		{
			_dataProvider = dataProvider;
			_updater = updater;
		}

		public Dictionary<Continent, double> GetCurrentConsumption()
		{
			_updater.Clients = Clients.All;
			_updater.Start();

			return _dataProvider.Data;
		}
	}
}