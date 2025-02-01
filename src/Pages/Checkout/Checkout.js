import { Button, TextField, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../App';
import DOMPurify from "dompurify";
import CheckIcon from "@mui/icons-material/Check";
import axios from 'axios';

function Checkout() {
    const { language, user_id, shippingPrices, shippingname, shipping, setShipping, cart, setShippingName } = useContext(MyContext);

    const [formData, setFormData] = useState({
        fullName: "",
        email: localStorage.getItem("email") || "",
        address: "",
        city: shippingname,
        phone: "",
        additionalPhone: "",
        paymentMethod: "card", // Default payment method
    });

    const [alertMessages, setAlertMessages] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isAddingAddress, setIsAddingAddress] = useState(false); // Track if adding a new address

    const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"; // Add API code here

    useEffect(() => {
        // Fetch available addresses
        axios.get('https://dash.watchizereg.com/api/show_address', {
            params: { user_id: user_id },
            headers: { "Api-Code": apiCode } // Add API code to headers
        })
            .then(response => {
                if (response.data.success) {
                    setAddresses(response.data.data || []);
                } else {
                    setAddresses([]);
                }
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
                setAddresses([]);
            })
            .finally(() => setLoadingAddresses(false));
    }, [user_id]);

    const handleChangeshipping = (event) => {
        setShipping(event.target.value);
        const selectedShipping = shippingPrices.find(price => price.Price === event.target.value);
        if (selectedShipping) {
            setShippingName(language === "ar" ? selectedShipping.GovernorateAr : selectedShipping.GovernorateEn);
        }
    };

    const handlePaymentMethodChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            paymentMethod: event.target.value,
        }));
    };

    const validateFields = () => {
        const { fullName, email, address, phone } = formData;
        let errors = [];

        if (!fullName.trim()) {
            errors.push({ severity: "error", message: language === "ar" ? "الاسم الكامل مطلوب." : "Full Name is required." });
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            errors.push({ severity: "error", message: language === "ar" ? "البريد الإلكتروني غير صالح." : "Invalid email address." });
        }

        const phonePattern = /^\d{11}$/;
        if (!phonePattern.test(phone)) {
            errors.push({ severity: "error", message: language === "ar" ? "رقم الهاتف غير صالح." : "Invalid phone number." });
        }

        if (formData.additionalPhone && !phonePattern.test(formData.additionalPhone)) {
            errors.push({ severity: "error", message: language === "ar" ? "رقم الهاتف الإضافي غير صالح." : "Invalid additional phone number." });
        }

        if (!address.trim()) {
            errors.push({ severity: "error", message: language === "ar" ? "العنوان مطلوب." : "Address is required." });
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        setFormData((prev) => ({
            ...prev,
            [name]: sanitizedValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateFields();

        if (errors.length === 0) {
            setAlertMessages([{
                severity: "success",
                message: language === "ar" ? "تم إرسال النموذج بنجاح!" : "Form submitted successfully!"
            }]);
            handlePostOrder();  // Proceed to place the order only after validation passes
        } else {
            setAlertMessages(errors);
        }
    };

    const handlePostOrder = () => {
        const selectedAddressId = formData.address; // Using the selected address ID
        const cartTotalPrice = cart.reduce((total, item) => total + item.piece_price * item.quantity, 0);
        const selectedPaymentMethod = formData.paymentMethod; // Use selected payment method
        const orderNote = "Your order note here";

        const payload = {
            user_id: user_id,
            address_id: selectedAddressId,
            total_price_for_order: cartTotalPrice + shipping,  // Total price including shipping
            payment_method: selectedPaymentMethod,
            note: orderNote
        };

        axios.post("https://dash.watchizereg.com/api/add_order", payload, {
            headers: {
                "Api-Code": apiCode // Add API code to headers
            }
        })
            .then(response => {
                if (response.data.success) {
                    const redirectUrl = response.data.redirect_url || 'https://watchizereg.com/';
                    window.location.href = redirectUrl;
                } else {
                    alert('Failed to place the order. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error posting order:', error.response ? error.response.data : error.message);
                alert('Failed to place the order. Please try again.');
            });
    };

    const handleAddAddress = () => {
        const { phone, additionalPhone, address } = formData;
        const newAddressData = {
            user_id: user_id,
            shipping_city_id: 1,
            address_line: address,
            phone_number_one: phone,
            additional_phone_number: additionalPhone,
        };

        axios.post('https://dash.watchizereg.com/api/add_address', newAddressData, {
            headers: {
                "Api-Code": apiCode // Add API code to headers
            }
        })
            .then(response => {
                if (response.data.success) {
                    alert("Address added successfully!");
                    setAddresses(prev => [...prev, response.data.data]);
                    setIsAddingAddress(false);
                } else {
                    alert("Failed to add address. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error adding address:', error);
                alert("Failed to add address. Please try again.");
            });
    };

    return (
        <div
            className="cart container"
            dir={language === "ar" ? "rtl" : "ltr"}
            style={{ textAlign: language === "ar" ? "right" : "left" }}
        >
            <div className="row py-3">
                <div className="col-12 p-3">
                    <h4 className="color-most-used fw-bold">
                        {language === "ar" ? "تفاصيل الفواتير" : "BILLING DETAILS"}
                    </h4>
                </div>
                <div className="row">
                    <form onSubmit={handleSubmit} id="checkout-form" className="col-9">
                        <div className="d-flex flex-row p-3 ps-0 pt-0">
                            <div className="col-6 px-2">
                                <TextField
                                    label={language === "ar" ? "الاسم الكامل" : "Full Name"}
                                    variant="outlined"
                                    className="col-12"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    label={language === "ar" ? "البريد الإلكتروني" : "Email"}
                                    variant="outlined"
                                    className="col-12 my-3"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    label={language === "ar" ? "رقم الهاتف" : "Phone Number"}
                                    variant="outlined"
                                    className="col-12 my-3"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-6 px-2">
                                <FormControl fullWidth>
                                    <InputLabel>{language === "ar" ? "طريقة الدفع" : "Payment Method"}</InputLabel>
                                    <Select
                                        value={formData.paymentMethod}
                                        onChange={handlePaymentMethodChange}
                                        fullWidth
                                    >
                                        <MenuItem value="card">{language === "ar" ? "بطاقة" : "Card"}</MenuItem>
                                        <MenuItem value="cash">{language === "ar" ? "كاش" : "Cash"}</MenuItem>
                                    </Select>
                                </FormControl>

                                {loadingAddresses ? (
                                    <p>{language === "ar" ? "جاري تحميل العناوين..." : "Loading addresses..."}</p>
                                ) : (
                                    <FormControl fullWidth>
                                        <InputLabel>{language === "ar" ? "العنوان" : "Address"}</InputLabel>
                                        <Select
                                            value={formData.address}
                                            onChange={handleChange}
                                            name="address"
                                            fullWidth
                                        >
                                            {addresses.length > 0 ? (
                                                addresses.map((address, index) => (
                                                    <MenuItem key={index} value={address.id}>
                                                        {address.address_line}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">{language === "ar" ? "لا توجد عناوين" : "No addresses available"}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                )}

                                {addresses.length === 0 && !isAddingAddress && (
                                    <Button onClick={() => setIsAddingAddress(true)} variant="contained" color="primary">
                                        {language === "ar" ? "إضافة عنوان" : "Add Address"}
                                    </Button>
                                )}

                                {isAddingAddress && (
                                    <div>
                                        <TextField
                                            label={language === "ar" ? "العنوان" : "Address"}
                                            variant="outlined"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            label={language === "ar" ? "الهاتف الإضافي" : "Additional Phone"}
                                            variant="outlined"
                                            name="additionalPhone"
                                            value={formData.additionalPhone}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                        <Button onClick={handleAddAddress} variant="contained" color="primary" className="mt-3">
                                            {language === "ar" ? "إضافة" : "Add"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {alertMessages.length > 0 &&
                            alertMessages.map((alert, index) => (
                                <Alert key={index} severity={alert.severity} className="my-3" icon={<CheckIcon fontSize="inherit" />}>
                                    {alert.message}
                                </Alert>
                            ))}
                    </form>
                    <div className="col-3 p-3 pt-0">
                        <div className="row align-items-center px-3 pb-3 border border-1 rounded-3">
                            <h5 className="color-most-used py-3 border-bottom border-1 col-12 fw-bold">
                                {language === "ar" ? "الطلب" : "Order"}
                            </h5>
                            {cart.map((item, index) => (
                                <div key={index} className="col-12 d-flex justify-content-between py-2">
                                    <p className="color-most-used m-0 p-0 col-8">
                                        {item.product_title}
                                    </p>
                                    <h6 className={`text-secondary m-0 col-4 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                        {language === "ar" ? "ج.م" : "EGP"}
                                        <span className="fw-bold mx-2 text-danger">
                                            {item.piece_price * item.quantity}
                                        </span>
                                    </h6>
                                </div>
                            ))}
                            <div className="col-12 d-flex border-top border-1 justify-content-between py-2">
                                <h6 className="color-most-used m-0 p-0 col-6">
                                    {language === "ar" ? "الشحن" : "Shipping"}
                                </h6>
                                <h6 className={`text-secondary m-0 col-6 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                    {language === "ar" ? "ج.م" : "EGP"}
                                    <span className="fw-bold mx-2 text-danger">{shipping}</span>
                                </h6>
                            </div>
                            <div className="col-12 d-flex border-top border-1 justify-content-between py-2">
                                <h6 className="color-most-used col-6">
                                    {language === "ar" ? "المجموع الكلي" : "Total"}
                                </h6>
                                <h6 className={`text-secondary m-0 col-6 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                    {language === "ar" ? "ج.م" : "EGP"}
                                    <span className="fw-bold mx-2 text-danger">
                                        {cart.reduce((total, item) => total + item.piece_price * item.quantity, 0) + parseFloat(shipping)}
                                    </span>
                                </h6>
                            </div>
                            <Button
                                form="checkout-form"
                                type="submit"
                                variant="contained"
                                className="rounded-3 bg-most-used text-light col-12 p-2"
                            >
                                {language === "ar" ? "إرسال" : "Submit"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
