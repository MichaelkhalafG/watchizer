import React, { createContext, startTransition, useCallback, Suspense, useEffect, useState, useMemo, lazy } from 'react';
import axios from 'axios';
import './App.css';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Cart from './Pages/Cart/Cart';
import PhoneCart from './Pages/Cart/PhoneCart';
import Checkout from './Pages/Checkout/Checkout';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import PhoneNavBar from './Components/Header/PhoneNavBar/PhoneNavBar';
import { BiLoaderCircle } from "react-icons/bi";
import { HelmetProvider, Helmet } from "react-helmet-async";
// import CryptoJS from 'crypto-js';
import { Alert, Snackbar } from '@mui/material';
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
// const PhoneLogo = lazy(() => import('./Components/Header/Nav/PhoneLogo'));
const Login = lazy(() => import('./Pages/Auth/Login/Login'));
const Register = lazy(() => import('./Pages/Auth/Register/Register'));
const ProfileSpeedPhoneNotLogin = lazy(() => import('./Components/Header/Nav/ProfileSpeedPhoneNotLogin'));
const SearchPageForPhone = lazy(() => import('./Pages/SearchPageForPhone/SearchPageForPhone'));
const Blog = lazy(() => import('./Pages/Blog/Blog'));
const Blogs = lazy(() => import('./Pages/Blog/Blogs'));


const MyContext = createContext();

