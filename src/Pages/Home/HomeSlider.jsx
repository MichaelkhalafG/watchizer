import { memo, useContext, useEffect } from "react";
import Slider from "react-slick";
import { MyContext } from "../../Context/Context";
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";

function HomeSlider({ banners }) {
    useEffect(() => {
    if (banners.length > 0) {
        const firstBanner = banners[0].image;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = `https://dash.watchizereg.com/Uploads_Images/Banner_home/${firstBanner}?format=webp`;
        document.head.appendChild(link);
    }
}, [banners]);


    const { language, windowWidth } = useContext(MyContext);
    const sliderHeight = windowWidth >= 768 ? "375px" : "250px";

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
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: "anticipated",
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
                            src={`https://dash.watchizereg.com/Uploads_Images/Banner_home/${item.image}?format=webp&width=${windowWidth}`}
                            alt={`banner${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                            ref={(img) => img && img.setAttribute("fetchpriority", "high")}
                            width="100%"
                            height={sliderHeight}
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: sliderHeight,
                                aspectRatio: "16 / 9",
                            }}
                        />
                        {/* <img
                            src={`https://dash.watchizereg.com/Uploads_Images/Banner_home/${item.image}?format=webp&width=${windowWidth}`}
                            alt={`banner${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            ref={(img) => img && img.setAttribute("fetchpriority", "high")}
                            width="100%"
                            height={sliderHeight}
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: sliderHeight,
                            }}
                        /> */}
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default memo(HomeSlider);
