import React, { memo, useContext } from "react";
import Slider from "react-slick";
import { MyContext } from "../../App";
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";

function HomeSlider({ banners }) {
    const { language } = useContext(MyContext);

    function NextArrow(props) {
        const { onClick } = props;
        return (
            <IoIosArrowDroprightCircle
                style={{
                    fontSize: "40px",
                    color: "#fff",
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "10px",
                    left: "auto",
                    zIndex: 10,
                    cursor: "pointer",
                }}
                onClick={onClick}
            />
        );
    }

    // Custom Left Arrow
    function PrevArrow(props) {
        const { onClick } = props;
        return (
            <IoIosArrowDropleftCircle
                style={{
                    fontSize: "40px",
                    color: "#fff",
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "10px",
                    right: "auto",
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
        speed: 600,
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
                            loading="lazy"
                            style={{
                                width: "100%",
                                height: "375px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default memo(HomeSlider);
