import { useState, useContext } from "react";
import { MyContext } from "../../App";
import { Button, Rating, MenuItem, Select, FormControl } from "@mui/material";
import CartProductModel from "./CartProductModel";
import CartOfferModel from "./CartOfferModel";
import { FaEye } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import emptyCart from "../../assets/images/emptyCart.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function Cart() {
    const {
        language,
        cart,
        setCart,
        total_cart_price,
        shippingPrices,
        productsCount,
        handleQuantityChange,
        setShippingName,
        shipping,
        setShipping,
        products, offers
    } = useContext(MyContext);

    const [selectedProduct, setSelectedProduct] = useState();
    const [selectedItem, setselectedItem] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProductClick = (item) => {
        let product;
        item.product_id !== null ? product = products.find(
            p => p.id === item.product_id
        ) :
            product = offers.find(
                o => o.id === item.offer_id
            )
        setselectedItem(item);
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleChange = (event) => {
        const selectedPrice = event.target.value;
        setShipping(selectedPrice);
        const selectedShipping = shippingPrices.find(price => price.Price.toString() === selectedPrice);
        if (selectedShipping) {
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
        <div className="cart container-fluid px-5">
            <div className="row py-3 px-4">
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
                        <div className="row">
                            <div className="col-9 p-3 pt-0">
                                <div className="row align-items-center p-3 rounded-4 bg-most-used-40">
                                    {["Product", "Quantity", "Band Color", "Dial Color", "Price", "Subtotal", "Actions"].map((label, idx) => (
                                        <h6
                                            key={idx}
                                            className={`color-most-used p-0 m-0 col-${idx === 0 ? 4 : idx === 1 ? 2 : 1} fw-bold ${idx === 6 ? "text-center" : ""
                                                }`}
                                        >
                                            {language === "ar"
                                                ? ["المنتج", "الكمية", "لون السوار", "لون الوجه", "السعر", "المجموع الكلي", "الأفعال"][idx]
                                                : label}
                                        </h6>
                                    ))}
                                </div>
                                {cart.map((item, index) => {
                                    const isProduct = item.product_id && item.product_image;
                                    const isOffer = item.offer_id && item.offer_image;
                                    const title = item.product_id
                                        ? item.product_title
                                        : item.offer_title;

                                    const piecePrice = parseFloat(item.piece_price).toFixed(2);
                                    const totalPrice = (parseFloat(item.piece_price) * (item.quantity || 1)).toFixed(2);
                                    return (
                                        <div key={index} className="row align-items-center border-bottom border-1 rounded-4 bg-most-used-10 py-2">
                                            <div className="col-4 d-flex align-items-center">
                                                {isProduct && <img src={item.product_image} alt={item.product_id} loading="lazy" className="col-3" />}
                                                {isOffer && <img src={item.offer_image} alt={item.offer_id} loading="lazy" className="col-3" />}
                                                <div className="col-9">
                                                    <h6 className="color-most-used fw-bold">{title}</h6>
                                                    <Rating
                                                        name="read-only"
                                                        value={parseInt(item.product_rating) || parseInt(item.offer_rating) || 5}
                                                        size="small"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleQuantityChange(index, -1)}
                                                    disabled={(item.quantity || 1) <= 1}
                                                    sx={{ minWidth: '30px', padding: '5px' }}
                                                >
                                                    -
                                                </Button>
                                                <input
                                                    type="text"
                                                    value={item.quantity || 1}
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
                                                    onClick={() => handleQuantityChange(index, 1)}
                                                    sx={{ minWidth: '30px', padding: '5px' }}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <div className="col-1 px-3">
                                                <div
                                                    style={{
                                                        backgroundColor: item.color_band || "#f0f0f0",
                                                        width: '100%',
                                                        height: '30px',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        border: item.color_band ? 'none' : '1px solid #ddd'
                                                    }}
                                                >
                                                    {!item.color_band && <span style={{ fontSize: '12px', color: '#666' }}>
                                                        {language === 'ar' ? 'لا لون' : 'No Color'}
                                                    </span>}
                                                </div>
                                            </div>
                                            <div className="col-1 px-3">
                                                <div
                                                    style={{
                                                        backgroundColor: item.color_dial || "#f0f0f0",
                                                        width: '100%',
                                                        height: '30px',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        border: item.color_dial ? 'none' : '1px solid #ddd'
                                                    }}
                                                >
                                                    {!item.color_dial && <span style={{ fontSize: '12px', color: '#666' }}>
                                                        {language === 'ar' ? 'لا لون' : 'No Color'}
                                                    </span>}
                                                </div>
                                            </div>

                                            <h6 className="color-most-used col-1">{piecePrice}</h6>
                                            <h6 className="color-most-used col-1">{totalPrice}</h6>
                                            <div className="col-2 text-center">
                                                <Button
                                                    className="rounded-circle color-most-used mx-2"
                                                    sx={{
                                                        width: '40px',
                                                        height: '40px',
                                                        minWidth: '0',
                                                        padding: 0,
                                                    }}
                                                    onClick={() => handleProductClick(item)}
                                                >
                                                    <FaEye size={24} />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    className="rounded-circle bg-danger text-light p-2"
                                                    sx={{
                                                        width: '40px',
                                                        height: '40px',
                                                        minWidth: '0',
                                                        padding: 0,
                                                    }}
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    <CiCircleRemove size={24} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="col-3 p-3 pt-0">
                                <div className="row align-items-center px-3 border border-1 rounded-3">
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
                                                    value={shipping}
                                                    onChange={handleChange}
                                                    fullWidth
                                                >
                                                    {shippingPrices.map((price, index) => (
                                                        <MenuItem key={index} value={price.Price.toString()}>
                                                            {language === 'ar' ? price.GovernorateAr : price.GovernorateEn}
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
                        {selectedProduct && (
                            selectedItem.product_id !== null ? (
                                <CartProductModel
                                    open={isModalOpen}
                                    onClose={handleModalClose}
                                    product={selectedProduct}
                                    language={language}
                                    quantity={selectedItem.quantity}
                                    setQuantity={handleQuantityChange}
                                    index={cart.findIndex((item) => item.id === selectedItem.id)}
                                />
                            ) : (
                                <CartOfferModel
                                    open={isModalOpen}
                                    onClose={handleModalClose}
                                    product={selectedProduct}
                                    language={language}
                                    quantity={selectedItem.quantity}
                                    setQuantity={handleQuantityChange}
                                    index={cart.findIndex((item) => item.id === selectedItem.id)}
                                />
                            )
                        )}
                    </>
                ) : (
                    <EmptyCartMessage language={language} />
                )}
            </div>
        </div>
    );
}

function EmptyCartMessage({ language }) {
    return (
        <div className="row justify-content-center">
            <div className="col-12 d-flex justify-content-center">
                <img src={emptyCart} loading="lazy" alt="empty cart" className="col-2" />
            </div>
            <h4 className="text-center fw-bold color-most-used mt-1">
                {language === "ar" ? "السلة فارغة" : "Your Cart is currently empty"}
            </h4>
            <h6 className="text-center text-secondary">
                {language === "ar" ? "الرجاء اختيار المنتجات التي ترغب في شرائها" : "Please choose the products you want to buy"}
            </h6>
            <div className="col-12 d-flex justify-content-center mt-3">
                <Link to={"/"} className="text-decoration-none col-3">
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

export default Cart;
