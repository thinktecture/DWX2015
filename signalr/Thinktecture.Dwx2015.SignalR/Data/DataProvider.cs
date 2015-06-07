using System.Collections.Generic;

namespace Thinktecture.Dwx2015.SignalR.Data
{
	public class DataProvider
	{
		public DataProvider()
		{
			Data = new Dictionary<Continent, double>
			{
				{Continent.Europe, 85},
				{Continent.NorthAmerica, 100},
				{Continent.SouthAmerica, 55},
				{Continent.Asia, 35},
				{Continent.Africa, 5},
				{Continent.Australia, 75},
				{Continent.Antarctica, 3},
				{Continent.Moon, 1}
			};
		}

		public Dictionary<Continent, double> Data { get; private set; } 
	}
}