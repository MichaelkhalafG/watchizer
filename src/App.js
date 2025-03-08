import { Suspense, useEffect, lazy, useContext } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Cart from './Pages/Cart/Cart';
import PhoneCart from './Pages/Cart/PhoneCart';
import Checkout from './Pages/Checkout/Checkout';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import PhoneNavBar from './Components/Header/PhoneNavBar/PhoneNavBar';
import { HelmetProvider, Helmet } from "react-helmet-async";
import { MyContext, MyProvider } from './Context/Context';
import { Alert, Snackbar } from '@mui/material';
import useFacebookPixel from './scripts/useFacebookPixel';
const NotFound = lazy(() => import('./Pages/Not Found/NotFound'));
const ProductDisplay = lazy(() => import('./Components/Product/ProductDisplay'));
const Listing = lazy(() => import('./Pages/Listing/Listing'));
const ListingSearch = lazy(() => import('./Pages/Listing/ListingSearch'));
const ListingGrades = lazy(() => import('./Pages/Listing/ListingGrades'));
const Listingoffers = lazy(() => import('./Pages/Listing/Listingoffers'));
const ProfileSpeed = lazy(() => import('./Components/Header/Nav/ProfileSpeed'));
const ProfileSpeedPhone = lazy(() => import('./Components/Header/Nav/ProfileSpeedPhone'));
const EditProfile = lazy(() => import('./Pages/EditProfile/EditProfile'));
const PhoneWishList = lazy(() => import('./Pages/WishList/PhoneWishList'));
const WishList = lazy(() => import('./Pages/WishList/WishList'));
const OrderList = lazy(() => import('./Pages/OrderList/OrderList'));
const OfferDisplay = lazy(() => import('./Components/Product/OfferDisplay'));
const Login = lazy(() => import('./Pages/Auth/Login/Login'));
const Register = lazy(() => import('./Pages/Auth/Register/Register'));
const ProfileSpeedPhoneNotLogin = lazy(() => import('./Components/Header/Nav/ProfileSpeedPhoneNotLogin'));
const SearchPageForPhone = lazy(() => import('./Pages/SearchPageForPhone/SearchPageForPhone'));
const Blog = lazy(() => import('./Pages/Blog/Blog'));
const Blogs = lazy(() => import('./Pages/Blog/Blogs'));

function App() {
  useFacebookPixel("1611910119460872");
  return (
    <MyProvider>
      <MainApp />
    </MyProvider>
  );
}

