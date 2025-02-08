import { useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import {
    Tabs, Tab, TextField, Button, CircularProgress, MenuItem,
    Select,
    FormControl,
    InputLabel, Alert, Snackbar
} from "@mui/material";
import DOMPurify from "dompurify";
import { MyContext } from "../../App";
import axios from "axios";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div className="p-3">{children}</div>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function EditProfile() {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const { language, user_id, windowWidth, shippingid, shippingPrices, setShipping, setShippingName, setShippingid } = useContext(MyContext);

    const [value, setValue] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [openAlert, setOpenAlert] = useState(false);
    const [streetName, setStreetName] = useState("");
    const [buildingNumber, setBuildingNumber] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setOpenAlert(true);
    };

    const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0";

    const fetchAddresses = useCallback(() => {
        setLoading(true);
        axios
            .get("https://dash.watchizereg.com/api/show_address", {
                headers: { "Api-Code": apiCode },
            })
            .then((response) => {
                if (response.data) {
                    const filteredAddresses = response.data.filter(
                        (address) => parseInt(address.user_id) === parseInt(user_id)
                    );
                    setAddresses(filteredAddresses);
                } else {
                    setAddresses([]);
                }
            })
            .catch(() => {
                setError(language === "ar" ? "فشل تحميل العناوين" : "Failed to load addresses.");
            })
            .finally(() => setLoading(false));
    }, [user_id, language]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleChange = (event, newValue) => setValue(newValue);

    const handleAddAddress = () => {
        if (!shippingid) {
            showAlert(language === "ar" ? "الرجاء اختيار مدينة الشحن أولاً" : "Please select a shipping city first", "warning");
            return;
        }
        if (!streetName.trim() || !buildingNumber.trim()) {
            showAlert(language === "ar" ? "يرجى إدخال اسم الشارع ورقم المبنى." : "Please enter the street name and building number.", "warning");
            return;
        }
        if (!phoneNumber.trim()) {
            showAlert(language === "ar" ? "يرجى إدخال رقم الهاتف." : "Please enter a phone number.", "warning");
            return;
        }

        let fullAddress = `${streetName}, Building ${buildingNumber}`;
        if (floorNumber.trim()) fullAddress += `, Floor ${floorNumber}`;
        if (apartmentNumber.trim()) fullAddress += `, Apartment ${apartmentNumber}`;

        const payload = {
            user_id,
            shipping_city_id: shippingid,
            address_line: fullAddress,
            phone_number_one: phoneNumber
        };

        axios.post("https://dash.watchizereg.com/api/add_address", payload, {
            headers: { "Api-Code": apiCode }
        })
            .then(response => {
                if (response.data.success) {
                    showAlert(language === "ar" ? "تم إضافة العنوان بنجاح!" : "Address added successfully!", "success");
                    fetchAddresses();
                    setStreetName("");
                    setBuildingNumber("");
                    setFloorNumber("");
                    setApartmentNumber("");
                    setPhoneNumber("");
                } else {
                    showAlert(language === "ar" ? "فشل إضافة العنوان." : "Failed to add address.", "error");
                }
            })
            .catch(error => console.error("Error adding address:", error));
    };
    const handleChangeShipping = (event) => {
        const selectedId = event.target.value;
        setShippingid(selectedId);

        const selectedShipping = shippingPrices.find(city => city.id === selectedId);
        if (selectedShipping) {
            setShipping(selectedShipping.Price.toString());
            setShippingName(language === 'ar' ? selectedShipping.GovernorateAr : selectedShipping.GovernorateEn);
        }
    };

    return (
        <div className={`container mt-4 ${language === "ar" ? "text-right" : "text-left"}`} dir={language === "ar" ? "rtl" : "ltr"}>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}
                anchorOrigin={{ vertical: windowWidth >= 768 ? "bottom" : "top", horizontal: windowWidth >= 768 ? "right" : "left" }}
            >
                <Alert severity={alertType} onClose={() => setOpenAlert(false)}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            <Tabs value={value} onChange={handleChange} className="d-flex justify-content-center">
                <Tab className="col-4" label={language === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"} />
                <Tab className="col-4" label={language === "ar" ? "تغيير كلمة المرور" : "Change Password"} />
                <Tab className="col-4" label={language === "ar" ? "تعديل العناوين" : "Edit Address"} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <button type="button" className="w-100 p-2 btn btn-dark">
                    {language === "ar" ? "حفظ" : "Save"}
                </button>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                <button type="button" className="w-100 p-2 btn btn-dark">
                    {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                </button>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : addresses.length === 0 ? (
                    <p>{language === "ar" ? "لا توجد عناوين محفوظة." : "No saved addresses."}</p>
                ) : (
                    <div className="row">
                        {addresses.map((address, index) => (
                            <div key={index} className="col-md-6 col-12 mb-3">
                                <div className="card p-3 shadow-sm">
                                    <p className="mb-0"><strong>{language === "ar" ? "العنوان:" : "Address:"}</strong> {address.address_line}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <h5 className="mt-4">{language === "ar" ? "إضافة عنوان جديد" : "Add New Address"}</h5>
                <div className="row">
                    <div className="col-md-6 col-12">
                        <TextField
                            fullWidth
                            label={language === "ar" ? "اسم الشارع" : "Street Name"}
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <TextField
                            fullWidth
                            label={language === "ar" ? "رقم المبنى" : "Building Number"}
                            value={buildingNumber}
                            onChange={(e) => setBuildingNumber(e.target.value)}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <TextField
                            fullWidth
                            label={language === "ar" ? "رقم الطابق" : "Floor Number"}
                            value={floorNumber}
                            onChange={(e) => setFloorNumber(e.target.value)}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <TextField
                            fullWidth
                            label={language === "ar" ? "رقم الشقة" : "Apartment Number"}
                            value={apartmentNumber}
                            onChange={(e) => setApartmentNumber(e.target.value)}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <TextField
                            fullWidth
                            label={language === "ar" ? "رقم الهاتف" : "Phone Number"}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <FormControl fullWidth>
                            <InputLabel> {language === "ar" ? "مدينة الشحن" : "Shipping City"} </InputLabel>
                            <Select value={shippingid || ''} onChange={handleChangeShipping} fullWidth>
                                {shippingPrices.map(city => (
                                    <MenuItem key={city.id} value={city.id.toString()}>
                                        {language === "ar" ? city.GovernorateAr : city.GovernorateEn}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <Button variant="contained" color="primary" fullWidth onClick={handleAddAddress}>
                    {language === "ar" ? "حفظ العنوان" : "Save Address"}
                </Button>
            </CustomTabPanel>
        </div>
    );
}

export default EditProfile;
