import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function HeroSlider({ type }: { type: string }) {

    const [banners, setBanners] = useState<string[]>([]);
    const images = [
        "https://cdn.pixabay.com/photo/2013/04/03/19/23/easter-100176_640.jpg",
        "https://cdn.pixabay.com/photo/2017/08/01/11/13/cheese-2564544_640.jpg",
        "https://cdn.pixabay.com/photo/2018/05/09/22/45/dessert-3386368_640.jpg",
        "https://plus.unsplash.com/premium_photo-1717529138199-0644d58ce0cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U3dlZXQlMjBEcmVhbXMlMjBEZXNzZXJ0cyUyMGZvb2R8ZW58MHx8MHx8fDA%3D"
    ];

    useEffect(() => {
        fetchBanners();
        // re-fetch when type changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    async function fetchBanners() {
        try {
            const res = await fetch("/api/banner?active=true&type=" + type, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            console.log("Banner data11:", data);

            if (data?.status && Array.isArray(data?.banners)) {
                const urls = data.banners
                    .map((banner: any) => banner?.imageUrl)
                    .filter((u: any) => typeof u === 'string' && u.length > 0);
                setBanners(urls);
            } else {
                setBanners([]);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
    }
    return (
        <div className="w-full h-screen">
            <Swiper
                modules={[Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="w-full h-full"
            >
                {(banners && banners.length > 0 ? banners : images).map((src: string, index: number) => (
                    <SwiperSlide key={`${src}-${index}`}>
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${src})`,
                            }}
                        ></div>
                    </SwiperSlide>
                ))}


            </Swiper>
        </div>
    );
}
