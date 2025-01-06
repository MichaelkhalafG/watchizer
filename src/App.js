import React, { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import NotFound from './Pages/Not Found/NotFound';
import Footer from './Components/Footer/Footer';
import ProductDisplay from './Components/Product/ProductDisplay';
import Listing from './Pages/Listing/Listing';
import Cart from './Pages/Cart/Cart';
import Checkout from './Pages/Checkout/Checkout';
import Listingoffers from './Pages/Listing/Listingoffers';

const MyContext = createContext();

function App() {
  const [language, setLanguage] = useState('en');
  const [productsEn, setProductsEn] = useState([]);
  const [productsAr, setProductsAr] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [shipping, setShipping] = useState();
  const [tables, setTables] = useState({});
  const [sideBanners, setSideBanners] = useState([]);
  const [bottomBanners, setBottomBanners] = useState([]);
  const [homeBanners, setHomeBanners] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [offers, setOffers] = useState([]);
  const [user_id, setuser_id] = useState(1);
  const [total_cart_price, settotal_cart_price] = useState();
  const [shippingData, setShippingData] = useState([]);
  const [shippingname, setShippingName] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    subTypes: [],
    price: [0, 6000],
  });
  const [offersfilters, setOffersFilters] = useState({
    categories: [],
    price: [0, 6000],
    ratings: [],
  });

  useEffect(() => {
    const fetchShippingCities = async () => {
      try {
        const response = await axios.get("https://dash.watchizereg.com/api/show_shipping_city", {
          headers: {
            "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0"
          }
        });
        setShippingData(response.data);
      } catch (error) {
        console.error("Error fetching shipping cities:", error);
      }
    };
    fetchShippingCities();
  }, []);

  const shippingPrices = useMemo(() => {
    return shippingData.map(city => ({
      GovernorateEn: city.translations.find(t => t.locale === "en")?.city_name || city.city_name,
      GovernorateAr: city.translations.find(t => t.locale === "ar")?.city_name || city.city_name,
      Price: parseFloat(city.shipping_cost)
    }));
  }, [shippingData]);

  useEffect(() => {
    if (shippingPrices.length > 0) {
      const defaultShipping = shippingPrices[0];
      setShippingName(language === 'ar' ? defaultShipping.GovernorateAr : defaultShipping.GovernorateEn);
      setShipping(defaultShipping.Price.toString());
    } else {
      setShipping('');
    }
  }, [shippingPrices, language]);


  useEffect(() => {
    const fetchTablesAndProducts = async () => {
      try {
        const endpoints = [
          'https://dash.watchizereg.com/api/all_category_type',
          'https://dash.watchizereg.com/api/all_brand',
          'https://dash.watchizereg.com/api/all_grade',
          'https://dash.watchizereg.com/api/all_sub_type',
          'https://dash.watchizereg.com/api/all_color',
          'https://dash.watchizereg.com/api/all_material',
          'https://dash.watchizereg.com/api/all_shape',
          'https://dash.watchizereg.com/api/all_size_type',
          'https://dash.watchizereg.com/api/all_display_type',
          'https://dash.watchizereg.com/api/all_closure_type',
          'https://dash.watchizereg.com/api/all_movement_type',
        ];

        const tableResponses = await Promise.all(
          endpoints.map((url) =>
            axios.get(url, {
              headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
            })
          )
        );

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

        const [productResponse, ratingResponse, imageResponse] = await Promise.all([
          axios.get('https://dash.watchizereg.com/api/all_product', {
            headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
          }),
          axios.get('https://dash.watchizereg.com/api/all_product_rating', {
            headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
          }),
          axios.get('https://dash.watchizereg.com/api/all_product_image', {
            headers: { 'Api-Code': 'NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0' },
          }),
        ]);

        const rawProducts = productResponse.data;
        const ratings = ratingResponse.data;
        setRatings(ratings);
        const images = imageResponse.data;

        const getTranslatedName = (translations, locale, fallback) => {
          return translations.find((t) => t.locale === locale)?.[fallback] || 'Unknown';
        };

        function getProductRating(product, ratings) {
          const productRatings = ratings.filter((r) => r.product_id === product.id);
          if (productRatings.length > 0) {
            const totalRating = productRatings.reduce((acc, r) => acc + r.rating, 0);
            return totalRating / productRatings.length;
          }
          return null;
        }

        const transformProductData = (locale) =>
          rawProducts.map((product) => ({
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
            dial_color: getTranslatedName(
              tableData.colors.find((c) => c.id === product.dial_color_id)?.translations || [],
              locale,
              'color_name'
            ),
            band_color: getTranslatedName(
              tableData.colors.find((c) => c.id === product.band_color_id)?.translations || [],
              locale,
              'color_name'
            ),
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
            model_name: getTranslatedName(product.translations || [], locale, 'model_name'),
            country: getTranslatedName(product.translations || [], locale, 'country'),
            stone: getTranslatedName(product.translations || [], locale, 'stone'),
            stock: parseInt(product.stock),
            warranty_years: product.warranty_years,
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
          }));

        setProductsEn(transformProductData('en'));
        setProductsAr(transformProductData('ar'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTablesAndProducts();
  }, []);
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0";

        const [sideResponse, bottomResponse, homeResponse] = await Promise.all([
          axios.get("https://dash.watchizereg.com/api/all_banner_side", {
            headers: { "Api-Code": apiCode },
          }),
          axios.get("https://dash.watchizereg.com/api/all_banner_bottom", {
            headers: { "Api-Code": apiCode },
          }),
          axios.get("https://dash.watchizereg.com/api/all_banner_home", {
            headers: { "Api-Code": apiCode },
          }),
        ]);

        setSideBanners(sideResponse.data || []);
        setBottomBanners(bottomResponse.data || []);
        setHomeBanners(homeResponse.data || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const apiCode = "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0";
        const response = await axios.get("https://dash.watchizereg.com/api/all_offer", {
          headers: { "Api-Code": apiCode },
        });

        const offerData = (response.data || []).map((offer) => ({
          id: offer.id,
          main_product_id: offer.main_product_id,
          category_type_id: offer.category_type_id,
          gift_product_ids: offer.gift_product_ids,
          price: parseFloat(offer.price),
          offer_name: "offer 1",
          image: `https://dash.watchizereg.com/Uploads_Images/Offer/${offer.image}`,
          average_rate: parseFloat(offer.average_rate),
          created_at: offer.created_at,
          updated_at: offer.updated_at,
          offer_rating: offer.offer_rating.map((rating) => ({
            id: rating.id,
            user_id: rating.user_id,
            offer_id: rating.offer_id,
            rating: parseInt(rating.rating),
            comment: rating.comment,
            created_at: rating.created_at,
            updated_at: rating.updated_at,
          })),
        }));

        setOffers(offerData);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);


  const products = useMemo(() => {
    return language === 'en' ? productsEn : productsAr;
  }, [language, productsEn, productsAr]);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("https://dash.watchizereg.com/api/show_cart", {
          headers: { "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0" }
        });
        const cartData = response.data.find(cart => cart.user_id === user_id);
        if (cartData) {
          const formattedCartItems = cartData.cart_item.map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_image: products.find(p => p.id === item.product_id)?.image,
            product_title: products.find(p => p.id === item.product_id)?.product_title,
            product_rating: products.find(p => p.id === item.product_id)?.average_rate,
            offer_id: item.offer_id,
            offer_image: offers.find(o => o.id === item.offer_id)?.image,
            offer_title: offers.find(o => o.id === item.offer_id)?.offer_name,
            offer_rating: offers.find(o => o.id === item.offer_id)?.average_rate,
            quantity: item.quantity,
            piece_price: parseFloat(item.piece_price),
            total_price: parseFloat(item.total_price),
            color_band: item.color_band !== null ? (item.color_band).toString() : null,
            color_dial: item.color_dial !== null ? (item.color_dial).toString() : null,
          }));
          setCart(formattedCartItems);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCart();
  }, [user_id, offers, products]);



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
    settotal_cart_price(cart.reduce((total, item) => total + item.piece_price * item.quantity, 0) + parseFloat(shipping))
  }, [cart, shipping]);


  const values = useMemo(() => {
    return { language, setLanguage, ratings, user_id, setuser_id, total_cart_price, settotal_cart_price, shippingPrices, products, tables, sideBanners, bottomBanners, homeBanners, productsCount, setProductsCount, cart, setCart, handleQuantityChange, shippingname, setShippingName, shipping, setShipping, filters, setFilters, offers, offersfilters, setOffersFilters };
  }, [language, products, tables, ratings, user_id, setuser_id, total_cart_price, settotal_cart_price, sideBanners, shippingPrices, bottomBanners, homeBanners, productsCount, setProductsCount, cart, setCart, handleQuantityChange, shippingname, setShippingName, shipping, setShipping, filters, setFilters, offers, offersfilters, setOffersFilters]);

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Header />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/products/:id" element={<Listing />} />
          <Route
            path="/product/:id"
            element={<ProductDisplay />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/category/:name" element={<Listing />} />
          <Route path="/brand/:name" element={<Listing />} />
          <Route path="/subtypes/:name" element={<Listing />} />
          <Route path="/offers" element={<Listingoffers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
