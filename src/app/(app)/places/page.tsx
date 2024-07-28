'use client'
import PlacesCard from '@/components/PlacesCard'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"

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
      <div className="absolute top-0 z-[-2] h-max w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" >
      <div className='w-full h-24 flex flex-row items-center justify-center gap-2'>
        <motion.div 
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 1.5 }}
        className='w-fit h-fit'>
          <Button className=' text-neutral-950 border-neutral-950  border-2 font-bold hover:bg-slate-600 text-3xl p-2  pb-4 pt-3  font-sans bg-white shadow-2xl shadow-slate-600' onClick={flightSearch}>
            FlightSearch
          </Button>
        </motion.div>
        <motion.div 
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: 100 }}
        transition={{ duration: 1.5 }}
        className='w-fit h-fit'>
          <Button className=' text-neutral-950 border-neutral-950  border-2 font-bold hover:bg-slate-600 text-3xl p-2  pb-4 pt-3 font-sans bg-white shadow-2xl shadow-slate-600' onClick={hotelSearch}>
            HotelSearch
          </Button>
        </motion.div>
      </div>
      <div className='flex flex-wrap w-full items-center justify-center gap-4 mt-10'>
        {data.map((feature, index) => (
          feature.properties.address_line1?.trim() ? (
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 1.5 }}
                className='w-fit h-fit' key={index}>
                <PlacesCard
                  key={index}
                  address_line1={feature.properties.address_line1}
                  address_line2={feature.properties.address_line2}
                  cityName={cityName}
                  imageType={true}
                />
              </motion.div>
          ) : null
        ))}
      </div>
      </div>
    </div>
  )
}

export default Page
