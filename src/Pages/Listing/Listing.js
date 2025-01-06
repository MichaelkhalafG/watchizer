import SideBar from "../../Components/SideBar/SideBar";
import "./Listing.css";
import { MyContext } from "../../App";
import { FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { SlSizeFullscreen } from "react-icons/sl";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import ProductModel from "../../Components/Product/ProductModel";
import Pagination from "@mui/material/Pagination";

function Listing() {
    const { language, products, filters, setFilters } = useContext(MyContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [shownum, setShownum] = useState(10);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [colselected, setColselected] = useState("col-3");
    const [currentPage, setCurrentPage] = useState(1);

    const isRTL = language === "ar";

    useEffect(() => {
        let filtered = products || [];
        if (filters.categories.length > 0) {
            filtered = filtered.filter((product) =>
                filters.categories.includes(product.category_type_id)
            );
        }
        if (filters.brands.length > 0) {
            filtered = filtered.filter((product) =>
                filters.brands.includes(product.brand_id)
            );
        }
        if (filters.subTypes.length > 0) {
            filtered = filtered.filter((product) =>
                filters.subTypes.includes(product.sub_type_id)
            );
        }
        if (filters.price[0] !== 0 || filters.price[1] !== 6000) {
            filtered = filtered.filter(
                (product) =>
                    product.sale_price_after_discount >= filters.price[0] &&
                    product.sale_price_after_discount <= filters.price[1]
            );
        }
        // if (filters.rating !== null) {
        //     filtered = filtered.filter((product) => {
        //         const productRating = product.rating || 0;
        //         return Math.round(productRating) >= filters.rating;
        //     });
        // }
        setFilteredProducts(filtered);
    }, [filters, products]);




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
    };
    const totalPages = Math.ceil(filteredProducts.length / shownum);
    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * shownum,
        currentPage * shownum
    );
    return (
        <div className={`container product-listing ${isRTL ? "rtl" : "ltr"}`}>
            <div className="row">
                <div className="col-md-3">
                    <SideBar setFilters={setFilters} />
                </div>
                <div className="col-md-9">
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
                            <div className="row pt-4">
                                <div className="col-12 px-4 bg-2 rounded-3 p-2">
                                    <div className="row">
                                        <div className="col-10 d-flex align-items-center">
                                            <button
                                                className="color-most-used btn px-1"
                                                onClick={() => setColselected("col-3")}
                                            >
                                                <BsFillGrid3X3GapFill className="fs-3" />
                                            </button>
                                            <button
                                                className="color-most-used btn px-1"
                                                onClick={() => setColselected("col-4")}
                                            >
                                                <IoGrid className="fs-3" />
                                            </button>
                                        </div>
                                        <div className="col-2 d-flex justify-content-end">
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
                                    <div className="row">
                                        {displayedProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className={`p-2 ${colselected}`}
                                                style={{ height: "100%" }}
                                            >
                                                <div className="card product-card border-0 rounded-3 shadow-sm d-flex flex-column position-relative">
                                                    <div className="action-menu position-absolute">
                                                        <button
                                                            className="btn btn-dark rounded-circle"
                                                            onClick={() => handleProductClick(product)}
                                                        >
                                                            <SlSizeFullscreen />
                                                        </button>
                                                        <button className="btn mt-2 btn-danger rounded-circle">
                                                            <FaRegHeart />
                                                        </button>
                                                    </div>
                                                    <Link to={`/product/${product.id}`} className="product-img-container">
                                                        <img
                                                            src={product.image || "/placeholder.png"}
                                                            alt={product.wa_code || "Product"}
                                                            className="img-fluid rounded-top"
                                                            loading="lazy"
                                                        />
                                                    </Link>
                                                    <div className="card-body d-flex flex-column justify-content-between p-3">
                                                        <h6
                                                            className={`card-title ${isRTL ? "text-end" : ""
                                                                } fw-bold mb-2`}
                                                        >
                                                            {product.product_title}
                                                        </h6>
                                                        <p
                                                            className={`card-text ${isRTL ? "text-end" : ""
                                                                } text-secondary mb-3`}
                                                            style={{ fontSize: "0.9rem" }}
                                                        >
                                                            {product.short_description?.length > 100
                                                                ? `${product.short_description.slice(0, 100)}...`
                                                                : product.short_description || ""}
                                                        </p>
                                                        <div className="d-flex justify-content-center align-items-center mb-2">
                                                            <span
                                                                className="color-most-used fw-bold me-2"
                                                                style={{ fontSize: "1.1rem" }}
                                                            >
                                                                {Math.round(product.sale_price_after_discount)}{" "}
                                                                {isRTL ? "ج.م" : "EGP"}
                                                            </span>
                                                            <span
                                                                className="text-muted text-decoration-line-through"
                                                                style={{ fontSize: "0.9rem" }}
                                                            >
                                                                {Math.round(product.selling_price)}{" "}
                                                                {isRTL ? "ج.م" : "EGP"}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <span
                                                                    className={`badge ${product.stock > 0
                                                                        ? "bg-success"
                                                                        : "bg-danger"
                                                                        }`}
                                                                >
                                                                    {isRTL
                                                                        ? product.stock > 0
                                                                            ? "متوفر"
                                                                            : "غير متوفر"
                                                                        : product.stock > 0
                                                                            ? "In Stock"
                                                                            : "Out of Stock"}
                                                                </span>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <Rating
                                                                    name="read-only"
                                                                    value={Math.round(
                                                                        product.rating === null ? 5 : product.rating
                                                                    )}
                                                                    size="small"
                                                                    readOnly
                                                                />
                                                                <span className="ms-2">
                                                                    (
                                                                    {Math.round(
                                                                        product.rating === null ? 5 : product.rating
                                                                    )}
                                                                    )
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="btn btn-outline-dark rounded-4 mt-2"
                                                            disabled={product.stock <= 0}
                                                        >
                                                            {isRTL ? "أضف إلى السلة" : "Add to Cart"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-center mt-4">
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
