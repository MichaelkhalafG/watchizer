import { IoIosSearch } from 'react-icons/io';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { MyContext } from '../../../App';

function SearchBox() {
    const { language } = useContext(MyContext);
    return (
        <div className="header-search rounded-3 ms-3 me-3 p-2 px-4 border border-2" style={{ width: "60%", height: "60px", background: "#f3f4f7", position: "relative" }}>
            <input placeholder={language === 'ar' ? 'البحث عن المنتجات' : 'Search for products...'} className="rounded-3 border border-0" type="text" style={{ background: "transparent", outline: "none", fontSize: "18px", color: "rgba(0,0,0,0.8)", height: "40px", width: "100%" }} />
            {language === 'ar' ?
                <Button className="p-0 border searchbtn border-0 text-black" type="submit" style={{ background: "transparent", position: "absolute", height: "40px", width: "40px", borderRadius: "50%", minWidth: "40px", left: "10px" }}>
                    <IoIosSearch />
                </Button>
                :
                <Button className="p-0 border searchbtn border-0 text-black" type="submit" style={{ background: "transparent", position: "absolute", height: "40px", width: "40px", borderRadius: "50%", minWidth: "40px", right: "10px" }}>
                    <IoIosSearch />
                </Button>
            }
        </div>
    );
}
export default SearchBox;