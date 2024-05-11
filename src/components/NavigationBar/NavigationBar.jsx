import "./style.css";
import React, {useState, useEffect} from "react";
import { Navbar, Nav, Col, Row } from 'react-bootstrap';
import AuthorizationModal from "../AuthorizationModal/AuthorizationModal";
import { storage } from "../../config";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
    const [showAuthorizationModal, setShowAuthorizationModal] = useState(false);
    const [role, setRole] = useState(storage.getItem('role'));

    const onAuthorization = () => {
        setShowAuthorizationModal(true);
    };

    const navigate = useNavigate();

    const onExit = () => {
        storage.removeItem('token');
        storage.removeItem('id');
        storage.removeItem('username');
        storage.removeItem('role');
        setRole(null);
        navigate("/");
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const userRole = storage.getItem('role');
            setRole(userRole);
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const renderRoleRoutes = () => {
        if (role === "ADMIN")
            return (
                <>
                    <Nav.Link className="text-light" href="/administration">Администрирование</Nav.Link>
                </>
            )

        if (role === "USER")
            return (
                <>
                    <Nav.Link className="text-light" href="/account">Профиль</Nav.Link>
                    <Nav.Link className="text-light" href="/catalog">Каталог</Nav.Link>
                    <Nav.Link className="text-light" href="/cart">Корзина</Nav.Link>
                    <Nav.Link className="text-light" href="/orders">Мои заказы</Nav.Link>
                    <Nav.Link className="text-light" href="/products">Мои товары</Nav.Link>
                </>
            )
        return (<></>);
    }

    return (
        <>
            <Navbar className="bg-primary">
                <Navbar.Brand className="text-light ms-3" href="/">Blueberries</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="nav-link">
                        <Nav.Link className="text-light" href="/">Главная</Nav.Link>
                        <Nav.Link className="text-light" href="/about">О нас</Nav.Link>
                        {renderRoleRoutes()}
                    </Nav>
                </Navbar.Collapse>
                <Row className="justify-content-end">
                    <Col>
                        {!!role? <Nav.Link className="text-light me-3" onClick={onExit}>Выйти</Nav.Link>:
                        <Nav.Link className="text-light me-3" onClick={onAuthorization}>Войти</Nav.Link>}
                    </Col>
                </Row>
            </Navbar>

            {showAuthorizationModal && (<AuthorizationModal setRole={setRole} onHide={() => setShowAuthorizationModal(false)}/>)}
        </>
    );
}

export default NavigationBar;