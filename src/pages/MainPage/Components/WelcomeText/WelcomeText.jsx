import { Container, Row, Col } from 'react-bootstrap';
import './style.css';

const WelcomeText = () => {
    return ( 
        <Container className='text-center mt-5'>
            <Row className='fs-1 justify-content-center text-center'>
                <Col className="col-auto">Приветствуем на сайте</Col>
                <Col className=' col-auto text-primary'>Blueberries</Col>
            </Row>
            <div className="welcome-text mt-3">
                <p className='fs-5'>
                    Добро пожаловать на самый большой (в перспективе) маркетплейс на территории СНГ! Мы являемся надежным партнером в реализации вашей собственной продукции. Наша команда специализируется на создании качественного и инновационного решения для предоставления торговой площадки для онлайн-продавцов. Мы гордимся своим профессионализмом, опытом и индивидуальным подходом к каждому клиенту. Независимо от того, продаете вы, или покупаете, мы обеспечим вас высококачественными услугами и удовлетворим все ваши потребности. Доверьтесь нам, и мы превратим вашу прибыль в реальность (за небольшой процент в виде банки сгущенки, разумеется)!
                </p>
            </div>
        </Container>
     );
}
 
export default WelcomeText;