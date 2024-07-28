'use client'

import { useEffect } from 'react'
import axios, { AxiosError } from 'axios'

type flightData = {

}

function FlightSearch() {

  useEffect(() => {
    const localData = localStorage.getItem('searchData') as string;
    const getData = async () => {
      try {
        const flightSearchValues = JSON.parse(localData);
        const originCode = (flightSearchValues.flightSearch.originCode);
        const destinationCode= (flightSearchValues.flightSearch.destinationCode);
        const amadeusFlightUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${flightSearchValues.flightSearch.startDate}&returnDate=${flightSearchValues.flightSearch.endDate}&adults=1&max=50`;

        const flightData =await axios(amadeusFlightUrl,
          {
            headers: {
              Authorization: `Bearer ${flightSearchValues.flightSearch.access_token}`,
            }
          }
        )

        console.log(flightData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);

  return (
    <div className="absolute top-0 z-[-2] h-max min-h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" >

    </div>
  )
}

export default FlightSearch