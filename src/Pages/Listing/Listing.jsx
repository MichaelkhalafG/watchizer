import SideBar from "../../Components/SideBar/SideBar";
import "./Listing.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MyContext } from "../../Context/Context";
import { FormControl, Drawer, InputLabel, MenuItem, Select, Button, Snackbar, Alert } from "@mui/material";
import { useContext, useState, useEffect, Suspense } from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { SlSizeFullscreen } from "react-icons/sl";
import { Link } from "react-router-dom";
import axios from "axios";
// import { Rating } from "@mui/material";
import ProductModel from "../../Components/Product/ProductModel";
import Pagination from "@mui/material/Pagination";

function Listing() {
    const { language, currentPage, setCurrentPage, fetchCart, tables, watches, fashion, offers, setCart, user_id, Loader, products, windowWidth, filters, setFilters, handleAddTowishlist } = useContext(MyContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [shownum, setShownum] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [colselected, setColselected] = useState("col-md-3 col-6");
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    const [openAlert, setOpenAlert] = useState(false);

    const toggleDrawer = (newOpen) => {
        return () => {
            setOpen(newOpen);
        };
    };

    const isRTL = language === "ar";
    useEffect(() => {
        if (!products?.length && !watches?.length && !fashion?.length) return;

        let thelisttofilter = products;

        if (filters.categories.length > 0) {
            let filterscat = filters.categories.map((cat) => {
                let category = tables.categoryTypes?.find((item) => item.id === cat);
                return category?.translations?.find((t) => t.locale === language)?.category_type_name;
            }).filter(Boolean);

            if (filterscat.length === 1) {
                if (filterscat[0] === "Watches") {
                    thelisttofilter = watches;
                } else if (filterscat[0] === "Fashion") {
                    thelisttofilter = fashion;
                }
            }
            else {
                thelisttofilter = products;
            }
        }
        const filtered = thelisttofilter.filter((product) => {
            return (
                (filters.brands.length === 0 || filters.brands.includes(product.brand_id)) &&
                (filters.subTypes.length === 0 || filters.subTypes.includes(product.sub_type_id)) &&
                (filters.price[0] <= product.sale_price_after_discount && product.sale_price_after_discount <= filters.price[1])
            );
        });

        setFilteredProducts(filtered);
    }, [filters, products, watches, fashion, tables, language]);



    const handleChange = (event) => {
        setShownum(event.target.value);
        setCurrentPage(1);
    };
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };
    const totalPages = Math.ceil(filteredProducts.length / shownum);
    useEffect(() => {
        if (!filteredProducts) return;

        setDisplayedProducts(filteredProducts.slice(
            (currentPage - 1) * shownum,
            currentPage * shownum
        ));
    }, [currentPage, filters, filteredProducts, shownum]);

    const handleAddToCart = (product, type_stock) => {
        if (!user_id) {
            setAlertMessage(language === "ar" ? "يجب تسجيل الدخول أولاً!" : "You must login first!");
            setAlertType("warning");
            setOpenAlert(true);
        } else {
            const piecePrice = parseInt(product.sale_price_after_discount, 10);
            const totalPrice = piecePrice * 1;

            if (isNaN(totalPrice) || totalPrice <= 0) {
                setAlertMessage(language === "ar" ? "حدث خطأ في حساب السعر الإجمالي." : "There was an error calculating the total price.");
                setAlertType("error");
                setOpenAlert(true);
                return;
            }

            const payload = {
                user_id: user_id,
                product_id: product.id,
                quantity: 1,
                piece_price: piecePrice,
                type_stock: type_stock,
                total_price: totalPrice,
            };
            // console.log(payload);

            axios.post("https://dash.watchizereg.com/api/add_to_cart", payload, {
                headers: {
                    "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"
                }
            })
                .then(() => {
                    setAlertMessage(language === "ar" ? "تمت الإضافة إلى السلة!" : "Added to the cart!");
                    setAlertType("success");
                    setOpenAlert(true);
                    fetchCart(user_id, products, offers, language, setCart);
                })
                .catch(() => {
                    // console.error("Error adding to cart:", error);
                    setAlertMessage(language === "ar" ? "حدث خطأ أثناء الإضافة إلى السلة." : "An error occurred while adding to the cart.");
                    setAlertType("error");
                    setOpenAlert(true);
                });
        }
    };
    return (
        <div className={`container product-listing ${isRTL ? "rtl" : "ltr"}`}>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}
                anchorOrigin={{ vertical: windowWidth >= 768 ? "bottom" : "top", horizontal: windowWidth >= 768 ? "right" : "left" }}
            >
                <Alert severity={alertType} onClose={() => setOpenAlert(false)}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            <div className="row">
                {windowWidth <= 768 ?
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        <button
                            className="btn btn-dark rounded-0"
                            onClick={toggleDrawer(false)}
                        >
                            {language === "ar" ? "اغلاق الفلاتر" : "Close Filters"}
                        </button>
                        <SideBar setFilters={setFilters} />
                    </Drawer>
                    :
                    <div className="col-md-3">
                        <SideBar setFilters={setFilters} />
                    </div>
                }
                <div className="col-md-9 pb-md-1 pb-5 col-12">
                    {
                        filteredProducts.length === 0 ? (
                            <div className="row pt-4">
                                <div className="row justify-content-center align-items-center p-5 text-center" style={{ minHeight: "50vh" }}>
                                    <h2 className="text-danger fw-bold col-12">
                                        {isRTL ? "لا توجد منتجات" : "No Products Found"}
                                    </h2>
                                    <Button
                                        variant="contained"
                                        className="rounded-pill bg-most-used text-light col-12 col-md-4 py-3 fw-bold"
                                        onClick={() => setFilters({ categories: [], brands: [], subTypes: [], price: [0, 6000] })}
                                    >
                                        {isRTL ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={`row ${windowWidth >= 768 ? 'pt-4' : ""}`}>
                                <div className="col-12 px-4 bg-2 rounded-3 p-2">
                                    <div className="row">
                                        <div className="col-md-10 col-8 d-flex align-items-center">
                                            <button
                                                className="color-most-used btn px-1"
                                                onClick={() => { setColselected("col-md-3 col-6") }}
                                            >
                                                <BsFillGrid3X3GapFill className="fs-3" />
                                            </button>
                                            <button
                                                className="color-most-used btn px-1"
                                                onClick={() => { setColselected("col-md-4 col-12") }}
                                            >
                                                <IoGrid className="fs-3" />
                                            </button>
                                        </div>
                                        <div className="col-md-2 col-4 d-flex justify-content-end">
                                            <FormControl size="small" className="text-light">
                                                <InputLabel id="select-label" className="text-light">
                                                    {isRTL ? "عرض" : "Show"}
                                                </InputLabel>
                                                <Select
                                                    labelId="select-label"
                                                    id="simple-select"
                                                    value={shownum}
                                                    onChange={handleChange}
                                                    className="text-light"
                                                    variant="outlined"
                                                >
                                                    {[10, 20, 30, 40,].map((num) => (
                                                        <MenuItem key={num} value={num}>
                                                            {num}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 py-2">
                                    {windowWidth <= 768 ? <div className="row justify-content-center" >
                                        <button className="btn btn-dark col-10" onClick={() => {
                                            toggleDrawer(true)();
                                        }}
                                        >{language === "ar" ? "تخصيص فلاتر" : "Set Filters"}</button>
                                    </div> : null}
                                    <div className="row">
                                        {displayedProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className={`p-2 ${colselected}`}
                                                style={{ height: "100%" }}
                                            >
                                                <div className="card product-card border-0 rounded-3 shadow-sm d-flex flex-column position-relative">
                                                    <div className="action-menu position-absolute" style={{ zIndex: 1000 }}>
                                                        {windowWidth >= 768 ?
                                                            <button
                                                                className="btn btn-dark rounded-circle"
                                                                onClick={() => handleProductClick(product)}
                                                            >
                                                                <SlSizeFullscreen />
                                                            </button>
                                                            :
                                                            <Link
                                                                to={`/product/${product.product_title}`}
                                                                className="btn btn-dark rounded-circle"
                                                            >
                                                                <SlSizeFullscreen />
                                                            </Link>
                                                        }
                                                        <button
                                                            className="btn mt-2 btn-danger rounded-circle"
                                                            onClick={() => handleAddTowishlist(product.id, "p")}
                                                        >
                                                            <FaRegHeart />
                                                        </button>
                                                    </div>
                                                    <Link to={`/product/${product.product_title}`} className="product-img-container">
                                                        {/* <img
                                                            src={product.image || "/placeholder.png"}
                                                            alt={product.wa_code || "Product"}
                                                            className="img-fluid rounded-top"
                                                            loading="lazy"
                                                        /> */}
                                                        <Suspense fallback={<Loader />}>
                                                            <LazyLoadImage
                                                                src={product.image || "/placeholder.png"}
                                                                alt={product.wa_code || "Product"}
                                                                srcSet={`${product.image}?w=400 400w, ${product.image}?w=800 800w`}
                                                                effect="blur"
                                                                width="100%"
                                                                height="auto"
                                                                className="img-fluid rounded-top"
                                                            />
                                                        </Suspense>
                                                    </Link>
                                                    <div className="card-body d-flex flex-column justify-content-between p-3">
                                                        <h6 className={`card-title ${language === 'ar' ? 'text-end' : ''} fs-large fw-bold mb-2`} style={{ fontSize: 'small' }}>
                                                            {product.product_title.length > 30 ? (
                                                                <>
                                                                    {product.product_title.slice(0, 30)}...
                                                                </>
                                                            ) : product.product_title.length <= 20 ? (
                                                                <>
                                                                    {product.product_title}
                                                                    <br />
                                                                    <br />
                                                                </>
                                                            ) : (
                                                                product.product_title
                                                            )}
                                                        </h6>
                                                        <p className={`card-text ${language === 'ar' ? 'text-end' : ''}  text-secondary mb-3`} style={{ fontSize: '0.9rem' }}>
                                                            {product.short_description.length > 100 ? (
                                                                <>
                                                                    {product.short_description.slice(0, 100)}...
                                                                </>
                                                            ) : product.short_description.length <= 50 ? (
                                                                <>
                                                                    {product.short_description}
                                                                    <br />
                                                                    <br />
                                                                </>
                                                            ) : (
                                                                product.short_description
                                                            )}
                                                        </p>
                                                        <div className="d-flex justify-content-center align-items-center mb-2">
                                                            <span className="color-most-used fw-bold me-2 fs-large" style={{ fontSize: 'small' }}>
                                                                {Math.round(product.sale_price_after_discount)} {language === 'ar' ? 'ج.م' : 'EGP'}
                                                            </span>
                                                            <span className="text-muted text-decoration-line-through fs-large" style={{ fontSize: 'small' }}>
                                                                {Math.round(product.selling_price)} {language === 'ar' ? 'ج.م' : 'EGP'}
                                                            </span>
                                                        </div>

                                                        <div className="row justify-content-between align-items-center">
                                                            <div className='col-12 p-1'>
                                                                <span className={`badge ${parseInt(product.stock) > 0 ? 'bg-black' : parseInt(product.market_stock) > 0 ? "bg-success" : 'bg-danger'} col-12`}>
                                                                    {language === 'ar' ? (parseInt(product.stock) > 0 ? 'اكسبريس' : parseInt(product.market_stock) > 0 ? "ماركت" : 'غير متوفر')
                                                                        : (parseInt(product.stock) > 0 ? 'Express' : parseInt(product.market_stock) > 0 ? "Market Place" : 'Out of Stock')}
                                                                </span>
                                                            </div>
                                                            {/* <div className="col-12 p-1 justify-content-center col-12 align-items-center">
                                                                <Rating name="read-only" className={`${windowWidth <= 768 ? "col-12" : ""}`} value={Math.round(product.rating === null ? 5 : product.rating)} size="small" readOnly />
                                                                <span className={` mx-1 ${windowWidth <= 768 ? "d-none" : ""}`}>({Math.round(product.rating === null ? 5 : product.rating)})</span>
                                                            </div> */}
                                                        </div>
                                                        {user_id && user_id !== null ?
                                                            <Link onClick={() => handleAddToCart(product, (parseInt(product.stock) > 0 ? 'Express' : "Market"))}
                                                                className="btn btn-outline-dark rounded-4 mt-2"
                                                                disabled={parseInt(product.stock) <= 0}
                                                            >
                                                                {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                                                            </Link>
                                                            :
                                                            <Link to={`/login`}
                                                                className="btn btn-outline-dark rounded-4 mt-2"
                                                                disabled={(parseInt(product.stock) <= 0 || parseInt(product.market_stock) <= 0)}
                                                            >
                                                                {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                                                            </Link>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-center mb-md-0 mb-5 mt-4">
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </div>
                                    {selectedProduct && (
                                        <ProductModel
                                            open={isModalOpen}
                                            onClose={handleModalClose}
                                            product={selectedProduct}
                                            language={language}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Listing;
