'use client'

import React from 'react';

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
  
interface MyCardProps {
    flight: FlightDetails
}

const FlightCard: React.FC<MyCardProps> = ({flight}) => {
    return (
        <div className="w-fit mx-auto bg-white shadow-md rounded-lg overflow-hidden my-4 border border-gray-200">
            <div className="flex items-center p-4 bg-blue-50">
                <h2 className="text-gray-800 text-lg font-semibold">{flight.airline}</h2>
            </div>
            <div className="p-4 flex flex-row items-center justify-center">
                <div className="flex flex-wrap gap-14 items-center justify-center" >
                    <div>
                        <p className="text-xl font-bold text-gray-800">{flight.departure.time}</p>
                        <p className="text-sm text-gray-500">{flight.departure.city}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-600 text-xs">{flight.duration}</p>
                        <div className="h-1 w-full bg-green-500 mt-1 mb-1"></div>
                        <p className="text-green-500 text-xs">{flight.stops}</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-800">{flight.arrival.time}</p>
                        <p className="text-sm text-gray-500">{flight.arrival.city}</p>
                    </div>
                    <div className="flex flex-col justify-between items-center">
                        <p className="text-lg font-semibold text-gray-800">{flight.price}</p>
                        <p className="text-sm text-gray-500">per adult</p>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default FlightCard;


