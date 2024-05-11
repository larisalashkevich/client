import './style.css'
import { Image } from 'react-bootstrap';
import './style.css';

const TopBlock = () => {
    return ( 
        <div className="image-wrapper">
            <Image src="/images/pages/MainPage/sigma_with_phone.jpg" className="w-100"/>
            <p className="position-absolute bottom-50 start-50 translate-middle-x  text-light fs-1">
                Более 30 лет на рынке
            </p>
        </div>
     );
}
 
export default TopBlock;