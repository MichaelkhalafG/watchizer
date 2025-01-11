import { useContext, useEffect, useState, useCallback } from "react";
import { Rating, Button, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import "./Product.css";
import PropTypes from "prop-types";
import ProductSlider from "./ProductSlider";
import DOMPurify from "dompurify";
import { MyContext } from "../../App";
import axios from "axios";

function ProductDisplay() {
    const { id } = useParams();
    const { language, users, products, user_id, fetchCart } = useContext(MyContext);
    const [realetedProducts, setRelatedProducts] = useState();
    const [selectedDialColor, setSelectedDialColor] = useState(null);
    const [selectedBandColor, setSelectedBandColor] = useState(null);
    const product = products.find((p) => p.id === parseInt(id));
    const [selectedImage, setSelectedImage] = useState("");
    const [ratings, setRatings] = useState([]);
    const [stock, setstock] = useState();
    const [quantity, setQuantity] = useState(1);
    const [totalRating, setTotalRating] = useState(5);
    const [ratingsOpen, setRatingsOpen] = useState(false);
    const [newRating, setNewRating] = useState({ value: 0, comment: "" });
    const handleRatingClick = () => setRatingsOpen((prev) => !prev);

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


    const fetchRatings = useCallback(async () => {
        try {
            const response = await axios.get(
                "https://dash.watchizereg.com/api/all_product_rating",
                {
                    headers: {
                        "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0",
                    },
                }
            );
            const productRatings = response.data.filter((r) => r.product_id === product?.id);
            setRatings(productRatings);
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image || product.images?.[0] || "");
            fetchRatings();

            const related = products.filter(
                (p) => p.grade_id === product.grade_id && p.id !== product.id
            );
            setRelatedProducts(related);
            setstock(parseInt(product.stock));
        }
    }, [product, products, fetchRatings]);


    useEffect(() => {
        if (ratings.length > 0) {
            const total = ratings.reduce((acc, r) => acc + r.rating, 0);
            setTotalRating(total / ratings.length);
        } else {
            setTotalRating(5);
        }
    }, [ratings]);

    const handleRatingSubmit = async (value, comment) => {
        const sanitizedComment = DOMPurify.sanitize(comment);

        if (value && sanitizedComment.trim()) {
            try {
                await axios.post(
                    "https://dash.watchizereg.com/api/add_product_rating",
                    null,
                    {
                        params: {
                            product_id: product.id,
                            rating: value,
                            comment: sanitizedComment,
                            user_id: user_id,
                        },
                        headers: {
                            "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0",
                        },
                    }
                );

                await fetchRatings();
                setNewRating({ value: 0, comment: "" });
            } catch (error) {
                console.error("Error submitting rating:", error);
                alert(
                    language === "ar"
                        ? "حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى."
                        : "An error occurred while submitting the rating. Please try again."
                );
            }
        } else {
            alert(
                language === "ar"
                    ? "يرجى إدخال تقييم وتعليق صحيح"
                    : "Please enter a valid rating and comment"
            );
        }
    };


    return (
        <div className="container">
            <div className="row border-bottom border-2 ps-1 p-4 pb-2 product-header mb-3">
                <div className="col-12">
                    <h3 className="fw-bold">{product?.product_title || "-"}</h3>
                </div>
                <div className="col-4">
                    {renderDetail("Brand", "البراند", product?.brand, "Medium", "col-12")}
                </div>
                <div className="col-4">
                    {renderDetail("Type", "النوع", product?.category_type, "Medium", "col-12")}
                </div>
                <div className="col-4">
                    <Rating
                        name="read-only"
                        value={totalRating}
                        size="small"
                        readOnly
                    />
                </div>
            </div>

            <div className="row product-details">
                <div className="col-md-4 product-images">
                    <div className="selected-image mb-3 d-flex justify-content-center">
                        {selectedImage && (
                            <InnerImageZoom
                                src={selectedImage}
                                zoomSrc={selectedImage}
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

                <div className="col-md-8 product-info">
                    <h5 className="mb-3">{language === "ar" ? "التفاصيل" : "Details"}</h5>
                    <p className="text-secondary fw-bold mb-3" style={{ fontSize: "large" }}>
                        {product?.long_description || (language === "ar" ? "لا يوجد وصف" : "No description available")}
                    </p>
                    <div className="row">
                        {product?.grade && renderDetail("Grade", "التصنيف", product.grade, "small", "col-4")}
                        {product?.sub_type && renderDetail("Sub Type", "النوع الفرعي", product.sub_type, "small", "col-4")}
                        {product?.band_closure && renderDetail("Band Closure", "إغلاق السوار", product.band_closure, "small", "col-4")}
                        {product?.dial_display_type && renderDetail("Dial Display", "نوع عرض وجة الساعة", product.dial_display_type, "small", "col-4")}
                        {product?.case_shape && renderDetail("Case Shape", "شكل العلبة", product.case_shape, "small", "col-4")}
                        {product?.band_material && renderDetail("Band Material", "مادة السوار", product.band_material, "small", "col-4")}
                        {product?.watch_movement && renderDetail("Watch Movement", "حركة الساعة", product.watch_movement, "small", "col-4")}
                        {product?.water_resistance && renderDetail("Water Resistance", "مقاومة الماء", `${product.water_resistance} ${product.water_resistance_size_type}`, "small", "col-4")}
                        {product?.case_thickness && renderDetail("Case Size", "حجم العلبة", `${product.case_thickness} ${product.case_size_type}`, "small", "col-4")}
                        {product?.band_length && renderDetail("Band Length", "طول السوار", `${product.band_length} ${product.band_size_type}`, "small", "col-4")}
                        {product?.band_width && renderDetail("Band Width", "عرض السوار", `${product.band_width} ${product.band_width_size_type}`, "small", "col-4")}
                        {product?.case_thickness && renderDetail("Case Thickness", "سمك العلبة", `${product.case_thickness} ${product.case_thickness_size_type}`, "small", "col-4")}
                        {product?.watch_height && renderDetail("Watch Height", "ارتفاع الساعة", `${product.watch_height} ${product.watch_height_size_type}`, "small", "col-4")}
                        {product?.watch_width && renderDetail("Watch Width", "عرض الساعة", `${product.watch_width} ${product.watch_width_size_type}`, "small", "col-4")}
                        {product?.watch_length && renderDetail("Watch Length", "طول الساعة", `${product.watch_length} ${product.watch_length_size_type}`, "small", "col-4")}
                        {product?.dial_glass_material && renderDetail("Dial Glass Material", "مادة زجاج الوجة", product.dial_glass_material, "small", "col-4")}
                        {product?.dial_case_material && renderDetail("Dial Case Material", "مادة اطار الوجة", product.dial_case_material, "small", "col-4")}
                        {product?.country && renderDetail("Country of Origin", "بلد الصنع", product.country, "small", "col-4")}
                        {product?.stone && renderDetail("Stone", "الحجر", product.stone, "small", "col-4")}
                        {product?.features?.length > 0 && renderDetail("Features", "الميزات", product.features.join(", "), "small", "col-4")}
                        {product?.gender?.length > 0 && renderDetail("Gender", "الجنس", product.gender.join(", "), "small", "col-4")}
                        <div className="fw-bold text-secondary col-12" style={{ fontSize: 'medium' }}>
                            {language === 'ar' ? 'اختر اللون' : 'Chosse colors'}
                        </div>
                        {product?.dial_color && renderColorDetail("Dial Color", "لون وجة الساعة", product.dial_color, "small", "col-4", setSelectedDialColor)}
                        {product?.band_color && renderColorDetail("Band Color", "لون السوار", product.band_color, "small", "col-4", setSelectedBandColor)}
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

                        <button
                            className="btn btn-outline-danger"
                            onClick={() => alert(language === "ar" ? "تمت الإضافة إلى قائمة الرغبات!" : "Added to wish list!")}
                        >
                            {language === "ar" ? "أضف إلى قائمة الرغبات" : "Add to Wish List"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="ratings-section row align-items-center rounded-5 border border-2 p-5 mt-4">
                <Typography variant="h5" className="col-10">{language === "ar" ? "التقييمات" : "Ratings"}</Typography>
                <button
                    onClick={handleRatingClick}
                    className={`mt-3 col-2 btn ${ratingsOpen ? 'btn-danger' : 'btn-dark'} `}
                >
                    {ratingsOpen ? language === "ar" ? "اخفاء التقييمات" : "Close Ratings" : language === "ar" ? "عرض التقييمات" : "View Ratings"}
                </button>
                <div className={`rating-list col-12 ${ratingsOpen ? "" : "d-none"} row mt-3`}>
                    {ratings.length > 0 ? (
                        ratings.map((rating) => (
                            <div key={rating.id} className="rating-item col-6 mb-3">
                                <Rating name="read-only" value={rating.rating} readOnly size="small" />
                                <p>{rating.comment}</p>
                                <small className="me-3">by : {users.find(u => u.id === rating.user_id)?.name}</small>
                                <small>{new Date(rating.created_at).toLocaleDateString()}</small>
                            </div>
                        ))
                    ) : (
                        <p>{language === "ar" ? "لا توجد تقييمات بعد" : "No ratings yet"}</p>
                    )}
                </div>
                <div className="add-rating mt-4">
                    <Typography variant="h6">{language === "ar" ? "إضافة تقييم" : "Add a Rating"}</Typography>
                    <div className="mt-2">
                        <Rating
                            name="new-rating"
                            value={newRating.value}
                            onChange={(e, value) => setNewRating((prev) => ({ ...prev, value }))}
                        />
                    </div>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={language === "ar" ? "أضف تعليقك" : "Add your comment"}
                        value={newRating.comment}
                        onChange={(e) => setNewRating((prev) => ({ ...prev, comment: e.target.value }))}
                        variant="outlined"
                        className="mt-3"
                    />
                    <button
                        className="mt-2 btn btn-dark"
                        onClick={() => handleRatingSubmit(newRating.value, newRating.comment)}
                    >
                        {language === "ar" ? "إرسال التقييم" : "Submit Rating"}
                    </button>
                </div>
            </div>
            <div className="related-products mt-4">
                {realetedProducts && <ProductSlider
                    text={{
                        title: { en: "Related Product", ar: "المنتجات ذات الصلة" },
                        description: { en: "Products similar to the product you chose", ar: "منتجات مشابهة للمنتج الذي اخترته" }
                    }}
                    products={realetedProducts}
                />}
            </div>
        </div>
    );
}

ProductDisplay.propTypes = {
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
            stock: PropTypes.string.isRequired,
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
            water_resistance: PropTypes.string,
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
    ),
};

export default ProductDisplay;
