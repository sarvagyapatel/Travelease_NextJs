'use client'
import PlacesCard from '@/components/PlacesCard'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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

    <div className='flex flex-wrap w-full items-center justify-center gap-4 mt-10'>
      {data.map((feature, index) => (
        feature.properties.address_line1?.trim() ? (
          <PlacesCard
            key={index}
            address_line1={feature.properties.address_line1}
            address_line2={feature.properties.address_line2}
            cityName={cityName}
            imageType={false}
          />
        ) : null
      ))}
    </div>
  )
}

export default Page
