using System.Collections.Generic;
using Microsoft.AspNet.SignalR;
using Thinktecture.Dwx2015.SignalR.Data;

namespace Thinktecture.Dwx2015.SignalR
{
	public class GummibearHub : Hub
	{
		public Dictionary<Continent, double> GetCurrentConsumption()
		{
			return DataProvider.Data;
		}
	}
}