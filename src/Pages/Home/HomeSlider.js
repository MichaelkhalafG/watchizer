import React, { memo, useContext } from "react";
import Slider from "react-slick";
import { MyContext } from "../../App";
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";

function HomeSlider({ banners }) {
    const { language, windowWidth } = useContext(MyContext);
    const sliderHeight = windowWidth >= 768 ? "375px" : "20vh"; // Direct calculation (no useState)

    function NextArrow({ onClick }) {
        return (
            <IoIosArrowDroprightCircle
                style={{
                    fontSize: "40px",
                    color: "#fff",
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "10px",
                    zIndex: 10,
                    cursor: "pointer",
                }}
                onClick={onClick}
            />
        );
    }

    function PrevArrow({ onClick }) {
        return (
            <IoIosArrowDropleftCircle
                style={{
                    fontSize: "40px",
                    color: "#fff",
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "10px",
                    zIndex: 10,
                    cursor: "pointer",
                }}
                onClick={onClick}
            />
        );
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500, // Slightly faster transition
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: "ondemand",
        rtl: language === "ar",
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div style={{ position: "relative" }}>
            <Slider {...settings}>
                {banners.map((item, index) => (
                    <div key={index} className="col-12">
                        <img
                            src={`https://dash.watchizereg.com/Uploads_Images/Banner_home/${item.image}`}
                            alt={`banner${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchpriority={index === 0 ? "high" : "auto"}
                            width="100%"
                            height={sliderHeight}
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: sliderHeight,
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default memo(HomeSlider);
