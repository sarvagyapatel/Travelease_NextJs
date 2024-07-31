'use client'

import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import FlightCard from '@/components/FlightCard';
import { Loader2 } from 'lucide-react';

type FlightDetails = {
  airline: string,
  departure: {
    time: string,
    city: string,
  },
  arrival: {
    time: string,
    city: string,
  },
  duration: string,
  stops: string,
  price: string,
};

function FlightSearch() {

  const [departureFlights, setDepartureFlights] = useState<FlightDetails[]>([]);
  const [returnFlights, setReturnFlights] = useState<FlightDetails[]>([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const localData = localStorage.getItem('searchData') as string;
    const getData = async () => {
      try {
        setLoading(true)
        const flightSearchValues = JSON.parse(localData);
        const originCode = (flightSearchValues.flightSearch.originCode);
        const destinationCode = (flightSearchValues.flightSearch.destinationCode);

        const departureFlightData = await axios(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${flightSearchValues.flightSearch.startDate}&adults=1&max=10`,
          {
            headers: {
              Authorization: `Bearer ${flightSearchValues.flightSearch.access_token}`,
            }
          }
        )

        const returnFlightData = await axios(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${flightSearchValues.flightSearch.endDate}&adults=1&max=10`,
          {
            headers: {
              Authorization: `Bearer ${flightSearchValues.flightSearch.access_token}`,
            }
          }
        )

        const newFlights: FlightDetails[] = departureFlightData.data.data.map((flight: any) => (
          {
            airline: departureFlightData.data.dictionaries.carriers[flight.itineraries[0].segments[0].carrierCode],
            departure: {
              time: flight.itineraries[0].segments[0].departure.at.split('T')[1],
              city: flight.itineraries[0].segments[0].departure.iataCode,
            },
            arrival: {
              time: flight.itineraries[0].segments[0].arrival.at.split('T')[1],
              city: flight.itineraries[0].segments[0].arrival.iataCode,
            },
            duration: (flight.itineraries[0].segments[0].duration).replace("PT", ""),
            stops: (flight.itineraries[0].segments).length - 1,
            price: `₹ ${Math.floor(flight.travelerPricings[0].price.total * 90)}`,
          }
        ))

        const newFlights1: FlightDetails[] = returnFlightData.data.data.map((flight: any) => (
          {
            airline: returnFlightData.data.dictionaries.carriers[flight.itineraries[0].segments[0].carrierCode],
            departure: {
              time: flight.itineraries[0].segments[0].departure.at.split('T')[1],
              city: flight.itineraries[0].segments[0].departure.iataCode,
            },
            arrival: {
              time: flight.itineraries[0].segments[0].arrival.at.split('T')[1],
              city: flight.itineraries[0].segments[0].arrival.iataCode,
            },
            duration: (flight.itineraries[0].segments[0].duration).replace("PT", ""),
            stops: (flight.itineraries[0].segments).length - 1,
            price: `₹ ${Math.floor(flight.travelerPricings[0].price.total * 90)}`,
          }
        ))
        console.log(departureFlightData)
        setDepartureFlights(newFlights);
        setReturnFlights(newFlights1);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false)
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Loader2 className='text-gray-700 h-36 w-36 animate-spin' />
      </div>
    );
  } else {
    return (
      <div className='flex flex-wrap items-center justify-center'>
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-2">
          <h1 className='mt-8 text-2xl font-bold -mb-4 w-full flex items-center justify-center rounded-3xl border-4'>Departure</h1>
          {departureFlights.map((flight, index) => (
            <div key={index} className="flex flex-wrap gap-4 items-center justify-center" >
              <FlightCard flight={flight} />
            </div>
          ))}
        </div>
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-2">
          <h1 className='mt-8 text-2xl font-bold -mb-4   w-full flex items-center justify-center rounded-3xl border-4'>Return</h1>
          {returnFlights.map((flight, index) => (
            <div key={index} className="flex flex-wrap gap-4 items-center justify-center" >
              <FlightCard flight={flight} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default FlightSearch