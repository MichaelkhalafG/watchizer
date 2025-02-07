import { useContext } from "react";
import { MyContext } from "../../App";
import { Button, Rating, MenuItem, Select, FormControl } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import emptyCart from "../../assets/images/emptyCart.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function PhoneCart() {
    const {
        language,
        cart,
        setCart,
        windowWidth,
        total_cart_price,
        shippingPrices,
        productsCount,
        handleQuantityChange,
        setShippingName,
        shipping,
        setShipping,
        shippingid,
        setShippingid
    } = useContext(MyContext);

    const handleChange = (event) => {
        const selectedId = event.target.value;
        setShippingid(selectedId);

        const selectedShipping = shippingPrices.find(city => city.id === selectedId);
        if (selectedShipping) {
            setShipping(selectedShipping.Price.toString());
            setShippingName(language === 'ar' ? selectedShipping.GovernorateAr : selectedShipping.GovernorateEn);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0";
            const response = await axios.delete(`https://dash.watchizereg.com/api/delete_cart/${itemId}`, {
                headers: { "Api-Code": apiCode }
            });

            if (response.status === 200) {
                setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
            } else {
                console.error("Failed to remove item from cart:", response.data);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };


    return (
        <div className="row m-0 py-3 px-md-4 px-0">
            <div className="col-12 p-3">
                <h4 className="color-most-used fw-bold">
                    {language === "ar" ? "سلة المشتريات" : "Your Cart"}
                </h4>
                <h6 className="text-secondary mt-2">
                    {language === "ar" ? "هناك عدد " : "There are "}
                    <span className="text-danger fw-bold">{productsCount}</span>
                    {language === "ar" ? " من المنتجات في سلتك." : " products in your cart."}
                </h6>
            </div>
            {cart.length > 0 ? (
                <>
                    <div className="row m-0 pb-md-0 pb-5">
                        <h6 className="color-most-used fw-bold m-0 px-0 py-3">
                            {language === "ar" ? "اسحب لتشاهد المعلومات" : "Scroll To See Data"}
                        </h6>
                        <div className="col-md-9 col-12 p-md-3 p-0 pt-0" style={{ overflowX: "auto" }}>
                            <div className={`d-flex rounded-4 `}>
                                <div className={`d-flex align-items-center col-7`}>
                                    <h6 className="color-most-used fw-bold m-0">
                                        {language === "ar" ? "المنتج" : "Product"}
                                    </h6>
                                </div>
                                <div className={`d-flex align-items-center col-5`}>
                                    <h6 className="color-most-used col-12  fw-bold m-0">
                                        {language === "ar" ? "الكمية" : "Quantity"}
                                    </h6>
                                </div>
                                <div className={`d-flex align-items-center col-4`}>
                                    <h6 className="color-most-used fw-bold m-0">
                                        {language === "ar" ? "لون السوار" : "Band Color"}
                                    </h6>
                                </div>
                                <div className={`d-flex align-items-center col-4`}>
                                    <h6 className="color-most-used fw-bold m-0">
                                        {language === "ar" ? "لون الوجه" : "Dial Color"}
                                    </h6>
                                </div>
                                <div className={`d-flex align-items-center col-4`}>
                                    <h6 className="color-most-used text-center col-12 fw-bold m-0">
                                        {language === "ar" ? "السعر" : "Price"}
                                    </h6>
                                </div>
                                <div className={`d-flex align-items-center col-4`}>
                                    <h6 className="color-most-used text-center col-12 fw-bold m-0">
                                        {language === "ar" ? "المجموع الكلي" : "Subtotal"}
                                    </h6>
                                </div>
                                <div className={`d-flex align-items-center col-4`}>
                                    <h6 className="color-most-used text-center col-12 fw-bold m-0">
                                        {language === "ar" ? "الأفعال" : "Actions"}
                                    </h6>
                                </div>
                            </div>

                            {cart.map((item, index) => {
                                const isProduct = item.product_id && item.product_image;
                                const isOffer = item.offer_id && item.offer_image;
                                const title = item.product_id ? item.product_title : item.offer_title;
                                const piecePrice = parseFloat(item.piece_price).toFixed(2);
                                const totalPrice = (parseFloat(item.piece_price) * (item.quantity || 1)).toFixed(2);

                                return (
                                    <div key={index} className={`d-flex align-items-center py-2 bg-most-used-10 ${windowWidth >= 768 ? "row" : ""}`}>
                                        <div className="d-flex align-items-center col-md-4 col-7">
                                            {(isProduct || isOffer) && (
                                                <img
                                                    src={isProduct ? item.product_image : item.offer_image}
                                                    alt={isProduct ? item.product_id : item.offer_id}
                                                    loading="lazy"
                                                    className="col-4 col-md-3"
                                                />
                                            )}
                                            <div className="col-8 col-md-9">
                                                <h6 className="color-most-used fw-bold" style={{ fontSize: windowWidth >= 768 ? "large" : "small" }}>{title}</h6>
                                                <Rating
                                                    name="read-only"
                                                    value={parseInt(item.product_rating) || parseInt(item.offer_rating) || 5}
                                                    size="small"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-5 p-0 d-flex align-items-center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleQuantityChange(index, -1)}
                                                disabled={(item.quantity || 1) <= 1}
                                                sx={{ minWidth: '30px', padding: '0px' }}
                                            >
                                                -
                                            </Button>
                                            <input
                                                type="text"
                                                value={item.quantity || 1}
                                                readOnly
                                                className="mx-2 text-center"
                                                style={{ width: '40px', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleQuantityChange(index, 1)}
                                                sx={{ minWidth: '30px', padding: '0px' }}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        {["color_band", "color_dial"].map((colorType, i) => (
                                            <div key={i} className="col-md-1 d-flex justify-content-start col-4 pe-2">
                                                <div
                                                    style={{
                                                        backgroundColor: item[colorType] || "#f0f0f0",
                                                        height: '30px',
                                                        borderRadius: '4px',
                                                        border: item[colorType] ? 'none' : '1px solid #ddd',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                    className="col-12"
                                                >
                                                    {!item[colorType] && (
                                                        <span style={{ fontSize: '12px', color: '#666' }}>
                                                            {language === 'ar' ? 'لا لون' : 'No Color'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {[piecePrice, totalPrice].map((price, i) => (
                                            <h6 key={i} className="color-most-used text-center col-4">{price}</h6>
                                        ))}
                                        <div className="col-4 text-center">
                                            <Link
                                                to={isProduct ? `/product/${item.product_id}` : `/offer/${item.offer_id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Button
                                                    className="rounded-circle color-most-used mx-2"
                                                    sx={{ width: '40px', height: '40px', minWidth: 0, padding: 0 }}
                                                    aria-label={isProduct ? `View product ${item.product_id}` : `View offer ${item.offer_id}`} // Adds accessible label
                                                >
                                                    <FaEye size={24} />
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="contained"
                                                className="rounded-circle bg-danger text-light p-2"
                                                sx={{ width: '40px', height: '40px', minWidth: '0', padding: 0 }}
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <CiCircleRemove size={24} />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="col-md-3 col-12 p-3 pb-md-0 pb-5 pt-3">
                            <div className="row align-items-center px-3  border border-1 rounded-3">
                                <h6 className="color-most-used py-3 border-bottom border-1 col-12 fw-bold">
                                    {language === "ar" ? "مجموع السلة" : "CART TOTALS"}
                                </h6>
                                <div className="col-12 d-flex border-bottom border-1 justify-content-between py-2">
                                    <h6 className="color-most-used col-6">
                                        {language === "ar" ? "المجموع الكلي" : "Subtotal"}
                                    </h6>
                                    <h6 className={`text-secondary col-6 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                        {language === "ar" ? "ج.م" : "EGP"}
                                        <span className="fw-bold mx-2 text-danger">
                                            {cart.reduce((total, item) => total + item.piece_price * item.quantity, 0)}
                                        </span>
                                    </h6>
                                </div>
                                <div className="col-12 d-flex border-bottom border-1 justify-content-between py-2">
                                    <h6 className="color-most-used d-flex align-items-center col-6">
                                        {language === "ar" ? "الشحن الي" : "Shipping to"}
                                    </h6>
                                    <div className="col-6">
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="governorate-select-label"
                                                id="governorate-select"
                                                value={shippingid}
                                                onChange={handleChange}
                                                fullWidth
                                            >
                                                {shippingPrices.map((city) => (
                                                    <MenuItem key={city.id} value={city.id}>
                                                        {language === 'ar' ? city.GovernorateAr : city.GovernorateEn}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="col-12 d-flex border-bottom border-1 justify-content-between py-2">
                                    <h6 className="color-most-used col-6">
                                        {language === "ar" ? "الشحن" : "Shipping"}
                                    </h6>
                                    <h6 className={`text-secondary col-6 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                        {language === 'ar' ? 'ج.م' : 'EGP'}
                                        <span className="fw-bold mx-2 text-danger">
                                            {shipping}
                                        </span>
                                    </h6>
                                </div>
                                <div className="col-12 d-flex border-bottom border-1 justify-content-between py-2">
                                    <h6 className="color-most-used col-6">
                                        {language === "ar" ? "المجموع الكلي" : "Total"}
                                    </h6>
                                    <h6 className={`text-secondary m-0 col-6 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                        {language === 'ar' ? 'ج.م' : 'EGP'}
                                        <span className="fw-bold mx-2 text-danger">
                                            {total_cart_price}
                                        </span>
                                    </h6>
                                </div>
                                <Link to={"/checkout"} className="col-12 p-3">
                                    <Button
                                        variant="contained"
                                        className="rounded-3 bg-most-used text-light col-12 p-2"
                                    >
                                        {language === "ar" ? "الدفع" : "Checkout"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyCartMessage language={language} />
            )
            }
        </div >
    );
}

function EmptyCartMessage({ language }) {
    return (
        <div className="row m-0 justify-content-center">
            <div className="col-12 d-flex justify-content-center">
                <img src={emptyCart} loading="lazy" alt="empty cart" className="col-6" />
            </div>
            <h4 className="text-center fw-bold color-most-used mt-1">
                {language === "ar" ? "السلة فارغة" : "Your Cart is currently empty"}
            </h4>
            <h6 className="text-center text-secondary">
                {language === "ar" ? "الرجاء اختيار المنتجات التي ترغب في شرائها" : "Please choose the products you want to buy"}
            </h6>
            <div className="col-12 d-flex justify-content-center mt-3">
                <Link to={"/"} className="text-decoration-none col-6">
                    <Button
                        variant="contained"
                        className="rounded-pill bg-most-used text-light col-12 p-2"
                    >
                        {language === "ar" ? "تسوق الآن" : "Shop Now"}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default PhoneCart;
