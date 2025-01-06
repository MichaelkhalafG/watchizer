import { Button, TextField, Alert, MenuItem, Select, FormControl } from '@mui/material';
import { useContext, useState } from 'react';
import { MyContext } from '../../App';
import DOMPurify from "dompurify";
import CheckIcon from "@mui/icons-material/Check";

function Checkout() {
    const { language, shippingPrices, shippingname, shipping, setShipping, cart, setShippingName } = useContext(MyContext);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: shippingname,
        phone: "",
        additionalPhone: "",
    });

    const [alertMessages, setAlertMessages] = useState([]);

    const handleChangeshipping = (event) => {
        setShipping(event.target.value);
        language === "ar"
            ? setShippingName(event.target.GovernorateAr)
            : setShippingName(event.target.GovernorateEn);
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
            setAlertMessages([
                { severity: "success", message: language === "ar" ? "تم إرسال النموذج بنجاح!" : "Form submitted successfully!" }
            ]);
            setFormData({
                fullName: "",
                email: "",
                address: "",
                city: "",
                phone: "",
                additionalPhone: "",
            });
        } else {
            setAlertMessages(errors);
        }
    };

    return (
        <div
            className="cart container"
            dir={language === "ar" ? "rtl" : "ltr"}
            style={{
                textAlign: language === "ar" ? "right" : "left",
            }}
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
                                    <Select
                                        labelId="governorate-select-label"
                                        id="governorate-select"
                                        value={shipping}
                                        onChange={handleChangeshipping}
                                        fullWidth
                                    >
                                        {shippingPrices.map((price, index) => (
                                            <MenuItem key={index} value={price.Price}>
                                                {language === "ar" ? price.GovernorateAr : price.GovernorateEn}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label={language === "ar" ? "العنوان" : "Address"}
                                    variant="outlined"
                                    className="col-12 my-3"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    label={language === "ar" ? "رقم الهاتف الإضافي" : "Additional Phone Number (Optional)"}
                                    variant="outlined"
                                    className="col-12 my-3"
                                    name="additionalPhone"
                                    value={formData.additionalPhone}
                                    onChange={handleChange}
                                />
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
                                    <h6
                                        className={`text-secondary m-0 col-4 ${language === 'ar' ? 'text-start' : 'text-end'}`}>
                                        {language === "ar" ? "ج.م" : "EGP"}
                                        <span className="fw-bold mx-2 text-danger">
                                            {item.sale_price_after_discount * item.quantity}
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
                                        {cart.reduce((total, item) => total + item.sale_price_after_discount * item.quantity, 0) + shipping}
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
