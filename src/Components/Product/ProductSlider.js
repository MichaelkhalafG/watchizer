import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Button, Rating } from '@mui/material';
import {
    IoIosArrowForward,
    IoIosArrowBack,
    IoIosArrowDropleftCircle,
    IoIosArrowDroprightCircle,
} from 'react-icons/io';
import { FaRegHeart } from 'react-icons/fa';
import { SlSizeFullscreen } from 'react-icons/sl';
import { MyContext } from '../../App';
import './Product.css';
import ProductModel from './ProductModel';

function NextArrow({ onClick }) {
    return (
        <IoIosArrowDroprightCircle
            style={{
                fontSize: '40px',
                color: '#26262696',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: '10px',
                zIndex: 10,
                cursor: 'pointer',
            }}
            onClick={onClick}
        />
    );
}

function PrevArrow({ onClick }) {
    return (
        <IoIosArrowDropleftCircle
            style={{
                fontSize: '40px',
                color: '#26262696',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: '10px',
                zIndex: 10,
                cursor: 'pointer',
            }}
            onClick={onClick}
        />
    );
}

function ProductSlider({ text, products, to, moreid }) {
    const { language, setgradesfilters, windowWidth, handleAddTowishlist } = useContext(MyContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const filteredProducts = products.filter((product) => product.active === 1);

    const handleProductClick = (product) => {
        setSelectedProduct(product);

        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 2,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        rtl: language === 'ar',
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
    };
    return (
        <>
            <div className="col-12 d-flex px-3 info">
                <div className="col-md-10 col-8">
                    <h4 className="color-most-used fw-bold">
                        {language === 'ar' ? text.title.ar : text.title.en}
                    </h4>
                    <p className="text-secondary fs-large" style={{ fontSize: "small" }}>
                        {language === 'ar' ? text.description.ar : text.description.en}
                    </p>
                </div>
                <div className="col-md-2 col-4">
                    <Link to={to}>
                        <Button className="color-most-used rounded-4 px-3 border border-1"
                            onClick={() =>
                                setgradesfilters({
                                    categories: [],
                                    brands: [],
                                    subTypes: [],
                                    grades: [moreid],
                                    price: [0, 6000],
                                })
                            }>
                            {language === 'ar' ? 'مشاهدة المزيد' : 'View More'}
                            {language === 'ar' ? <IoIosArrowBack className="me-2" /> : <IoIosArrowForward className="ms-2" />}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="row product-slider pb-5">
                <Slider {...sliderSettings}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="p-2" style={{ height: '100%' }}>
                            <div className="card product-card border-0 rounded-3 shadow-sm d-flex flex-column position-relative">
                                <div className="action-menu position-absolute">
                                    {windowWidth >= 768 ?
                                        <button
                                            className="btn btn-dark rounded-circle"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <SlSizeFullscreen />
                                        </button>
                                        :
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="btn btn-dark rounded-circle"
                                        >
                                            <SlSizeFullscreen />
                                        </Link>
                                    }

                                    <button
                                        className="btn mt-2 btn-danger rounded-circle"
                                        onClick={() => handleAddTowishlist(product.id, "p")}
                                    >
                                        <FaRegHeart />
                                    </button>
                                </div>

                                <Link to={`/product/${product.id}`} className="product-img-container">
                                    <img
                                        src={product.image}
                                        alt={product.wa_code}
                                        className="img-fluid rounded-top"
                                        loading="lazy"
                                    />
                                </Link>

                                <div className="card-body d-flex flex-column justify-content-between p-3">
                                    <h6 className={`card-title ${language === 'ar' ? 'text-end' : ''} fs-large fw-bold mb-2`} style={{ fontSize: 'small' }}>{product.product_title}</h6>
                                    <p className={`card-text ${language === 'ar' ? 'text-end' : ''}  text-secondary mb-3`} style={{ fontSize: '0.9rem' }}>
                                        {product.short_description.length > 100
                                            ? `${product.short_description.slice(0, 100)}...`
                                            : product.short_description}
                                    </p>

                                    <div className="d-flex justify-content-center align-items-center mb-2">
                                        <span className="color-most-used fw-bold me-2 fs-large" style={{ fontSize: 'small' }}>
                                            {Math.round(product.sale_price_after_discount)} {language === 'ar' ? 'ج.م' : 'EGP'}
                                        </span>
                                        <span className="text-muted text-decoration-line-through fs-large" style={{ fontSize: 'small' }}>
                                            {Math.round(product.selling_price)} {language === 'ar' ? 'ج.م' : 'EGP'}
                                        </span>
                                    </div>

                                    <div className="d-md-flex  justify-content-between align-items-center">
                                        <div className='col-md-6 col-12 p-1'>
                                            <span className={`badge ${parseInt(product.stock) > 0 ? 'bg-success' : 'bg-danger'} col-12`}>
                                                {language === 'ar' ? (parseInt(product.stock) > 0 ? 'متوفر' : 'غير متوفر') : (parseInt(product.stock) > 0 ? 'In Stock' : 'Out of Stock')}
                                            </span>
                                        </div>
                                        <div className="d-flex col-md-6 p-1 justify-content-center col-12 align-items-center">
                                            <Rating name="read-only" className={`${windowWidth <= 768 ? "col-12" : ""}`} value={Math.round(product.rating === null ? 5 : product.rating)} size="small" readOnly />
                                            <span className={` ms-2 ${windowWidth <= 768 ? "d-none" : ""}`}>({Math.round(product.rating === null ? 5 : product.rating)})</span>
                                        </div>
                                    </div>

                                    <Link to={`/product/${product.id}`}
                                        className="btn btn-outline-dark rounded-4 mt-2"
                                        disabled={parseInt(product.stock) <= 0}
                                    >
                                        {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {selectedProduct && (
                <ProductModel
                    open={isModalOpen}
                    onClose={handleModalClose}
                    product={selectedProduct}
                    language={language}
                />
            )}
        </>
    );
}

ProductSlider.propTypes = {
    text: PropTypes.shape({
        title: PropTypes.shape({
            en: PropTypes.string.isRequired,
            ar: PropTypes.string.isRequired,
        }).isRequired,
        description: PropTypes.shape({
            en: PropTypes.string.isRequired,
            ar: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            product_title: PropTypes.string.isRequired,
            model_name: PropTypes.string,
            long_description: PropTypes.string.isRequired,
            short_description: PropTypes.string.isRequired,
            selling_price: PropTypes.string.isRequired,
            sale_price_after_discount: PropTypes.string.isRequired,
            percentage_discount: PropTypes.string.isRequired,
            stock: PropTypes.number.isRequired,
            rate: PropTypes.number,
            image: PropTypes.string,
            images: PropTypes.arrayOf(PropTypes.string),
            category_type: PropTypes.string.isRequired,
            brand: PropTypes.string.isRequired,
            grade: PropTypes.string,
            sub_type: PropTypes.string.isRequired,
            dial_color: PropTypes.arrayOf(
                PropTypes.shape({
                    color_id: PropTypes.number,
                    color_value: PropTypes.string,
                    color_name_ar: PropTypes.string,
                    color_name_en: PropTypes.string,
                })
            ),
            band_color: PropTypes.arrayOf(
                PropTypes.shape({
                    color_id: PropTypes.number,
                    color_value: PropTypes.string,
                    color_name_ar: PropTypes.string,
                    color_name_en: PropTypes.string,
                })
            ),
            band_closure: PropTypes.string,
            dial_display_type: PropTypes.string,
            case_shape: PropTypes.string,
            band_material: PropTypes.string,
            watch_movement: PropTypes.string,
            water_resistance_size_type: PropTypes.string,
            water_resistance: PropTypes.number,
            case_size_type: PropTypes.string,
            case: PropTypes.string,
            band_size_type: PropTypes.string,
            band_length: PropTypes.string,
            band_width_size_type: PropTypes.string,
            band_width: PropTypes.string,
            case_thickness_size_type: PropTypes.string,
            case_thickness: PropTypes.string,
            watch_height_size_type: PropTypes.string,
            watch_width_size_type: PropTypes.string,
            watch_length_size_type: PropTypes.string,
            dial_glass_material: PropTypes.string,
            watch_height: PropTypes.string,
            watch_width: PropTypes.string,
            watch_length: PropTypes.string,
            dial_case_material: PropTypes.string,
            country: PropTypes.string,
            stone: PropTypes.string,
            features: PropTypes.arrayOf(PropTypes.string),
            gender: PropTypes.arrayOf(PropTypes.string),
        })
    ).isRequired,
};



export default ProductSlider;
