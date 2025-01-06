import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Button, Rating } from '@mui/material';
import { MdClose } from 'react-icons/md';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

function CartModel({ open, onClose, product, language, quantity, setQuantity, index }) {
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image || (product.images && product.images[0]) || '');
        }
    }, [product]);


    const renderDetail = (labelEn, labelAr, value) => (
        <div className="col-6 mb-2">
            <p className="fw-bold text-secondary" style={{ fontSize: 'small' }}>
                <span className={`${language === 'ar' ? 'ms-2' : 'me-2'}`}>
                    {language === 'ar' ? `${labelAr} :` : `${labelEn} :`}
                </span>
                {value || '-'}
            </p>
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
                    <div className="col-5 product-images">
                        {selectedImage && (
                            <InnerImageZoom
                                src={selectedImage}
                                zoomSrc={selectedImage}
                                alt="Selected Product"
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    maxHeight: '300px',
                                }}
                            />
                        )}
                        <div className="d-flex mt-3 gap-2 justify-content-center">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt="Main Thumbnail"
                                    onClick={() => setSelectedImage(product.image)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        border: product.image === selectedImage ? '2px solid #262626' : '1px solid #ddd',
                                        cursor: 'pointer',
                                    }}
                                />
                            )}
                            {product.images &&
                                product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        onClick={() => setSelectedImage(image)}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: image === selectedImage ? '2px solid #262626' : '1px solid #ddd',
                                            cursor: 'pointer',
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className="col-7 product-info">
                        <h5 className="mb-3">{language === 'ar' ? 'التفاصيل' : 'Details'}</h5>
                        <p className="text-secondary mb-4" style={{ fontSize: 'small' }}>
                            {product.long_description}
                        </p>
                        <div className="row align-items-center">
                            {product.grade && renderDetail('Grade', 'التصنيف', product.grade)}
                            {product.sub_type && renderDetail('Sub Type', 'النوع الفرعي', product.sub_type)}
                            {product.dial_color && renderDetail('Dial Color', 'لون وجة الساعة', product.dial_color)}
                            {product.band_color && renderDetail('Band Color', 'لون السوار', product.band_color)}
                            {product.band_material && renderDetail('Band Material', 'مادة السوار', product.band_material)}
                            {product.case_size_type && renderDetail('Case Size', 'حجم الإطار', `${product.case_size} ${product.case_size_type}`)}
                            {product.water_resistance_size_type && renderDetail('Water Resistance', 'مقاومة الماء', `${product.water_resistance} ${product.water_resistance_size_type}`)}
                            {product.dial_display_type && renderDetail('Dial Display', 'عرض المينا', product.dial_display_type)}
                            {product.case_shape && renderDetail('Case Shape', 'شكل الإطار', product.case_shape)}
                            {product.watch_movement && renderDetail('Movement', 'نوع الحركة', product.watch_movement)}
                            {product.features && product.features.length > 0 && renderDetail('Features', 'المميزات', product.features.join(', '))}
                            {product.gender && product.gender.length > 0 && renderDetail('Gender', 'الجنس', product.gender.join(', '))}
                            <div className="quantity-control col-6 d-flex align-items-center">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setQuantity(index, - 1)}
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
                                    onClick={() => setQuantity(index, 1)}
                                    sx={{ minWidth: '30px', padding: '5px' }}
                                >
                                    +
                                </Button>
                            </div>
                            <div className="col-6 d-flex align-items-center">
                                {product.stock > 0 ? (
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

CartModel.propTypes = {
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
        dial_color: PropTypes.string,
        band_color: PropTypes.string,
        band_closure: PropTypes.string,
        dial_display_type: PropTypes.string,
        case_shape: PropTypes.string,
        band_material: PropTypes.string,
        watch_movement: PropTypes.string,
        water_resistance_size_type: PropTypes.string,
        case_size_type: PropTypes.string,
        band_size_type: PropTypes.string,
        band_width_size_type: PropTypes.string,
        case_thickness_size_type: PropTypes.string,
        watch_height_size_type: PropTypes.string,
        watch_width_size_type: PropTypes.string,
        watch_length_size_type: PropTypes.string,
        dial_glass_material: PropTypes.string,
        dial_case_material: PropTypes.string,
        country: PropTypes.string,
        stone: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        gender: PropTypes.arrayOf(PropTypes.string),

    }).isRequired,
    language: PropTypes.string.isRequired,
};

export default CartModel;
