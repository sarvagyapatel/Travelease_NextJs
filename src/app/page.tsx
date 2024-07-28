'use client'

import CategoryButtonGroup from "@/components/CategoryButtonGroup";
import ControlledDatePicker from "@/components/ControlledDatePicker";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { dataSchema } from "@/schemas/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Send } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import logo from '@/app/logo/logo.png'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Home() {

  const router = useRouter();

  const form = useForm<z.infer<typeof dataSchema>>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      origin: '',
      destination: '',
      date: {
        from: new Date(),
        to: new Date()
      },
      categories: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false)

  type seachDataType = {
    flightSearch: {
      originCode: string,
      destinationCode: string,
      startDate: string,
      endDate: string,
      access_token: string
    },
    placesSearch: {
      cityName: string,
      longi: string,
      lati: string,
      categories: string
    }
  };

  const onSubmit = async (data: z.infer<typeof dataSchema>) => {
    const startDate = format(data.date.from, 'yyyy-MM-dd') as unknown as string;
    const endDate = format(data.date.to, 'yyyy-MM-dd') as unknown as string;
    const newcategories = data.categories.join();
    // console.log(newcategories)

    try {
      setIsLoading(true);
      const accessToken = await axios.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_AMADEUS_API_KEY}&client_secret=${process.env.NEXT_PUBLIC_AMADEUS_API_SECRET}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      const originCity = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${data.origin}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.data.access_token}`,
          }
        }
      )
      const destinationCity = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${data.destination}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.data.access_token}`,
          }
        }
      )

      const searchData: seachDataType = {
        flightSearch: {
          originCode: originCity.data.data[0].iataCode,
          destinationCode: destinationCity.data.data[0].iataCode,
          startDate: startDate,
          endDate: endDate,
          access_token: accessToken.data.access_token
        },
        placesSearch: {
          cityName: data.destination,
          longi: destinationCity.data.data[0].geoCode.longitude,
          lati: destinationCity.data.data[0].geoCode.latitude,
          categories: newcategories
        }
      }

      const handleClick = () => {
        localStorage.setItem('searchData', JSON.stringify(searchData));
        router.push('/places');
      };
      setIsLoading(false);
      handleClick();

    } catch (error) {
      setIsLoading(false)
      console.error(error)
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-4 ">
     <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="flex flex-col items-center justify-center gap-1 -mt-32">
        <div>
          <Image
            src={logo}
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="flex flex-row items-center gap-2">
                  <FormField
                    name="origin"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          className="max-w-36 rounded-2xl"
                          placeholder="From"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="destination"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          className="max-w-36 rounded-2xl"
                          placeholder="To"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <ControlledDatePicker defaultValue={field.value} {...field} />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row items-center justify-center rounded-full ">
                    <Button className="rounded-full bg-indigo-800 shadow-2xl">
                      {isLoading?(
                        <Loader2 className="h-7 w-7 animate-spin"/>
                      ):(
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <FormField
                  name="categories"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <CategoryButtonGroup
                        options={[
                          ['Culture', 'entertainment.culture'],
                          ['CityTour', 'tourism'],
                          ['Nature', 'natural'],
                          ['Restaurant', 'catering.restaurant'],
                          ['Health', 'healthcare'],
                          ['NightLife', 'adult.nightclub'],
                          ['Educational', 'education'],
                          ['Religion', 'religion'],
                          ['Entertainment', 'entertainment'],
                          ['Shopping', 'commercial.shopping_mall'],
                        ]}
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

