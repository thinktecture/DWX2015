using System.Collections.Generic;
using Microsoft.AspNet.SignalR.Hubs;
using Thinktecture.Dwx2015.SignalR.Data;

namespace Thinktecture.Dwx2015.SignalR
{
	public interface IGummibearServerHub : IHub
	{
		Dictionary<Continent, double> GetCurrentConsumption(); 
	}
}