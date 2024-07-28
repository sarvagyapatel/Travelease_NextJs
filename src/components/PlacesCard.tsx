/* eslint-disable @next/next/no-img-element */
'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import cover from '@/components/cover.png'
import hotelCover from '@/components/hotelCover.png'
import { motion } from "framer-motion"


type PlacesCardProps = {
    address_line1: string,
    address_line2: string,
    cityName: string,
    imageType: boolean
};

function PlacesCard({ address_line1, address_line2, cityName, imageType }: PlacesCardProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const getImages = async () => {
                try {
                    const query = `${address_line1} ${cityName}`;
                    const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_CX}&q=${encodeURIComponent(query)}&searchType=image`;
                    const response = await axios(googleUrl);
                    console.log(response)
                    if (response.data.items && response.data.items.length > 0) {
                        setImageUrls(response.data.items.map((item: any) => item.link as string));
                    } else {
                        setError("No image found");
                    }
                } catch (error) {
                    console.log(error)
                    setError('error fetching images');
                } finally {
                    setLoading(false);
                }
            };

    return (
        <>
        <Card className="max-w-md mx-auto  rounded-2xl border-none bg-neutral-950 bg-[radial-gradient]">
            <CardHeader className="text-center text-white ">
                <CardTitle className="text-xl font-bold">{address_line1}</CardTitle>
            <CardDescription className="text-center text-gray-200 mt-3 font-semibold text-sm">{address_line2}</CardDescription>
            </CardHeader>
            {loading ? (
                // <p className="text-center p-4">Loading...</p>
                <div className="flex flex-col space-y-3 p-4">
                    <Image
                        src={imageType?(cover):(hotelCover)}
                        width={400}
                        height={200}
                        alt="Picture of the author"
                        onClick={getImages}
                        className="rounded-2xl shadow-slate-600 hover:cursor-pointer shadow-2xl"
                    />
                </div>
            ) : error ? (
                <p className="text-center p-4 text-red-500">{error}</p>
            ) : (
                <Carousel
                    plugins={[Autoplay({ delay: 3000 })]}
                    className="w-full max-w-lg md:max-w-xl"
                >
                    <CarouselContent className="pb-6 pt-3">
                        {imageUrls.map((image, index) => (
                            <CarouselItem key={index} className="flex justify-center items-center ">
                                <img
                                    src={image}
                                    alt={address_line1}
                                    className="object-cover w-full h-full rounded-lg shadow-md"
                                    style={{ maxWidth: '400px', maxHeight: '200px' }}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
        </Card>
        </>
    );
}

export default PlacesCard;
