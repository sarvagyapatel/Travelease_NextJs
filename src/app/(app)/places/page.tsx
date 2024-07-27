'use client'
import PlacesCard from '@/components/PlacesCard'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useId, useState } from 'react'

type Feature = {
  properties: {
    address_line1: string,
    address_line2: string,
  }
};

function Page() {
  const router = useRouter();
  const [data, setData] = useState<Feature[]>([]);
  const [cityName, setCityName] = useState("");

  


  useEffect(() => {
    const localData = localStorage.getItem('searchData');
    const getData = async () => {
      try {
        if (localData) {
          const placesSearchValues = JSON.parse(localData);
          console.log(placesSearchValues)
          const longi = placesSearchValues.placesSearch.longi
          const lati = placesSearchValues.placesSearch.lati
          const newcategories = placesSearchValues.placesSearch.categories
          const url = "https://api.geoapify.com/v2/places";
          const params = {
            categories: newcategories as string,
            filter: `circle:${longi},${lati},5000`,
            bias: `proximity:${longi},${lati}`,
            limit: '100',
            apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_KEY as string,
          };

          const queryString = new URLSearchParams(params as Record<string, string>).toString();
          const placesData = await axios(`${url}?${queryString}`);
          // console.log(placesData)
          setCityName(placesSearchValues.placesSearch.cityName)
          setData(placesData.data.features);
        }
        else {
          console.log("No Data recieved")
        }
      } catch (error) {
        console.error('Error parsing JSON from localStorage', error);
      }
    }
    getData();
  }, [])

  const hotelSearch = ()=>{
    router.push('/hotels');
  }

  const flightSearch = ()=>{
    router.push('/flight');
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='w-full h-20 flex flex-row items-center justify-center gap-8 bg-blue-950'>
        <div>
          <Button className='bg-white text-black font-semibold hover:bg-white text-2xl font-sans' onClick={flightSearch}>
            FlightSearch
          </Button>
        </div>
        <div>
          <Button className='bg-white text-black font-semibold hover:bg-white text-2xl font-sans' onClick={hotelSearch}>
            HotelSearch
          </Button>
        </div>
      </div>
      <div className='flex flex-wrap w-full items-center justify-center gap-4 mt-10'>
        {data.map((feature, index) => (
          feature.properties.address_line1?.trim() ? (
            <PlacesCard
              key={index}
              address_line1={feature.properties.address_line1}
              address_line2={feature.properties.address_line2}
              cityName={cityName}
              imageType={true}
            />
          ) : null
        ))}
      </div>
    </div>
  )
}

export default Page
