import React, { useContext, useState, useEffect } from 'react';
import HomeSlider from "./HomeSlider";
import './home.css';
import ProductSlider from '../../Components/Product/ProductSlider';
import OfferSlider from '../../Components/Product/OfferSlider';
import { MyContext } from '../../App';

function Home() {
    const { products, tables, language, windowWidth, offers, sideBanners, bottomBanners, homeBanners } = useContext(MyContext);
    const [grades, setGrades] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState({});
    const [gradeText, setGradeText] = useState({});
    const [filteredOffers, setfilteredOffers] = useState([]);

    useEffect(() => {
        setfilteredOffers(offers.filter(o => o.in_season === "yes"));
    }, [offers]);

    useEffect(() => {
        if (tables && tables.grades) {
            setGrades(tables.grades);
        }
    }, [tables]);

    useEffect(() => {

    }, [])


    useEffect(() => {
        if (products && grades.length) {
            const productsByGrade = {};

            grades.forEach(grade => {
                const filtered = products.filter(product => product.grade_id === grade.id);
                if (filtered.length > 0) {
                    productsByGrade[grade.id] = filtered;
                }
            });

            setFilteredProducts(productsByGrade);

            const gradeTextObj = {};
            grades.forEach(grade => {
                gradeTextObj[grade.id] = {
                    title: grade.translations?.find(t => t.locale === language)?.grade_name || grade.grade_name,
                    description: grade.translations?.find(t => t.locale === language)?.description || grade.description
                };
            });
            setGradeText(gradeTextObj);
        }
    }, [products, grades, language]);

    return (
        <div className="home px-md-5 pb-md-0 pb-5 container-fluid">
            <div className={`home-slider ${windowWidth > 768 ? 'py-5' : "pb-5"} `}>
                <HomeSlider banners={homeBanners} />
            </div>
            <div className="row position-relative">
                <div className="col-md-3 d-md-block d-none side-banners-container" style={{ overflow: "hidden" }}>
                    {sideBanners.map((banner, index) => (
                        <img key={index} loading="lazy" src={`https://dash.watchizereg.com/Uploads_Images/Banner_Side/${banner.image}`} alt={`sidebanner${index + 1}`} className="col-12 mb-2 rounded-3" />
                    ))}
                </div>
                <div className="col-md-9 col-12 lato-regular home-proud">
                    {grades.map(grade => {
                        const gradeProducts = filteredProducts[grade.id] ? filteredProducts[grade.id].slice(0, 12) : [];
                        const gradeLocalization = gradeText[grade.id];
                        if (gradeProducts && gradeProducts.length > 0) {
                            return (
                                <ProductSlider
                                    key={grade.id}
                                    text={{
                                        title: { en: gradeLocalization?.title || grade.grade_name, ar: gradeLocalization?.title || grade.grade_name },
                                        description: { en: gradeLocalization?.description || '', ar: gradeLocalization?.description || '' }
                                    }}
                                    products={gradeProducts}
                                    to={`/grade/${grade.grade_name}`}
                                    moreid={grade.id}
                                />
                            );
                        }
                        return null;
                    })}
                    {filteredOffers.length !== 0 &&
                        <OfferSlider
                            key={0}
                            text={{
                                title: { en: "Season Offers.", ar: "عروض الموسم." },
                                description: { en: "skbvkwbvjkwbnvkebnivkwvnksnve", ar: "صنقرثنصقرنصثلاقرنتثصلاقر" }
                            }}
                            products={filteredOffers}
                            to={`/offers`}
                        />
                    }
                </div>
            </div>
            <div className="row pb-md-0 pb-5 bottom-banners-container">
                {bottomBanners.map((banner, index) => (
                    <img key={index} loading="lazy" src={`https://dash.watchizereg.com/Uploads_Images/Banner_Bottom/${banner.image}`} alt={`bottombanner${index + 1}`} className="col-6 mb-2 rounded-3 img-fluid" style={{ maxHeight: "300px" }} />
                ))}
            </div>
        </div>
    );
}

export default Home;