function App() {
  const [language, setLanguage] = useState('en');
  const [windowWidth, setwindowWidth] = useState()
  const [productsEn, setProductsEn] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsAr, setProductsAr] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [tables, setTables] = useState({});
  const [sideBanners, setSideBanners] = useState([]);
  const [bottomBanners, setBottomBanners] = useState([]);
  const [homeBanners, setHomeBanners] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [WishListCount, setWishListCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [wishList, setwishList] = useState([]);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
  const [user_id, setuser_id] = useState(null);
  const [users, setusers] = useState([]);
  const [total_cart_price, settotal_cart_price] = useState();
  const [shippingid, setShippingid] = useState("");
  const [shipping, setShipping] = useState("");
  const [shippingData, setShippingData] = useState([]);
  const [shippingname, setShippingName] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [openAlert, setOpenAlert] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    subTypes: [],
    price: [0, 6000],
  });
  const [gradesfilters, setgradesfilters] = useState({
    categories: [],
    brands: [],
    subTypes: [],
    grades: [],
    price: [0, 6000],
  });
  const [offersfilters, setOffersFilters] = useState({
    categories: [],
    price: [0, 6000],
    ratings: [],
  });
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setOpenAlert(true);
  };
  const Loader = useCallback(() => (
    <div className='loader-container'>
      <BiLoaderCircle className="spinner" size={50} color="#007bff" />
      <div className='loader-text'>جارِ التحميل...</div>
    </div>
  ), []);
  // const secretKey = 'miky';


  // function setEncryptedItem(key, value) {
  //   try {
  //     if (!key || typeof key !== 'string') {
  //       throw new Error('Invalid key. Key must be a non-empty string.');
  //     }
  //     if (typeof value !== 'string') {
  //       throw new Error('Invalid value. Value must be a string.');
  //     }
  //     const encrypted = CryptoJS.AES.encrypt(value, secretKey).toString();
  //     sessionStorage.setItem(key, encrypted);
  //   } catch (error) {
  // console.error(`Error setting encrypted item for key "${key}":`, error.message);
  //   }
  // }
  // function getDecryptedItem(key) {
  //   try {
  //     if (!key || typeof key !== 'string') {
  //       throw new Error('Invalid key. Key must be a non-empty string.');
  //     }
  //     const encrypted = sessionStorage.getItem(key);
  //     if (!encrypted) {
  //       return null;
  //     }
  //     const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  //     const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  //     if (!decrypted) {
  //       throw new Error('Decryption failed. Check if the secret key matches.');
  //     }
  //     return decrypted;
  //   } catch (error) {
  // console.error(`Error getting decrypted item for key "${key}":`, error.message);
  //     return null;
  //   }
  // }

  useEffect(() => {
    const fetchShippingCities = async () => {
      try {
        const cachedData = localStorage.getItem("shippingCities");
        if (cachedData) {
          // console.log("Using cached shipping cities");
          setShippingData(JSON.parse(cachedData));
          return;
        }
        const response = await axios.get("https://dash.watchizereg.com/api/show_shipping_city", {
          headers: {
            "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"
          }
        });

        setShippingData(response.data);
        localStorage.setItem("shippingCities", JSON.stringify(response.data));

      } catch (error) {
        // console.error("Error fetching shipping cities:", error);
      }
    };

    fetchShippingCities();
  }, []);

  useEffect(() => {
    setuser_id(sessionStorage.getItem('user_id') ? parseInt(sessionStorage.getItem('user_id')) : null);
  }, []);

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await axios.get("https://dash.watchizereg.com/api/all_user", {
          headers: {
            "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"
          }
        });
        setusers(response.data);
      } catch (error) {
        // console.error("Error fetching users data", error);
      }
    };
    fetchusers();
  }, [])

  const shippingPrices = useMemo(() => {
    return shippingData.map(city => ({
      id: city.id.toString(),
      GovernorateEn: city.translations.find(t => t.locale === "en")?.city_name || city.city_name,
      GovernorateAr: city.translations.find(t => t.locale === "ar")?.city_name || city.city_name,
      Price: parseFloat(city.shipping_cost)
    }));
  }, [shippingData]);

  useEffect(() => {
    if (shippingPrices.length > 0) {
      const defaultShipping = shippingPrices[0];
      setShippingid(defaultShipping.id);
      setShipping(defaultShipping.Price.toString());
      setShippingName(language === 'ar' ? defaultShipping.GovernorateAr : defaultShipping.GovernorateEn);
    } else {
      setShippingid("");
      setShipping("");
    }
  }, [shippingPrices, language]);

  useEffect(() => {
    const getTranslatedName = (translations, locale, fallback) => {
      const translation = translations?.find((t) => t.locale === locale);
      return translation && translation[fallback] ? translation[fallback] : null;
    };

    const getProductRating = (product, ratings) => {
      const productRatings = ratings.filter((r) => r.product_id === product.id);
      return productRatings.length > 0
        ? productRatings.reduce((acc, r) => acc + r.rating, 0) / productRatings.length
        : null;
    };

    const getColors = (product, name) => {
      return product[name]?.map((color) => ({
        color_id: color.id,
        color_value: color.color_value,
        color_name_ar: color.translations.find((c) => c.locale === "ar")?.color_name,
        color_name_en: color.translations.find((c) => c.locale === "en")?.color_name,
      })) || [];
    };

    const transformProductData = (rawProducts, tableData, ratings, images, locale) => {
      if (!rawProducts || !Array.isArray(rawProducts)) {
        // console.error("Error: rawProducts is not valid", rawProducts);
        return [];
      } else {
        return rawProducts.map((product) => ({
          ...product,
          category_type: getTranslatedName(
            tableData.categoryTypes.find((t) => t.id === product.category_type_id)?.translations || [],
            locale,
            'category_type_name'
          ),
          brand: getTranslatedName(
            tableData.brands.find((b) => b.id === product.brand_id)?.translations || [],
            locale,
            'brand_name'
          ),
          grade: getTranslatedName(
            tableData.grades.find((g) => g.id === product.grade_id)?.translations || [],
            locale,
            'grade_name'
          ),
          sub_type: getTranslatedName(
            tableData.subTypes.find((s) => s.id === product.sub_type_id)?.translations || [],
            locale,
            'sub_type_name'
          ),
          dial_colors: getColors(product, 'dial_color'),
          band_colors: getColors(product, 'band_color'),
          band_closure: getTranslatedName(
            tableData.closureTypes.find((ct) => ct.id === product.band_closure_id)?.translations || [],
            locale,
            'closure_type_name'
          ),
          case_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.case_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          dial_display_type: getTranslatedName(
            tableData.displayTypes.find((dt) => dt.id === product.dial_display_type_id)?.translations || [],
            locale,
            'display_type_name'
          ),
          case_shape: getTranslatedName(
            tableData.shapes.find((s) => s.id === product.case_shape_id)?.translations || [],
            locale,
            'shape_name'
          ),
          watch_movement: getTranslatedName(
            tableData.movementTypes.find((mt) => mt.id === product.watch_movement_id)?.translations || [],
            locale,
            'movement_type_name'
          ),
          dial_glass_material: getTranslatedName(
            tableData.materials.find((m) => m.id === product.dial_glass_material_id)?.translations || [],
            locale,
            'material_name'
          ),
          dial_case_material: getTranslatedName(
            tableData.materials.find((m) => m.id === product.dial_case_material_id)?.translations || [],
            locale,
            'material_name'
          ),
          band_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.band_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          band_length: product.band_length,
          water_resistance_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.water_resistance_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          band_width_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.band_width_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          case_thickness_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.case_thickness_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          watch_height_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.watch_height_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          watch_width_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.watch_width_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          band_material: getTranslatedName(
            tableData.materials.find((m) => m.id === product.band_material_id)?.translations || [],
            locale,
            'material_name'
          ),
          watch_length_size_type: getTranslatedName(
            tableData.sizeTypes.find((st) => st.id === product.watch_length_size_type_id)?.translations || [],
            locale,
            'size_type_name'
          ),
          created_at: product.created_at ? new Date(product.created_at) : new Date(0),
          updated_at: product.updated_at ? new Date(product.updated_at) : new Date(0),
          rating: getProductRating(product, ratings),
          images: images.filter((img) => img.product_id === product.id).map((img) => `https://dash.watchizereg.com/Uploads_Images/Product_image/${img.image}`),
          features: product.feature.map((f) =>
            getTranslatedName(f.translations || [], locale, 'feature_name')
          ),
          gender: product.gender.map((g) =>
            getTranslatedName(g.translations || [], locale, 'gender_name')
          ),
          image: `https://dash.watchizereg.com/Uploads_Images/Product/${product.image}`,
          product_title: getTranslatedName(product.translations || [], locale, 'product_title'),
          name: getTranslatedName(product.translations || [], "en", 'product_title'),
          model_name: getTranslatedName(product.translations || [], locale, 'model_name'),
          country: getTranslatedName(product.translations || [], locale, 'country'),
          stone: getTranslatedName(product.translations || [], locale, 'stone'),
          stock: product.stock ?? 0,
          market_stock: product.market_stock ?? 0,
          search_keywords: product.search_keywords,
          warranty_years: parseInt(product.warranty_years),
          interchangeable_dial: product.interchangeable_dial,
          interchangeable_strap: product.interchangeable_strap,
          purchase_price: product.purchase_price,
          percentage_discount: product.percentage_discount,
          sale_price_after_discount: product.sale_price_after_discount,
          selling_price: product.selling_price,
          watch_box: product.watch_box,
          active: product.active,
          watch_length: product.watch_length,
          watch_width: product.watch_width,
          watch_height: product.watch_height,
          case_thickness: product.case_thickness,
          band_width: product.band_width,
          water_resistance: product.water_resistance,
          long_description: getTranslatedName(product.translations || [], locale, 'long_description'),
          short_description: getTranslatedName(product.translations || [], locale, 'short_description'),
        })).sort((a, b) => {
          const dateComparison = new Date(b.created_at) - new Date(a.created_at);
          if (a.market_stock === 0 && b.market_stock !== 0) return 1;
          if (b.market_stock === 0 && a.market_stock !== 0) return -1;
          return dateComparison;
        });
      }
    };

    const fetchTablesAndProducts = async () => {
      try {
        const CACHE_DURATION = 60 * 60 * 1000;

        const CACHE_KEYS = {
          TABLES: "tablesCache",
          TABLES_EXPIRATION: "tablesCacheExpiration",
          PRODUCTS: "productsCache",
          PRODUCTS_EXPIRATION: "productsCacheExpiration",
          RATINGS: "ratingsCache",
          RATINGS_EXPIRATION: "ratingsCacheExpiration",
          IMAGES: "imagesCache",
          IMAGES_EXPIRATION: "imagesCacheExpiration",
        };

        const isCacheValid = (expirationKey) => {
          const expiration = localStorage.getItem(expirationKey);
          return expiration && new Date().getTime() < Number(expiration);
        };

        const getCachedData = (key) => {
          const data = localStorage.getItem(key);
          return data ? JSON.parse(data) : null;
        };

        if (
          Object.values(CACHE_KEYS).every((key) => key.includes("EXPIRATION") ? isCacheValid(key) : getCachedData(key))
        ) {
          // console.log("Using cached data");

          const cachedTables = getCachedData(CACHE_KEYS.TABLES);
          const cachedProducts = getCachedData(CACHE_KEYS.PRODUCTS);
          const cachedRatings = getCachedData(CACHE_KEYS.RATINGS);
          const cachedImages = getCachedData(CACHE_KEYS.IMAGES);

          setTables(cachedTables);
          setRatings(cachedRatings);
          setProductsEn(transformProductData(cachedProducts, cachedTables, cachedRatings, cachedImages, "en"));
          setProductsAr(transformProductData(cachedProducts, cachedTables, cachedRatings, cachedImages, "ar"));
          return;
        }

        const headers = {
          headers: {
            "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0",
          },
        };
        const tableEndpoints = [
          "all_category_type",
          "all_brand",
          "all_grade",
          "all_sub_type",
          "all_color",
          "all_material",
          "all_shape",
          "all_size_type",
          "all_display_type",
          "all_closure_type",
          "all_movement_type",
        ].map((endpoint) => `https://dash.watchizereg.com/api/${endpoint}`);

        const tableResponses = await Promise.all(tableEndpoints.map((url) => axios.get(url, headers)));

        const tableData = {
          categoryTypes: tableResponses[0].data,
          brands: tableResponses[1].data,
          grades: tableResponses[2].data,
          subTypes: tableResponses[3].data,
          colors: tableResponses[4].data,
          materials: tableResponses[5].data,
          shapes: tableResponses[6].data,
          sizeTypes: tableResponses[7].data,
          displayTypes: tableResponses[8].data,
          closureTypes: tableResponses[9].data,
          movementTypes: tableResponses[10].data,
        };

        setTables(tableData);
        localStorage.setItem(CACHE_KEYS.TABLES, JSON.stringify(tableData));
        localStorage.setItem(CACHE_KEYS.TABLES_EXPIRATION, new Date().getTime() + CACHE_DURATION);

        const [productResponse, ratingResponse, imageResponse] = await Promise.all([
          axios.get("https://dash.watchizereg.com/api/all_product", headers),
          axios.get("https://dash.watchizereg.com/api/all_product_rating", headers),
          axios.get("https://dash.watchizereg.com/api/all_product_image", headers),
        ]);

        const rawProducts = productResponse.data;
        const ratingsData = ratingResponse.data;
        const imagesData = imageResponse.data;

        setRatings(ratingsData);
        setProductsEn(transformProductData(rawProducts, tableData, ratingsData, imagesData, "en"));
        setProductsAr(transformProductData(rawProducts, tableData, ratingsData, imagesData, "ar"));

        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(rawProducts));
        localStorage.setItem(CACHE_KEYS.PRODUCTS_EXPIRATION, new Date().getTime() + CACHE_DURATION);

        localStorage.setItem(CACHE_KEYS.RATINGS, JSON.stringify(ratingsData));
        localStorage.setItem(CACHE_KEYS.RATINGS_EXPIRATION, new Date().getTime() + CACHE_DURATION);

        localStorage.setItem(CACHE_KEYS.IMAGES, JSON.stringify(imagesData));
        localStorage.setItem(CACHE_KEYS.IMAGES_EXPIRATION, new Date().getTime() + CACHE_DURATION);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };



    fetchTablesAndProducts();
  }, []);


  // useEffect(() => {
  //   const fetchTablesAndProducts = async () => {
  //     try {
  //       const endpoints = [
  //         'https://dash.watchizereg.com/api/all_category_type',
  //         'https://dash.watchizereg.com/api/all_brand',
  //         'https://dash.watchizereg.com/api/all_grade',
  //         'https://dash.watchizereg.com/api/all_sub_type',
  //         'https://dash.watchizereg.com/api/all_color',
  //         'https://dash.watchizereg.com/api/all_material',
  //         'https://dash.watchizereg.com/api/all_shape',
  //         'https://dash.watchizereg.com/api/all_size_type',
  //         'https://dash.watchizereg.com/api/all_display_type',
  //         'https://dash.watchizereg.com/api/all_closure_type',
  //         'https://dash.watchizereg.com/api/all_movement_type',
  //       ];
  //       // Fetch the tables data
  //       const tableResponses = await Promise.all(
  //         endpoints.map((url) =>
  //           axios.get(url, {
  //             headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
  //           })
  //         )
  //       );

  //       const tableData = {
  //         categoryTypes: tableResponses[0].data,
  //         brands: tableResponses[1].data,
  //         grades: tableResponses[2].data,
  //         subTypes: tableResponses[3].data,
  //         colors: tableResponses[4].data,
  //         materials: tableResponses[5].data,
  //         shapes: tableResponses[6].data,
  //         sizeTypes: tableResponses[7].data,
  //         displayTypes: tableResponses[8].data,
  //         closureTypes: tableResponses[9].data,
  //         movementTypes: tableResponses[10].data,
  //       };

  //       setTables(tableData);

  //       // Fetch products, ratings, and images
  //       const [productResponse, ratingResponse, imageResponse] = await Promise.all([
  //         axios.get('https://dash.watchizereg.com/api/all_product', {
  //           headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
  //         }),
  //         axios.get('https://dash.watchizereg.com/api/all_product_rating', {
  //           headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
  //         }),
  //         axios.get('https://dash.watchizereg.com/api/all_product_image', {
  //           headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
  //         }),
  //       ]);

  //       const rawProducts = productResponse.data;
  //       const ratings = ratingResponse.data;
  //       setRatings(ratings);
  //       const images = imageResponse.data;

  //       // Helper functions
  //       const getTranslatedName = (translations, locale, fallback) => {
  //         return translations.find((t) => t.locale === locale)?.[fallback] || 'Unknown';
  //       };

  //       const getProductRating = (product, ratings) => {
  //         const productRatings = ratings.filter((r) => r.product_id === product.id);
  //         if (productRatings.length > 0) {
  //           const totalRating = productRatings.reduce((acc, r) => acc + r.rating, 0);
  //           return totalRating / productRatings.length;
  //         }
  //         return null;
  //       };

  //       const getcolors = (product, name) => {
  //         const colors = product[name]?.map((color) => {
  //           const item = {
  //             color_id: color.id,
  //             color_value: color.color_value,
  //             color_name_ar: color.translations.find(c => c.locale === 'ar')?.color_name,
  //             color_name_en: color.translations.find(c => c.locale === 'en')?.color_name,
  //           };
  //           return item;
  //         });
  //         return colors || [];
  //       };

  //       const transformProductData = (locale) =>
  //         rawProducts.map((product) => ({
  //           ...product,
  //           category_type: getTranslatedName(
  //             tableData.categoryTypes.find((t) => t.id === product.category_type_id)?.translations || [],
  //             locale,
  //             'category_type_name'
  //           ),
  //           brand: getTranslatedName(
  //             tableData.brands.find((b) => b.id === product.brand_id)?.translations || [],
  //             locale,
  //             'brand_name'
  //           ),
  //           grade: getTranslatedName(
  //             tableData.grades.find((g) => g.id === product.grade_id)?.translations || [],
  //             locale,
  //             'grade_name'
  //           ),
  //           sub_type: getTranslatedName(
  //             tableData.subTypes.find((s) => s.id === product.sub_type_id)?.translations || [],
  //             locale,
  //             'sub_type_name'
  //           ),
  //           dial_colors: getcolors(product, 'dial_color'),
  //           band_colors: getcolors(product, 'band_color'),
  //           band_closure: getTranslatedName(
  //             tableData.closureTypes.find((ct) => ct.id === product.band_closure_id)?.translations || [],
  //             locale,
  //             'closure_type_name'
  //           ),
  //           case_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.case_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           dial_display_type: getTranslatedName(
  //             tableData.displayTypes.find((dt) => dt.id === product.dial_display_type_id)?.translations || [],
  //             locale,
  //             'display_type_name'
  //           ),
  //           case_shape: getTranslatedName(
  //             tableData.shapes.find((s) => s.id === product.case_shape_id)?.translations || [],
  //             locale,
  //             'shape_name'
  //           ),
  //           watch_movement: getTranslatedName(
  //             tableData.movementTypes.find((mt) => mt.id === product.watch_movement_id)?.translations || [],
  //             locale,
  //             'movement_type_name'
  //           ),
  //           dial_glass_material: getTranslatedName(
  //             tableData.materials.find((m) => m.id === product.dial_glass_material_id)?.translations || [],
  //             locale,
  //             'material_name'
  //           ),
  //           dial_case_material: getTranslatedName(
  //             tableData.materials.find((m) => m.id === product.dial_case_material_id)?.translations || [],
  //             locale,
  //             'material_name'
  //           ),
  //           band_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.band_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           band_length: product.band_length,
  //           water_resistance_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.water_resistance_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           band_width_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.band_width_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           case_thickness_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.case_thickness_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           watch_height_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.watch_height_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           watch_width_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.watch_width_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           band_material: getTranslatedName(
  //             tableData.materials.find((m) => m.id === product.band_material_id)?.translations || [],
  //             locale,
  //             'material_name'
  //           ),
  //           watch_length_size_type: getTranslatedName(
  //             tableData.sizeTypes.find((st) => st.id === product.watch_length_size_type_id)?.translations || [],
  //             locale,
  //             'size_type_name'
  //           ),
  //           rating: getProductRating(product, ratings),
  //           images: images.filter((img) => img.product_id === product.id).map((img) => `https://dash.watchizereg.com/Uploads_Images/Product_image/${img.image}`),
  //           features: product.feature.map((f) =>
  //             getTranslatedName(f.translations || [], locale, 'feature_name')
  //           ),
  //           gender: product.gender.map((g) =>
  //             getTranslatedName(g.translations || [], locale, 'gender_name')
  //           ),
  //           image: `https://dash.watchizereg.com/Uploads_Images/Product/${product.image}`,
  //           product_title: getTranslatedName(product.translations || [], locale, 'product_title'),
  //           model_name: getTranslatedName(product.translations || [], locale, 'model_name'),
  //           country: getTranslatedName(product.translations || [], locale, 'country'),
  //           stone: getTranslatedName(product.translations || [], locale, 'stone'),
  //           stock: product.stock,
  //           warranty_years: product.warranty_years,
  //           interchangeable_dial: product.interchangeable_dial,
  //           interchangeable_strap: product.interchangeable_strap,
  //           purchase_price: product.purchase_price,
  //           percentage_discount: product.percentage_discount,
  //           sale_price_after_discount: product.sale_price_after_discount,
  //           selling_price: product.selling_price,
  //           watch_box: product.watch_box,
  //           active: product.active,
  //           watch_length: product.watch_length,
  //           watch_width: product.watch_width,
  //           watch_height: product.watch_height,
  //           case_thickness: product.case_thickness,
  //           band_width: product.band_width,
  //           water_resistance: product.water_resistance,
  //           long_description: getTranslatedName(product.translations || [], locale, 'long_description'),
  //           short_description: getTranslatedName(product.translations || [], locale, 'short_description'),
  //         }));

  //       setProductsEn(transformProductData('en'));
  //       setProductsAr(transformProductData('ar'));
  //     } catch (error) {
  // console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchTablesAndProducts();
  // }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0";
        const cacheKey = "bannersCache";
        const cacheExpirationKey = "bannersCacheExpiration";
        const cacheDuration = 60 * 60 * 1000;

        const cachedData = localStorage.getItem(cacheKey);
        const cacheExpiration = localStorage.getItem(cacheExpirationKey);

        if (cachedData && cacheExpiration && new Date().getTime() < Number(cacheExpiration)) {
          const parsedData = JSON.parse(cachedData);
          setSideBanners(parsedData.sideBanners);
          setBottomBanners(parsedData.bottomBanners);
          setHomeBanners(parsedData.homeBanners);
          // console.log("Using cached banners");
          return;
        }

        const endpoints = [
          "https://dash.watchizereg.com/api/all_banner_side",
          "https://dash.watchizereg.com/api/all_banner_bottom",
          "https://dash.watchizereg.com/api/all_banner_home",
        ];

        const [sideResponse, bottomResponse, homeResponse] = await Promise.all(
          endpoints.map((url) =>
            axios.get(url, { headers: { "Api-Code": apiCode } })
          )
        );

        const bannersData = {
          sideBanners: sideResponse.data || [],
          bottomBanners: bottomResponse.data || [],
          homeBanners: homeResponse.data || [],
        };

        localStorage.setItem(cacheKey, JSON.stringify(bannersData));
        localStorage.setItem(cacheExpirationKey, new Date().getTime() + cacheDuration);

        setSideBanners(bannersData.sideBanners);
        setBottomBanners(bannersData.bottomBanners);
        setHomeBanners(bannersData.homeBanners);
      } catch (error) {
        // console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const CACHE_DURATION = 10 * 60 * 1000;
        const OFFERS_CACHE_KEY = "offersCache";
        const OFFERS_CACHE_EXPIRATION = "offersCacheExpiration";

        const isCacheValid = (expirationKey) => {
          const expiration = localStorage.getItem(expirationKey);
          return expiration && new Date().getTime() < Number(expiration);
        };

        if (isCacheValid(OFFERS_CACHE_EXPIRATION)) {
          // console.log("Using cached offers");
          const cachedOffers = JSON.parse(localStorage.getItem(OFFERS_CACHE_KEY));
          setOffers(cachedOffers);
          return;
        }

        const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0";
        const response = await axios.get("https://dash.watchizereg.com/api/all_offer", {
          headers: { "Api-Code": apiCode },
        });

        const offerData = (response.data || []).map((offer) => {
          const offerNameen = offer.translations.find((translation) => translation.locale === "en")?.offer_name || "Unnamed Offer";
          const offerNamear = offer.translations.find((translation) => translation.locale === "ar")?.offer_name || "Unnamed Offer";
          const short_descriptionen = offer.translations.find((translation) => translation.locale === "en")?.short_description || "No Description";
          const short_descriptionar = offer.translations.find((translation) => translation.locale === "ar")?.short_description || "No Description";
          const long_descriptionen = offer.translations.find((translation) => translation.locale === "en")?.long_description || "No Description";
          const long_descriptionar = offer.translations.find((translation) => translation.locale === "ar")?.long_description || "No Description";

          return {
            id: offer.id,
            main_product_id: offer.main_product_id,
            category_type_id: offer.category_type_id,
            gift_product_ids: offer.gift_product_ids.map((id) => parseInt(id)),
            selling_price: parseFloat(offer.selling_price),
            sale_price_after_discount: parseFloat(offer.sale_price_after_discount),
            stock: offer.stock,
            image: `https://dash.watchizereg.com/Uploads_Images/Offer/${offer.image}`,
            average_rate: offer.average_rate ? parseFloat(offer.average_rate) : null,
            created_at: offer.created_at,
            updated_at: offer.updated_at,
            short_description_en: short_descriptionen,
            short_description_ar: short_descriptionar,
            long_description_en: long_descriptionen,
            in_season: offer.in_season,
            long_description_ar: long_descriptionar,
            offer_name_en: offerNameen,
            offer_name_ar: offerNamear,
            offer_rating: offer.offer_rating.map((rating) => ({
              id: rating.id,
              user_id: rating.user_id,
              offer_id: rating.offer_id,
              rating: parseInt(rating.rating),
              comment: rating.comment,
              created_at: rating.created_at,
              updated_at: rating.updated_at,
            })),
          };
        });

        setOffers(offerData);
        localStorage.setItem(OFFERS_CACHE_KEY, JSON.stringify(offerData));
        localStorage.setItem(OFFERS_CACHE_EXPIRATION, new Date().getTime() + CACHE_DURATION);

      } catch (error) {
        // console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);



  const products = useMemo(() => {
    return language === 'en' ? productsEn : productsAr;
  }, [language, productsEn, productsAr]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get("https://dash.watchizereg.com/api/show_cart", {
        headers: { "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0" }
      });

      const cartData = response.data.find(cart => cart.user_id === user_id);
      if (cartData) {
        const formattedCartItems = cartData.cart_item.map(item => {
          const product = products.find(p => p.id === item.product_id);
          const offer = offers.find(o => o.id === item.offer_id);

          return {
            id: item.id,
            product_id: item.product_id,
            product_image: product?.image || null,
            product_title: product?.product_title || "Unknown Product",
            product_rating: product?.average_rate || 0,
            offer_id: item.offer_id,
            type_stock: item.type_stock,
            offer_image: offer?.image || null,
            offer_title: language === 'ar' ? offer?.offer_name_ar : offer?.offer_name_en || "Unknown Offer",
            offer_rating: offer?.average_rate || 0,
            quantity: item.quantity,
            piece_price: parseFloat(item.piece_price),
            total_price: parseFloat(item.total_price),
            color_band: item.color_band ? item.color_band.toString() : null,
            color_dial: item.color_dial ? item.color_dial.toString() : null,
          };
        });

        setCart(formattedCartItems);
      }
    } catch (error) {
      // console.error("Error fetching cart data:", error);
    }
  }, [user_id, offers, products, language]);
  const fetchWishList = useCallback(async () => {
    try {
      const response = await axios.get("https://dash.watchizereg.com/api/all_wishlist", {
        headers: { "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0" }
      });

      const wishlistData = response.data.find(WishList => WishList.user_id === user_id);
      if (wishlistData) {
        const formattedWishListItems = wishlistData.wishlist_item.map(item => {
          const product = products.find(p => p.id === item.product_id);
          const offer = offers.find(o => o.id === item.offer_id);

          return {
            id: item.id,
            product_id: item.product_id,
            product_image: product?.image || null,
            product_title: product?.product_title || "Unknown Product",
            product_rating: product?.average_rate || 0,
            offer_id: item.offer_id,
            offer_image: offer?.image || null,
            offer_title: language === 'ar' ? offer?.offer_name_ar : offer?.offer_name_en || "Unknown Offer",
            offer_rating: offer?.average_rate || 0,
            product_price: product?.sale_price_after_discount,
            offer_price: offer?.price,
          };
        });

        setwishList(formattedWishListItems);
      }
    } catch (error) {
      // console.error("Error fetching cart data:", error);
    }
  }, [user_id, offers, products, language]);

  useEffect(() => {
    fetchCart();
    fetchWishList()
  }, [user_id, offers, products, fetchCart, fetchWishList]);

  const handleAddTowishlist = useCallback((id, type) => {
    if (!user_id) {
      showAlert(language === "ar" ? "يجب تسجيل الدخول أولاً!" : "You must login first!", "warning");
      navigate("/login")
    } else {
      const payload = {
        user_id: user_id,
        ...(type === "p" ? { product_id: id } : { offer_id: id })
      };

      axios.post("https://dash.watchizereg.com/api/add_wishlist", payload, {
        headers: {
          "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"
        }
      })
        .then(() => {
          showAlert(language === "ar" ? "تمت الإضافة إلى المفضل!" : "Added to the Wish List!", "success");
          fetchWishList()
        })
        .catch((error) => {
          // console.error("Error adding to cart:", error);
          showAlert(language === "ar" ? "حدث خطأ أثناء الإضافة إلى المفضل." : "An error occurred while adding to the Wish List.", "error");
        });
    }
  }, [fetchWishList, language, navigate, user_id]);

  const handleQuantityChange = useCallback((index, value) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const item = updatedCart[index];

      if (!item) return updatedCart;

      const newQuantity = (item.quantity || 0) + value;

      if (newQuantity > 0) {
        item.quantity = newQuantity;
      }

      return updatedCart;
    });
  }, []);



  useEffect(() => {
    setProductsCount(cart.reduce((total, item) => total + (item.quantity || 0), 0));
    setWishListCount(wishList.reduce((total) => total + 1, 0));
    const calculateTotalCartPrice = () => {
      const subtotal = cart.reduce((total, item) => {
        const piecePrice = parseFloat(item.piece_price || 0);
        const quantity = parseInt(item.quantity || 1, 10);
        return total + piecePrice * quantity;
      }, 0);
      const shippingCost = parseFloat(shipping || 0);
      const totalPrice = subtotal + shippingCost;

      settotal_cart_price(totalPrice.toFixed(2));
    };
    calculateTotalCartPrice();
  }, [cart, wishList, shipping]);

  function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
  useEffect(() => {
    startTransition(() => {
      setwindowWidth(getWindowWidth());
    });

    const handleResize = () => {
      startTransition(() => {
        setwindowWidth(getWindowWidth());
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  setInterval(() => {
    localStorage.clear();
    window.location.reload();
  }, 10 * 60 * 1000);


  const values = useMemo(() => {
    return { language, setLanguage, Loader, shippingid, currentPage, setCurrentPage, filteredProducts, setFilteredProducts, setShippingid, users, WishListCount, setWishListCount, gradesfilters, windowWidth, handleAddTowishlist, fetchWishList, setgradesfilters, ratings, user_id, fetchCart, setuser_id, total_cart_price, settotal_cart_price, shippingPrices, products, tables, sideBanners, bottomBanners, homeBanners, productsCount, setProductsCount, cart, setCart, wishList, setwishList, handleQuantityChange, shippingname, setShippingName, shipping, setShipping, filters, setFilters, offers, offersfilters, setOffersFilters };
  }, [language, products, tables, Loader, users, shippingid, currentPage, setCurrentPage, setShippingid, filteredProducts, setFilteredProducts, gradesfilters, windowWidth, WishListCount, setWishListCount, handleAddTowishlist, setgradesfilters, fetchWishList, ratings, user_id, fetchCart, setuser_id, total_cart_price, settotal_cart_price, sideBanners, shippingPrices, bottomBanners, homeBanners, productsCount, setProductsCount, cart, setCart, handleQuantityChange, shippingname, wishList, setwishList, setShippingName, shipping, setShipping, filters, setFilters, offers, offersfilters, setOffersFilters]);

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
          <meta property="og:image" content="https://www.watchizereg.com/logo.png" />
          <meta property="og:image:alt" content="مجموعة من الساعات الفاخرة من Watchizer" />
          <meta property="og:url" content="https://www.watchizereg.com/" />
          <meta property="og:site_name" content="Watchizer" />
          <meta property="og:locale" content="ar_EG" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Watchizer - أفخم الساعات والإكسسوارات الفاخرة" />
          <meta name="twitter:description"
            content="تسوق أحدث موديلات الساعات الفاخرة والإكسسوارات الراقية بأفضل الأسعار فقط على Watchizer." />
          <meta name="twitter:image" content="https://www.watchizereg.com/logo.png" />
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
          <link rel="apple-touch-icon" href="/logo.png" />

          {/* Preload Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Lato:wght@100;300;400;700;900&display=swap"
            rel="stylesheet" />

          {/* Web Manifest for PWA */}
          <link rel="manifest" href="/manifest.json" />

          {/* Structured Data (Schema.org) */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Store",
              "name": "Watchizer - Luxury Watches & Accessories",
              "url": "https://www.watchizereg.com/",
              "logo": "https://www.watchizereg.com/logo.png",
              "image": "https://www.watchizereg.com/logo.png",
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
      <MyContext.Provider value={values}>
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
      </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };
