import { Button } from '@mui/material';
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { TbDeviceWatchQuestion } from "react-icons/tb";
import { MdOutlineLocalOffer, MdOutlineWatch, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import { useContext, useState } from 'react';
import { MyContext } from '../../../App';

function Nav() {
    const { language, tables, setFilters } = useContext(MyContext);
    const [cat_opend, setCat_opend] = useState(false);

    function openCat() {
        setCat_opend(!cat_opend);
    }
    return (
        <nav className='Nav'>
            <div className='container-fluid px-5'>
                <div className='row'>
                    <div className='col-sm-3 d-flex justify-content-start'>
                        <div className='cat-nav col-12'>
                            <Button className='all-cat-tap col-8 py-2 rounded-5 text-light' onClick={() => { openCat() }} style={{ background: "#262626E0" }}>
                                <span>
                                    <IoIosMenu style={{ fontSize: "25px" }} />
                                </span>
                                <span className='text-uppercase dosis-regular mx-2'>{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</span>
                                <span>
                                    <FaAngleDown style={{ fontSize: "25px" }} />
                                </span>
                            </Button>
                            <div className={`side-menu mt-3 p-3 col-8 ${cat_opend ? 'd-flex' : 'd-none'} flex-column rounded-bottom-3 border border-1 ${language === 'ar' ? 'side-menu-ar' : ''}`} >
                                {tables.subTypes && tables.subTypes.map((subtype, i) => (
                                    <Link
                                        to={`/subtypes/${subtype.sub_type_name}`}
                                        key={i}
                                        className='text-decoration-none col-12 d-flex text-start px-2 py-1 color-most-used'
                                        onClick={() => setFilters(
                                            {
                                                categories: [],
                                                brands: [],
                                                subTypes: [subtype.id],
                                                price: [0, 6000],
                                            }
                                        )}
                                    >
                                        <Button className='col-12 color-most-used justify-content-start' >
                                            {subtype.translations.map(
                                                (translation) => translation.locale === language ? translation.sub_type_name : null
                                            )}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-9 d-flex align-items-center'>
                        <ul className='list list-inline mb-0 col-12 d-flex dosis-regular ms-auto nav-ul' style={{ textTransform: "uppercase" }}>
                            <li className='list-inline-item text-center'>
                                <Link to={'/'} className='text-decoration-none color-most-used py-2 px-3'>
                                    <AiOutlineHome className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
                                </Link>
                            </li>
                            <li className='list-inline-item'>
                                <Link
                                    to={'/category/Watches'}
                                    className='text-decoration-none color-most-used py-2 px-3'
                                    onClick={() => setFilters(
                                        {
                                            categories: [
                                                tables.categoryTypes.find((category) => (
                                                    category.category_type_name === "Watches"
                                                )).id
                                            ],
                                            brands: [],
                                            subTypes: [],
                                            price: [0, 6000],
                                        }
                                    )}
                                >
                                    <MdOutlineWatch className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'الساعات' : 'Watches'}
                                </Link>
                            </li>
                            <li className='list-inline-item'>
                                <Link
                                    to={'/category/Fashion'}
                                    className='text-decoration-none color-most-used py-2 px-3'
                                    onClick={() => setFilters(
                                        {
                                            categories: [
                                                tables.categoryTypes.find((category) => (
                                                    category.category_type_name === "Fashion"
                                                )).id
                                            ],
                                            brands: [],
                                            subTypes: [],
                                            price: [0, 6000],
                                        }
                                    )}
                                >
                                    <IoShirtOutline className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'الموضة' : 'Fashion'}
                                </Link>
                            </li>
                            <li className='list-inline-item'>
                                <div className='text-decoration-none color-most-used a py-2 px-3'>
                                    <TbDeviceWatchQuestion className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'العلامات التجارية' : 'Brands'}
                                    <MdOutlineKeyboardArrowDown className='mx-2' style={{ fontSize: "20px" }} />
                                </div>
                                <div className={`sub-menu  ${language === 'ar' ? 'sub-menu-ar' : ''}`}>
                                    {tables.brands && tables.brands.map((brand, i) => (
                                        <Link
                                            key={i}
                                            to={`/brand/${brand.brand_name}`}
                                            className='text-decoration-none text-start p-2 color-most-used'
                                            onClick={() => setFilters(
                                                {
                                                    categories: [],
                                                    brands: [brand.id],
                                                    subTypes: [],
                                                    price: [0, 6000],
                                                }
                                            )
                                            }
                                        >
                                            {brand.translations.map(
                                                (translation) => translation.locale === language ? translation.brand_name : null
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </li>
                            <li className='list-inline-item'>
                                <Link to={'/offers'} className='text-decoration-none color-most-used py-2 px-3'>
                                    <MdOutlineLocalOffer className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'العروض' : 'Offers'}
                                </Link>
                            </li>
                            <li className='list-inline-item'>
                                <Link to={'/'} className='text-decoration-none color-most-used py-2 px-3'>
                                    <BiSolidOffer className='mx-2' style={{ fontSize: "20px" }} />
                                    {language === 'ar' ? 'التخفيضات' : 'Sales'}
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