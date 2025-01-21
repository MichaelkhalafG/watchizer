import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoBagOutline } from 'react-icons/io5';
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineLocalOffer, MdOutlineWatch } from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";
import './PhoneNavBar.css';
import { MyContext } from '../../../App';

function PhoneNavBar() {
    const { tables, setFilters } = useContext(MyContext);

    const handleSetFilters = (categoryName) => {
        const category = tables.categoryTypes.find(cat => cat.category_type_name === categoryName);
        if (category) {
            setFilters({
                categories: [category.id],
                brands: [],
                subTypes: [],
                price: [0, 6000],
            });
        }
    };

    return (
        <div className="phone-nav-bar bg-light position-relative position-fixed text-light p-3">
            <div className="rounded-circle align-items-center justify-content-center d-flex flex-column text-center bg-dark"
                style={{ position: "absolute", top: "-8px", left: "50%", transform: "translate(-50%,-50%)", height: "50px", width: "50px" }}>
                <Link to="/cart" className="text-light d-flex align-items-center justify-content-center p-2">
                    <IoBagOutline size={24} />
                </Link>
            </div>
            <div className="d-flex col-12 shadow-1 p-0 m-0">
                <Link to="/" className="col-3 text-decoration-none border-end text-center color-most-used px-3">
                    <AiOutlineHome style={{ fontSize: "20px" }} />
                </Link>
                <Link
                    to="/category/Watches"
                    className="col-3 text-decoration-none border-end text-center color-most-used px-3"
                    onClick={() => handleSetFilters("Watches")}
                >
                    <MdOutlineWatch style={{ fontSize: "20px" }} />
                </Link>
                <Link
                    to="/category/Fashion"
                    className="col-3 text-decoration-none border-end text-center color-most-used px-3"
                    onClick={() => handleSetFilters("Fashion")}
                >
                    <IoShirtOutline style={{ fontSize: "20px" }} />
                </Link>
                <Link to="/offers" className="col-3 text-decoration-none border-end text-center color-most-used px-3">
                    <MdOutlineLocalOffer style={{ fontSize: "20px" }} />
                </Link>
            </div>
        </div>
    );
}

export default PhoneNavBar;
