import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { Button, IconButton } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

function SearchPageForPhone() {
    const { language, products } = useContext(MyContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1); // Go back to the previous page
    };
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim() === "") {
                setFilteredResults([]);
            } else {
                const filtered = products.filter((product) =>
                    product.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredResults(filtered);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, products]);
    const handleProductClick = (productTitle) => {
        setSearchTerm("");
        setFilteredResults([]);
    };

    return (
        <div className="search-overlay position-fixed top-0 left-0 w-100 h-100 bg-white d-flex flex-column p-3" style={{ zIndex: 1050 }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">{language === "ar" ? "بحث" : "Search"}</h5>
                <IconButton onClick={handleClose} style={{ fontSize: "24px" }}>
                    <IoMdClose />
                </IconButton>
            </div>
            <div className="search-box p-2 px-4 border border-2 rounded-3 d-flex align-items-center" style={{ background: "#f3f4f7" }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === "ar" ? "البحث عن المنتجات" : "Search for products..."}
                    className="border-0 flex-grow-1"
                    style={{ background: "transparent", outline: "none", fontSize: "18px", color: "rgba(0,0,0,0.8)" }}
                />
                <Button className="p-0 border-0 text-black" type="submit" style={{ background: "transparent", minWidth: "40px" }}>
                    <IoIosSearch />
                </Button>
            </div>
            {filteredResults.length > 0 && (
                <ul className="list-unstyled mt-3">
                    {filteredResults.slice(0, 5).map((product) => (
                        <li key={product.id} className="p-2 border-bottom">
                            <Link
                                to={`/product/${product.product_title}`}
                                className="text-decoration-none d-flex align-items-center"
                                onClick={() => handleProductClick(product.product_title)}
                            >
                                <img
                                    src={product.image || "/placeholder.png"}
                                    alt={product.product_title}
                                    className="rounded-circle me-2"
                                    style={{ width: "40px", height: "40px" }}
                                />
                                <span className="text-dark">{product.product_title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchPageForPhone;
