import { Button } from '@mui/material';
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { TbDeviceWatchQuestion } from "react-icons/tb";
import { MdOutlineLocalOffer, MdOutlineWatch, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";
import { useContext, useState } from 'react';
import { MyContext } from '../../../Context/Context';

function Nav() {
    const { language, setCurrentPage, products, tables, setFilters } = useContext(MyContext);
    const [isHovered, setIsHovered] = useState(false);
    const handleCategoryClick = (categoryName) => {
        const category = tables.categoryTypes.find(
            (category) => category.category_type_name === categoryName
        );

        if (category) {
            setFilters({
                categories: [category.id],
                brands: [],
                subTypes: [],
                price: [0, 6000],
            });
            setCurrentPage(1);
        }
    };

    return (
        <nav className='Nav'>
            <div className='container-fluid px-5'>
                <div className='row'>
                    <div className='col-sm-3 d-flex justify-content-start'>
                        <div
                            className="cat-nav col-12"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Button
                                className="all-cat-tap col-8 py-2 rounded-5 text-light"
                                title="All Categories"
                                style={{ background: "#262626E0", transition: "background 0.3s ease-in-out" }}
                            >
                                <span><IoIosMenu style={{ fontSize: "25px" }} /></span>
                                <span className="text-uppercase dosis-regular mx-2">
                                    {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                                </span>
                                <span><FaAngleDown style={{ fontSize: "25px" }} /></span>
                            </Button>
                            {isHovered && (
                                <div
                                    className={`side-menu p-3 col-8 d-flex flex-column rounded-bottom-3 border border-1 ${language === "ar" ? "side-menu-ar" : ""
                                        }`}
                                >
                                    {tables.subTypes &&
                                        tables.subTypes
                                            .filter((subtype) => products.some((product) => product.sub_type_id === subtype.id)) // 🔹 Only subtypes with products
                                            .map((subtype, i) => (
                                                <Link
                                                    to={`/subtypes/${subtype.sub_type_name}`}
                                                    key={i}
                                                    className="text-decoration-none col-12 d-flex text-start px-2 py-1 color-most-used"
                                                    onClick={() => {
                                                        setFilters({
                                                            categories: [],
                                                            brands: [],
                                                            subTypes: [subtype.id],
                                                            price: [0, 6000],
                                                        });
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <Button
                                                        className="col-12 color-most-used justify-content-start"
                                                        title={subtype.sub_type_name}
                                                    >
                                                        {subtype.translations.map((translation) =>
                                                            translation.locale === language ? translation.sub_type_name : null
                                                        )}
                                                    </Button>
                                                </Link>
                                            ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='col-sm-9 d-flex align-items-center'>
                        <ul className='list list-inline mb-0 col-md-10 col-12 d-flex dosis-regular px-md-5 px-0 nav-ul' style={{ textTransform: "uppercase" }}>
                            <li className='list-inline-item col-2 text-center'>
                                <Link to={'/'} className='text-decoration-none color-most-used py-2 px-3'>
                                    <AiOutlineHome className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
                                </Link>
                            </li>
                            <li className='col-2 list-inline-item'>
                                <Link
                                    to={'/category/Watches'}
                                    className='text-decoration-none color-most-used py-2 px-3'
                                    onClick={() => handleCategoryClick("Watches")}
                                >
                                    <MdOutlineWatch className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'الساعات' : 'Watches'}
                                </Link>
                            </li>
                            <li className='col-2 list-inline-item'>
                                <Link
                                    to={'/category/Fashion'}
                                    className='text-decoration-none color-most-used py-2 px-3'
                                    onClick={() => handleCategoryClick("Fashion")}
                                >
                                    <IoShirtOutline className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'الموضة' : 'Fashion'}
                                </Link>
                            </li>

                            <li className='col-2 list-inline-item'>
                                <div className='text-decoration-none color-most-used a py-2 px-3'>
                                    <TbDeviceWatchQuestion className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'العلامات التجارية' : 'Brands'}
                                    <MdOutlineKeyboardArrowDown className='mx-2' style={{ fontSize: "20px" }} />
                                </div>
                                <div className={`sub-menu  ${language === 'ar' ? 'sub-menu-ar' : ''}`}>
                                    {tables.brands && tables.brands.filter((brand) => products.some((product) => product.brand_id === brand.id)).map((brand, i) => (
                                        <Link
                                            key={i}
                                            to={`/brand/${brand.brand_name}`}
                                            className='text-decoration-none text-start p-2 color-most-used'
                                            onClick={() => {
                                                setFilters(
                                                    {
                                                        categories: [],
                                                        brands: [brand.id],
                                                        subTypes: [],
                                                        price: [0, 6000],
                                                    }
                                                );
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {brand.translations.map(
                                                (translation) => translation.locale === language ? translation.brand_name : null
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </li>
                            <li className='col-2 list-inline-item'>
                                <Link to={'/offers'} className='text-decoration-none color-most-used py-2 px-3' onClick={() => setCurrentPage(1)}>
                                    <MdOutlineLocalOffer className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'العروض' : 'Offers'}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Nav;