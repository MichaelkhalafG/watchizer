import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Button, Rating } from '@mui/material';
import { MdClose } from 'react-icons/md';
import InnerImageZoom from 'react-inner-image-zoom';
import defimg from '../../assets/images/1.webp'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { MyContext } from '../../App';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductModel({ open, onClose, product, language }) {
    const { user_id, fetchCart, handleAddTowishlist } = useContext(MyContext)
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedDialColor, setSelectedDialColor] = useState(null);
    const [selectedBandColor, setSelectedBandColor] = useState(null);
    const [stock, setstock] = useState();

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image || product.images?.[0] || "");
            setstock(parseInt(product.stock));
        }

    }, [product]);

    const handleQuantityChange = (change) => {
        setQuantity((prev) => Math.max(1, Math.min(prev + change, stock)));
    };

    const renderDetail = (labelEn, labelAr, value, fs, col) => (
        <div className={`${col} mb-2`}>
            <p className="fw-bold text-secondary" style={{ fontSize: fs }}>
                <span className={`${language === "ar" ? "ms-2" : "me-2"}`}>
                    {language === "ar" ? `${labelAr} :` : `${labelEn} :`}
                </span>
                {value || "-"}
            </p>
        </div>
    );

    const handleAddToCart = () => {
        if (!selectedDialColor || !selectedBandColor) {
            alert(language === "ar" ? "يرجى اختيار لون السوار ولون وجه الساعة." : "Please select both dial color and band color.");
            return;
        }

        const piecePrice = parseInt(product.sale_price_after_discount, 10);
        const totalPrice = piecePrice * quantity;

        if (isNaN(totalPrice) || totalPrice <= 0) {
            console.error("Invalid total price calculation.");
            alert(language === "ar" ? "حدث خطأ في حساب السعر الإجمالي." : "There was an error calculating the total price.");
            return;
        }

        const payload = {
            user_id: user_id,
            product_id: product.id,
            quantity: quantity,
            piece_price: piecePrice,
            color_band: selectedBandColor,
            color_dial: selectedDialColor,
            total_price: totalPrice,
        };

        axios.post("https://dash.watchizereg.com/api/add_to_cart", payload, {
            headers: {
                "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"
            }
        })
            .then(() => {
                alert(language === "ar" ? "تمت الإضافة إلى السلة!" : "Added to the cart!");
                fetchCart()
            })
            .catch((error) => {
                console.error("Error adding to cart:", error);
                alert(language === "ar" ? "حدث خطأ أثناء الإضافة إلى السلة." : "An error occurred while adding to the cart.");
            });
    };



    const renderColorDetail = (labelEn, labelAr, colors, fs, col, setColor) => (
        <div className={`${col} mb-2`}>
            <div className="fw-bold text-secondary" style={{ fontSize: fs }}>
                <span className={`${language === "ar" ? "ms-2" : "me-2"}`}>
                    {language === "ar" ? `${labelAr} :` : `${labelEn} :`}
                </span>
                <div className="d-flex gap-2">
                    {colors && colors.map((color, index) => (
                        <div
                            key={index}
                            onClick={() => setColor(color.color_value)}
                            style={{
                                backgroundColor: color.color_value || "#f0f0f0",
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: selectedDialColor === color.color_value || selectedBandColor === color.color_value
                                    ? '2px solid #000'
                                    : '1px solid #ddd',
                                cursor: 'pointer',
                            }}
                            title={language === 'ar' ? color.color_name_ar : color.color_name_en}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (!product) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: language === 'ar' ? 'unset' : '50%',
                    right: language === 'ar' ? '50%' : 'unset',
                    transform: language === 'ar' ? 'translate(50%, -50%)' : 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '900px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '10px',
                    overflow: "hidden"
                }}
                className={`p-5 ${language === 'ar' ? 'rtl' : 'ltr'}`}
                style={{
                    position: 'relative',
                    direction: language === 'ar' ? 'rtl' : 'ltr',

                }}
            >
                <div className="row border-bottom border-2 product-header mb-3">
                    <div className="col-12">
                        <h4 className="fw-bold">{product.product_title}</h4>
                    </div>
                    <div className="col-4">
                        {renderDetail('Brand', 'البراند', product.brand)}
                    </div>
                    <div className="col-4">
                        {renderDetail('Type', 'النوع', product.category_type)}
                    </div>
                    <div className="col-4">
                        <Rating name="read-only" value={Math.round(product.rating === null ? 5 : product.rating)} size="small" readOnly />
                    </div>
                </div>
                <div className="row product-details">
                    <div className="col-md-5 product-images">
                        <div className="selected-image mb-3 d-flex justify-content-center">
                            {selectedImage && (
                                <InnerImageZoom
                                    src={selectedImage}
                                    zoomSrc={selectedImage || defimg}
                                    alt="Selected Product"
                                    style={{
                                        width: "100%",
                                        borderRadius: "8px",
                                        objectFit: "cover",
                                        maxHeight: "300px",

                                    }}
                                    zoomType="hover"
                                    zoomPreload={true}
                                    zoomScale={2}
                                />
                            )}
                        </div>
                        <div className="d-flex mt-3 gap-2 justify-content-center flex-wrap">
                            {product?.image && (
                                <img
                                    src={product.image}
                                    alt="Main Thumbnail"
                                    onClick={() => setSelectedImage(product.image)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: product.image === selectedImage ? "2px solid #262626" : "1px solid #ddd",
                                        cursor: "pointer",
                                        boxShadow: product.image === selectedImage ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                                    }}
                                    className="thumbnail"
                                />
                            )}
                            {product?.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => setSelectedImage(image)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: image === selectedImage ? "2px solid #262626" : "1px solid #ddd",
                                        cursor: "pointer",
                                        boxShadow: image === selectedImage ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                                    }}
                                    className="thumbnail"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col-7 product-info">
                        <h5 className="mb-3">{language === 'ar' ? 'التفاصيل' : 'Details'}</h5>
                        <p className="text-secondary mb-4" style={{ fontSize: 'small' }}>
                            {product.long_description}
                        </p>
                        <div className="row">
                            {product?.grade && renderDetail("Grade", "التصنيف", product.grade, "small", "col-6")}
                            {product?.sub_type && renderDetail("Sub Type", "النوع الفرعي", product.sub_type, "small", "col-6")}
                            {product?.dial_display_type && renderDetail("Dial Display", "نوع عرض وجة الساعة", product.dial_display_type, "small", "col-6")}
                            {product?.band_material && renderDetail("Band Material", "مادة السوار", product.band_material, "small", "col-6")}
                            {product?.dial_glass_material && renderDetail("Dial Glass Material", "مادة زجاج الوجة", product.dial_glass_material, "small", "col-6")}
                            {product?.dial_case_material && renderDetail("Dial Case Material", "مادة اطار الوجة", product.dial_case_material, "small", "col-6")}
                            {product?.features?.length > 0 && renderDetail("Features", "الميزات", product.features.join(", "), "small", "col-6")}
                            {product?.gender?.length > 0 && renderDetail("Gender", "الجنس", product.gender.join(", "), "small", "col-6")}
                            <div className="fw-bold text-secondary mb-2 col-12" style={{ fontSize: 'medium' }}>
                                {language === 'ar' ? 'اختر اللون' : 'Chosse colors'}
                            </div>
                            {product?.dial_color && renderColorDetail("Dial Color", "لون وجة الساعة", product.dial_color, "small", "col-6", setSelectedDialColor)}
                            {product?.band_color && renderColorDetail("Band Color", "لون السوار", product.band_color, "small", "col-6", setSelectedBandColor)}
                            <div className="quantity-control col-6 d-flex align-items-center">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    sx={{ minWidth: '30px', padding: '5px' }}
                                >
                                    -
                                </Button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    style={{
                                        width: '40px',
                                        textAlign: 'center',
                                        margin: '0 10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleQuantityChange(1)}
                                    sx={{ minWidth: '30px', padding: '5px' }}
                                >
                                    +
                                </Button>
                            </div>
                            <div className="col-6 d-flex align-items-center">
                                {stock && parseInt(stock) > 0 ? (
                                    <span className="badge bg-success" style={{ fontSize: '0.9rem' }}>
                                        {language === 'ar' ? 'متوفر' : 'In Stock'}
                                    </span>
                                ) : (
                                    <span className="badge bg-danger" style={{ fontSize: '0.9rem' }}>
                                        {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 action-buttons">
                            <button
                                className={`${language === "ar" ? "ms-2" : "me-2"} btn btn-dark`}
                                onClick={handleAddToCart}
                                disabled={stock <= 0}
                            >
                                {language === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                            </button>
                            <Link
                                to={`/product/${product.id}`}
                            >
                                <button
                                    className={`${language === "ar" ? "ms-2" : "me-2"} btn btn-dark`}
                                >
                                    {language === 'ar' ? 'تفاصيل اكثر' : 'More '}
                                </button>
                            </Link>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => handleAddTowishlist(product.id, "p")}
                            >
                                {language === "ar" ? "أضف إلى قائمة الرغبات" : "Add to Wish List"}
                            </button>
                        </div>
                    </div>
                </div>
                <Button
                    className="close"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: language === 'ar' ? 'unset' : '10px',
                        left: language === 'ar' ? '10px' : 'unset',
                        color: '#555',
                    }}
                    onClick={onClose}
                >
                    <MdClose />
                </Button>
            </Box>
        </Modal>
    );
}

ProductModel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.shape({
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
    }).isRequired,
    language: PropTypes.string.isRequired,
};

export default ProductModel;
