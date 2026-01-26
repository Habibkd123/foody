import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
const swiperStyles = `
  .swiper {
    --swiper-theme-color: #fff;
    --swiper-navigation-size: 24px;
    --swiper-pagination-bullet-size: 8px;
    --swiper-pagination-bullet-horizontal-gap: 6px;
  }
  .swiper-wrapper {
    align-items: center;
  }
  .swiper-slide {
    background: white;
  }
`;

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
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = swiperStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    return (
        <div className="w-full overflow-hidden bg-white">
            <div className="hidden md:block">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh]"
                >
                    {(banners && banners.length > 0 ? banners : images).map((src: string, index: number) => (
                        <SwiperSlide key={`desktop-${src}-${index}`} className="relative">
                            <div className="relative w-full h-full">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover object-center block"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="md:hidden px-2">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={12}
                    slidesPerView={1.1}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="w-full py-3"
                >
                    {(banners && banners.length > 0 ? banners : images).map((src: string, index: number) => (
                        <SwiperSlide key={`mobile-${src}-${index}`}>
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover object-center block"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
