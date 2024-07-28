'use client'
import PlacesCard from '@/components/PlacesCard'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"

type Feature = {
  properties: {
    address_line1: string,
    address_line2: string,
  }
};

function Page() {
  const [data, setData] = useState<Feature[]>([]);
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    const localData = localStorage.getItem('searchData');
    const getData = async () => {
      try {
        if (localData) {
          const placesSearchValues = JSON.parse(localData);
          const longi = placesSearchValues.placesSearch.longi;
          const lati = placesSearchValues.placesSearch.lati;
          const newcategories = "accommodation.hotel";
          const url = "https://api.geoapify.com/v2/places";
          const params = {
            categories: newcategories,
            filter: `circle:${longi},${lati},5000`,
            bias: `proximity:${longi},${lati}`,
            limit: '100',
            apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_KEY as string,
          };

          const queryString = new URLSearchParams(params).toString();
          const placesData = await axios(`${url}?${queryString}`);
          setCityName(placesSearchValues.placesSearch.cityName);
          setData(placesData.data.features);
        } else {
          console.log("No Data received");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);


  return (

    <>
      <div className="absolute top-0 z-[-2] min-h-screen h-max w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" >
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
                  imageType={false}
                />
              </motion.div>
            ) : null
          ))}
        </div>
      </div>
    </>
  )
}

export default Page
