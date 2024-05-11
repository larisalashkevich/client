import { Image, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './style.css';

const TopBlock = () => {
    const navigate = useNavigate();

    const goToContactPage = () => {
        navigate('/about');
    };

    return ( 
        <div className="image-wrapper">
            <Image src="blueberries.jpg" className="w-100"/>
            <Button variant="light" className="position-absolute bottom-50 start-50 translate-middle-x" size="lg" onClick={goToContactPage}>
                Мы - самые сочные ягодки
            </Button>
        </div>
     );
}
 
export default TopBlock;