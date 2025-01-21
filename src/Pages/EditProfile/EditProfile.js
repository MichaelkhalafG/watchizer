import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@mui/material';
import DOMPurify from 'dompurify';
import { IoMdCloudUpload } from "react-icons/io";
import userimg from '../../assets/images/user.webp';
import './EditProfile.css';
import { MyContext } from '../../App';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div className="p-3">{children}</div>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function EditProfile({ userData }) {
    const { language } = useContext(MyContext);
    const [value, setValue] = useState(0);
    const [name, setName] = useState(userData.name || '');
    const [email] = useState(userData.email || '');
    const [phone, setPhone] = useState(userData.phone_number || '');
    const [extraphone, setextraphone] = useState(userData.extra_phone_number || '');
    const [image, setImage] = useState(userData.image || null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (event, newValue) => setValue(newValue);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSave = () => {
        const sanitizedData = {
            name: DOMPurify.sanitize(name),
            email: DOMPurify.sanitize(email),
            phone: DOMPurify.sanitize(phone),
            image,
        };
        console.log('Profile data saved:', sanitizedData);
    };

    const handlePasswordChange = () => {
        if (password === confirmPassword) {
            console.log('Password changed:', password);
        } else {
            console.error('Passwords do not match');
        }
    };

    return (
        <div className={`container mt-4 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="border-bottom mb-3" style={{ overflowX: "scroll" }}>
                <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
                    <Tab label={language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'} {...a11yProps(0)} />
                    <Tab label={language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'} {...a11yProps(1)} />
                    <Tab label={language === 'ar' ? 'تعديل العناوين' : 'Edit Address'} {...a11yProps(2)} />
                </Tabs>
            </div>
            <CustomTabPanel value={value} index={0}>
                <div className="row gx-3 gy-3">
                    <div className="col-md-5 d-flex justify-content-center mb-3">
                        <div className="position-relative col-8 rounded-circle border">
                            <img src={image || userimg} alt="User profile" className="img-fluid rounded-circle" />
                            <label className="upload-icon position-absolute rounded-circle">
                                <IoMdCloudUpload size={40} />
                                <input type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                    <form className="col-md-7">
                        <div className="row mb-3">
                            <div className="col-12 col-sm-6">
                                <label className="form-label">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                <input type="email" className="form-control" value={email} disabled />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12 col-sm-6">
                                <label className="form-label">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
                                <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">{language === 'ar' ? 'هاتف اضافي' : 'Extra phone'}</label>
                                <input type="text" className="form-control" value={extraphone} onChange={(e) => setextraphone(e.target.value)} />
                            </div>
                        </div>
                        <button type="button" className="w-100 p-2 btn btn-dark" onClick={handleProfileSave}>
                            {language === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                    </form>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <form>
                    <div className="mb-3">
                        <label className="form-label">{language === 'ar' ? 'كلمة المرور القديمة' : 'Old Password'}</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                        <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="button" className="w-100 p-2 btn btn-dark" onClick={handlePasswordChange}>
                        {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                    </button>
                </form>
            </CustomTabPanel>
        </div>
    );
}

EditProfile.propTypes = {
    userData: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phone_number: PropTypes.string,
        image: PropTypes.string,
    }).isRequired,
};

export default EditProfile;