function MainApp() {
  const { user_id, windowWidth, openAlert, setOpenAlert, Loader, alertType, alertMessage } = useContext(MyContext);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.clear();
      window.location.reload();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const renderProfileComponent = () => {
    if (user_id !== null) {
      return windowWidth >= 768 ? <ProfileSpeed /> : <ProfileSpeedPhone />;
    } else {
      return windowWidth >= 768 ? null : <ProfileSpeedPhoneNotLogin />;
    }
  };
  return (
    <>
      <HelmetProvider>
        <Helmet>
          {/* Basic SEO */}
          <title>Watchizer - أفخم الساعات والإكسسوارات | تسوق الآن بأسعار مميزة</title>
          <meta name="description"
            content="اكتشف أفخم الساعات والإكسسوارات في Watchizer. تسوق الآن أرقى الساعات الفاخرة بتصاميم أنيقة وجودة عالمية بأسعار تنافسية." />
          <meta name="keywords"
            content="luxury watches, men's watches, women's watches, branded watches, best watch store Egypt, online watch shop, stylish watches, Rolex, Omega, TAG Heuer, Swiss watches, ساعات فاخرة, ساعات رجالي, ساعات نسائية, متجر ساعات في مصر, ساعات كوارتز, ساعات ذكية, شراء ساعات أونلاين" />
          <meta name="author" content="Watchizer - خبراء الساعات الفاخرة" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <link rel="canonical" href="https://www.watchizereg.com/" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Watchizer - أفخم الساعات والإكسسوارات الفاخرة" />
          <meta property="og:description"
            content="اكتشف مجموعة رائعة من الساعات الفاخرة والإكسسوارات العصرية في Watchizer. جودة استثنائية، تصاميم راقية، وعروض لا تُقاوم." />
          <meta property="og:image" content="https://www.watchizereg.com/logo.svg" />
          <meta property="og:image:alt" content="مجموعة من الساعات الفاخرة من Watchizer" />
          <meta property="og:url" content="https://www.watchizereg.com/" />
          <meta property="og:site_name" content="Watchizer" />
          <meta property="og:locale" content="ar_EG" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Watchizer - أفخم الساعات والإكسسوارات الفاخرة" />
          <meta name="twitter:description"
            content="تسوق أحدث موديلات الساعات الفاخرة والإكسسوارات الراقية بأفضل الأسعار فقط على Watchizer." />
          <meta name="twitter:image" content="https://www.watchizereg.com/logo.svg" />
          <meta name="twitter:site" content="@Watchizer" />
          <meta name="twitter:creator" content="@Watchizer" />
          <meta name="google-site-verification" content="ySFGJkGj9eU9lzj8qAvuoqI9xt4Wcaswa_Q0Ke4Uoqg" />

          {/* Language and Region */}
          <meta name="language" content="ar-eg, en-eg" />
          <meta name="geo.region" content="EG" />
          <meta name="geo.placename" content="Cairo, Egypt" />

          {/* Theme & Appearance */}
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo.svg" />

          {/* Preload Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
          <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Lato:wght@100;300;400;700;900&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Lato:wght@100;300;400;700;900&display=swap" media="print" onload="this.media='all'" />

          {/* Web Manifest for PWA */}
          <link rel="manifest" href="/manifest.json" />

          {/* Structured Data (Schema.org) */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Store",
              "name": "Watchizer - Luxury Watches & Accessories",
              "url": "https://www.watchizereg.com/",
              "logo": "https://www.watchizereg.com/logo.svg",
              "image": "https://www.watchizereg.com/logo.svg",
              "description": "Discover a premium collection of luxury watches and fashion accessories at Watchizer. Shop exclusive timepieces with elegant designs and unbeatable prices in Egypt.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "اركديا مول . كورنيش النيل . امتداد ماسبيرو",
                "addressLocality": "Cairo",
                "addressRegion": "Cairo Governorate",
                "addressCountry": "EG"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 30.0444,
                "longitude": 31.2357
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "10:00",
                  "closes": "22:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/watchizer",
                "https://www.instagram.com/watchizer"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+201551096234",
                "contactType": "customer service",
                "areaServed": "EG",
                "availableLanguage": ["English", "Arabic"]
              }
            })}
          </script>
        </Helmet>
      </HelmetProvider>
      <div className="header"><Header /></div>
      <div className="phone-nav"><PhoneNavBar /></div>
      {renderProfileComponent()}
      {/* {windowWidth >= 768 ? null : <Suspense fallback={<Loader />}><PhoneLogo /></Suspense>} */}
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: windowWidth >= 768 ? "bottom" : "top", horizontal: windowWidth >= 768 ? "right" : "left" }}
      >
        <Alert severity={alertType} onClose={() => setOpenAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <ScrollToTop />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/products/:id" element={<Suspense fallback={<Loader />}><Listing /></Suspense>} />
        <Route
          path="/product/:name"
          element={<Suspense fallback={<Loader />}><ProductDisplay /></Suspense>}
        />
        <Route
          path="/offer/:id"
          element={<Suspense fallback={<Loader />}><OfferDisplay /></Suspense>}
        />
        <Route path="/cart" element={windowWidth >= 768 ? <Cart /> : <PhoneCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/category/:name" element={<Suspense fallback={<Loader />}><Listing /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<Loader />}><Register /></Suspense>} />
        <Route path="/brand/:name" element={<Suspense fallback={<Loader />}><Listing /></Suspense>} />
        <Route path="/subtypes/:name" element={<Suspense fallback={<Loader />}><Listing /></Suspense>} />
        <Route path="/grade/:name" element={<Suspense fallback={<Loader />}><ListingGrades /></Suspense>} />
        <Route path="/offers" element={<Suspense fallback={<Loader />}><Listingoffers /></Suspense>} />
        <Route path="/listingsearch" element={<Suspense fallback={<Loader />}><ListingSearch /></Suspense>} />
        <Route path="/edit-profile" element={<Suspense fallback={<Loader />}><EditProfile /></Suspense>} />
        <Route path="/Search" element={<Suspense fallback={<Loader />}><SearchPageForPhone /></Suspense>} />
        <Route path="/wish-list" element={windowWidth >= 768 ? <Suspense fallback={<Loader />}><WishList /></Suspense> : <Suspense fallback={<Loader />}><PhoneWishList /></Suspense>} />
        <Route path="/order-list" element={<Suspense fallback={<Loader />}><OrderList /></Suspense>} />
        <Route path="/blogs" element={<Suspense fallback={<Loader />}><Blogs /></Suspense>} />
        <Route path="/blog/:name" element={<Suspense fallback={<Loader />}><Blog /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<Loader />}><NotFound /></Suspense>} />
      </Routes>
      {windowWidth >= 768 ? <Suspense fallback={<Loader />}><Footer /></Suspense> : null}
    </>
  );
}

export default App;
