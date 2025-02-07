import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, CircularProgress, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";
import emptyWishList from "../../assets/images/emptywishlist.svg";
import { MyContext } from "../../App";

function OrderList() {
    const { language, user_id } = useContext(MyContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "warning";
            case "processing":
                return "info";
            case "shipped":
                return "primary";
            case "delivered":
                return "success";
            case "cancelled":
                return "error";
            default:
                return "default";
        }
    };

    useEffect(() => {
        axios.get("https://dash.watchizereg.com/api/show_order", {
            headers: { "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0" }
        })
            .then(response => {
                const filteredOrders = response.data.filter(order => order.user_id === user_id);
                setOrders(filteredOrders);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders.");
                setLoading(false);
            });
    }, [user_id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mt-4">
            <Typography variant="h5" className="fw-bold mb-3">
                {language === "ar" ? "قائمة طلباتك" : "Your Orders"}
            </Typography>
            {orders.length > 0 ? (
                <TableContainer component={Paper} elevation={3} className="p-3">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {[
                                    "Order Num", "Payment Method", "Products", "Total Amount", "Order Status", "Date"
                                ].map((header, idx) => (
                                    <TableCell key={idx} className="fw-bold">
                                        {language === "ar" ? arabicHeaders[idx] : header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{order.order_number}</TableCell>
                                    <TableCell>{order.payment_method}</TableCell>
                                    <TableCell>
                                        {order.order_item.map((product) => (
                                            <div key={product.id}>
                                                {language === 'ar' ? " المنتج " : "Product"} {product.product_id} :
                                                {language === 'ar' ? ' ج.م ' : "EG "}{parseFloat(product.total_price).toFixed(2)}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{language === 'ar' ? ' ج.م ' : "EG "}{parseFloat(order.total_price_for_order).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip label={order.status} color={getStatusColor(order.status)} variant="outlined" />
                                    </TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <EmptyOrdersMessage language={language} />
            )}
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="d-flex justify-content-center my-5">
            <CircularProgress />
        </div>
    );
}

function ErrorMessage({ message }) {
    return (
        <Typography className="text-center text-danger fw-bold my-5">
            {message}
        </Typography>
    );
}

function EmptyOrdersMessage({ language }) {
    return (
        <div className="d-flex flex-column align-items-center">
            <img src={emptyWishList} loading="lazy" alt="empty cart" className="col-2" />
            <Typography variant="h6" className="fw-bold mt-2">
                {language === "ar" ? "لا توجد طلبات" : "No orders yet"}
            </Typography>
            <Typography variant="body1" className="text-secondary">
                {language === "ar" ? "ابدأ التسوق لإضافة الطلبات" : "Start shopping to place orders"}
            </Typography>
            <Link to="/" className="mt-3">
                <Button variant="contained" className="rounded-pill bg-most-used text-light px-4 py-2">
                    {language === "ar" ? "تسوق الآن" : "Shop Now"}
                </Button>
            </Link>
        </div>
    );
}

const arabicHeaders = ["رقم الطلب", "طريقة الدفع", "المنتجات", "إجمالي المبلغ", "حالة الطلب", "التاريخ"];

export default OrderList;