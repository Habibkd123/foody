import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function HeroSlider() {
    const images = [
        "https://media.istockphoto.com/id/1427322105/photo/bombay-duck-fry-served-in-a-plate-over-white-background-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=VVjTpR29Qss8AMMmsuY-E5NlNWLPPW_5THMCqrgNJr4=",
        "https://images.unsplash.com/photo-1708184528301-b0dad28dded5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFBhc3RhJTIwQ29ybmVyJTIwSXRhbGlhbmZvb2R8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFNvdXRoJTIwSW5kaWFuJTIwU291dGglMjBEZWxpZ2h0cyUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
        "https://plus.unsplash.com/premium_photo-1717529138199-0644d58ce0cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U3dlZXQlMjBEcmVhbXMlMjBEZXNzZXJ0cyUyMGZvb2R8ZW58MHx8MHx8fDA%3D"
    ];

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
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${image})`,
                            }}
                        ></div>
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    );
}

