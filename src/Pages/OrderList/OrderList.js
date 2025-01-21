import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import emptyWishList from "../../assets/images/emptywishlist.svg";
import { MyContext } from "../../App";

function OrderList() {
    const { language } = useContext(MyContext);

    const orders = [
        {
            order_num: 1,
            Payment_with: "Cash",
            Products: [
                { id: 1, name: "Oraimo 123", price: "5000" },
                { id: 3, name: "Oraimo 345", price: "1000" },
                { id: 6, name: "Oraimo 678", price: "10000" }
            ],
            User_name: "Michael",
            phone: "01274550956",
            Address: "8 Mohsen Roshdy, Nasr City",
            total: "16000",
            Email: "michaelkalaf@gmail.com",
            Status: "Done",
            Date: "11/4/2002"
        },
        {
            order_num: 2,
            Payment_with: "Credit Card",
            Products: [
                { id: 1, name: "Oraimo 123", price: "3000" },
                { id: 3, name: "Oraimo 345", price: "2000" },
                { id: 6, name: "Oraimo 678", price: "5000" }
            ],
            User_name: "Michael",
            phone: "01067418030",
            Address: "8 Mohsen Roshdy, Nasr City",
            total: "10000",
            Email: "michaelkalaf@gmail.com",
            Status: "Pending",
            Date: "11/10/2002"
        }
    ];

    const columnHeaders = language === "ar"
        ? ["رقم الطلب", "طريقة الدفع", "المنتجات", "اسم المستخدم", "رقم الهاتف", "العنوان", "إجمالي المبلغ", "البريد الإلكتروني", "حالة الطلب", "التاريخ"]
        : ["Order Num", "Payment With", "Products", "User Name", "Phone Number", "Address", "Total Amount", "Email", "Order Status", "Date"];

    return (
        <div className="cart container-fluid px-5">
            <div className="row py-3 px-4">
                <div className="col-12 p-3">
                    <h4 className="color-most-used fw-bold">
                        {language === "ar" ? "قائمة طلباتك" : "Your Orders"}
                    </h4>
                </div>
                {orders.length > 0 ? (
                    <div className="row justify-content-center">
                        <div className="col-12 p-3 pt-0">
                            <div className="row align-items-center p-3 rounded-4 bg-most-used-40">
                                {columnHeaders.map((label, idx) => (
                                    <small
                                        key={idx}
                                        className={`color-most-used border-end px-2 border-1 p-0 m-0 col-${idx === 2 || idx === 7 ? 2 : 1}  fw-bold`}
                                    >
                                        {label}
                                    </small>
                                ))}
                            </div>
                            {orders.map((order, index) => (
                                <div key={index} className="row border-bottom border-1 rounded-4 bg-most-used-10 p-3">
                                    <div className="col-1 px-2 p-0 text-center">{order.order_num}</div>
                                    <div className="col-1 px-2 p-0">{order.Payment_with}</div>
                                    <div className="col-2 px-2 p-0 ">
                                        {order.Products.map((product) => (
                                            <div key={product.id}>
                                                {product.name}   :   {language === 'ar' ? ' ج.م ' : "EG "}{parseFloat(product.price).toFixed(2)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-1 px-2 p-0">{order.User_name}</div>
                                    <div className="col-1 px-2 p-0">{order.phone}</div>
                                    <div className="col-1 px-2 p-0">{order.Address}</div>
                                    <div className="col-1 px-2 p-0">{language === 'ar' ? ' ج.م ' : "EG "}{order.total}</div>
                                    <div className="col-2 px-2 p-0">{order.Email}</div>
                                    <div className="col-1 px-2 p-0">{order.Status}</div>
                                    <div className="col-1 px-2 p-0">{order.Date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyOrdersMessage language={language} />
                )}
            </div>
        </div>
    );
}

function EmptyOrdersMessage({ language }) {
    return (
        <div className="row justify-content-center">
            <div className="col-12 d-flex justify-content-center">
                <img src={emptyWishList} loading="lazy" alt="empty cart" className="col-2" />
            </div>
            <h4 className="text-center fw-bold color-most-used mt-1">
                {language === "ar" ? "لا توجد طلبات" : "No orders yet"}
            </h4>
            <h6 className="text-center text-secondary">
                {language === "ar" ? "ابدأ التسوق لإضافة الطلبات" : "Start shopping to place orders"}
            </h6>
            <div className="col-12 d-flex justify-content-center mt-3">
                <Link to="/" className="text-decoration-none col-3">
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

export default OrderList;
