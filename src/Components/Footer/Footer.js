import './Footer.css';
import { FaShippingFast, FaPhoneVolume, FaUndoAlt, FaTag, FaFacebookF, FaInstagram } from "react-icons/fa";
import { useContext } from 'react';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

function Footer() {
    const { language } = useContext(MyContext);

    return (
        <footer className='footer'>
            {/* Top Section with Features */}
            <div className='top-features container py-4'>
                <div className='row py-4 border-bottom border-1 text-center'>
                    <div className={`col-6 col-md-3 ${language === 'ar' ? 'border-start' : 'border-end'}  border-1 feature-item`}>
                        <p><FaShippingFast className="mx-2" style={{ fontSize: "1.5rem" }} />{language === 'ar' ? 'شحن سريع ' : 'Fast Shipping'}</p>
                    </div>
                    <div className={`col-6 col-md-3 ${language === 'ar' ? 'border-start' : 'border-end'}  border-1 feature-item`}>
                        <p><FaPhoneVolume className="mx-2" style={{ fontSize: "1.5rem" }} />{language === 'ar' ? 'دعم فني 24/7' : '24/7 Customer Support'}</p>
                    </div>
                    <div className={`col-6 col-md-3 ${language === 'ar' ? 'border-start' : 'border-end'}  border-1 feature-item`}>
                        <p><FaUndoAlt className="mx-2" style={{ fontSize: "1.5rem" }} />{language === 'ar' ? 'سياسة إرجاع سهلة' : 'Easy Return Policy'}</p>
                    </div>
                    <div className='col-6 col-md-3 feature-item'>
                        <p><FaTag className="mx-2" style={{ fontSize: "1.5rem" }} />{language === 'ar' ? 'أفضل العروض والأسعار' : 'Best Deals & Prices'}</p>
                    </div>
                </div>
            </div>

            {/* Footer Categories */}
            <div className='footer-categories container py-5'>
                <div className='row'>
                    <div className='col-6 col-lg-3 mb-4'>
                        <h6 className='category-title'>Men's Watches</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/luxury-watches">Luxury Watches</Link></li>
                            <li><Link to="/sports-watches">Sports Watches</Link></li>
                            <li><Link to="/casual-watches">Casual Watches</Link></li>
                            <li><Link to="/smart-watches">Smart Watches</Link></li>
                        </ul>
                    </div>
                    <div className='col-6 col-lg-3 mb-4'>
                        <h6 className='category-title'>Women's Watches</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/womens-luxury">Luxury Watches</Link></li>
                            <li><Link to="/womens-fitness">Fitness Watches</Link></li>
                            <li><Link to="/womens-casual">Casual Watches</Link></li>
                            <li><Link to="/womens-smart">Smart Watches</Link></li>
                        </ul>
                    </div>
                    <div className='col-6 col-lg-3 mb-4'>
                        <h6 className='category-title'>Brands</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/brands/rolex">Rolex</Link></li>
                            <li><Link to="/brands/omega">Omega</Link></li>
                            <li><Link to="/brands/seiko">Seiko</Link></li>
                            <li><Link to="/brands/casio">Casio</Link></li>
                        </ul>
                    </div>
                    <div className='col-6 col-lg-3 mb-4'>
                        <h6 className='category-title'>Customer Service</h6>
                        <ul className='list-unstyled'>
                            <li><Link to="/faqs">FAQs</Link></li>
                            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                            <li><Link to="/return-policy">Return Policy</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}

            <div className='footer-bottom container py-3 text-center'>
                <div className='row align-items-center'>
                    <div className='col-6'>
                        <p className={`text-${language === 'ar' ? 'end' : 'start'}`}>
                            &copy; {new Date().getFullYear()} {language === 'ar' ? 'جميع الحقوق محفوظة' : 'Watchizer All Rights Reserved'}
                        </p>
                    </div>
                    <div className={`col-6 d-flex ${language === 'ar' ? 'justify-content-start' : 'justify-content-end'} social-buttons`}>
                        <a href="https://www.facebook.com/watchizer.fashion.egypt" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className='mx-2'>
                            <FaFacebookF style={{ height: '20px', width: '20px' }} />
                        </a>
                        <a href="https://www.instagram.com/watchizer_eg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram style={{ height: '20px', width: '20px' }} />
                        </a>
                    </div>
                </div>
            </div>

        </footer>
    );
}

export default Footer;
