import "./style.css";
import React, { useState, useEffect } from "react";
import { storage, API_BASE_URL } from "../../config"
import { Container, Col, Row, Table, Button } from 'react-bootstrap';
import Splitter from "../../components/Splitter/Splitter";

function CartPage() {
    const [cart, setCart] = useState(null);

    const [address, setAddress] = useState(null);

    const [totalCost, setTotalCost] = useState(0);

    const fetchProfile = async () => {
        try {
            const url = API_BASE_URL + "profile_info/account/" + storage.getItem("id");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${storage.getItem("token")}`,
                }
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                setAddress(responseData.address);
            }
            else if (responseData.keyword === "ACCOUNT_ID") {
                alert("Пожалуйста, заполните данные профиля!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCart = async () => {
        const url = API_BASE_URL + "card_item/account/" + storage.getItem("id");
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });
            const responseData = await response.json();
            setCart(responseData);
            updateTotalCost(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    const updateTotalCost = (c) => {
        let total = 0;

        if (!!c) {

            for (let i of c)
                total += i.item.price*i.count;
        }

        setTotalCost(total);
    }

    useEffect(() => {
        fetchProfile();
        fetchCart();
        

    }, []);

    const onDelete = async (id) => {
        const url = API_BASE_URL + "card_item/" + id;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                await fetchCart();
               
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла непредвиденная ошибка");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onPlus = async (item) => {

        const url = API_BASE_URL + "card_item/";
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item.id,
                    count: item.count + 1
                })
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                await fetchCart();
                
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла непредвиденная ошибка");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onOrder = async (item) => {

        const url = API_BASE_URL + "order/" + storage.getItem('id');
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                alert("Заказ создан!");
                await fetchCart();
                
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла непредвиденная ошибка");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onMinus = async (item) => {
        if (item.count === 1) {
            await onDelete(item.id);
            return;
        }


        const url = API_BASE_URL + "card_item/";
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item.id,
                    count: item.count - 1
                })
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                await fetchCart();
                
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла непредвиденная ошибка");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const renderItem = (item, index) => {
        const value = (
            <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.item.name}</td>
                <td>{item.item.price.toString() + " руб."}</td>
                <td>
                    <Row>
                        <Col className="col-auto">
                            <Button className='btn-primary' onClick={() => { onMinus(item) }}>-</Button>
                        </Col>
                        <Col className="col-auto fs-4 fw-bold">
                            {item.count}
                        </Col>
                        <Col className="col-auto">
                            <Button className='btn-primary' onClick={() => { onPlus(item) }}>+</Button>
                        </Col>
                    </Row>
                </td>
                <td>
                    <Button className='btn-danger' onClick={() => { onDelete(item.id) }}>Удалить</Button>
                </td>
            </tr>
        );

        return value;
    }

    return (
        <Container className="mt-3">
            <Row className="justify-content-start">
                <Col className="col-auto">
                    <p className="fs-2 fw-bold">Корзина:</p>
                </Col>
            </Row>
            <Row>
                {!!cart && cart.length !== 0 ? (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Количество</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => renderItem(item, index))}
                        </tbody>
                    </Table>) :
                    (
                        <Row className="justify-content-center">
                            <Col className="col-auto">
                                <p className='fs-3 mt-3'>Список пуст</p>
                            </Col>
                        </Row>
                    )}
            </Row>
            {!!cart && cart.length !== 0 ? (
                <>
                    <Splitter />
                    <Row className="justify-content-start mt-3">
                        <Col className="col-auto">
                            <Row className="fs-3 fw-bold ms-1">Полная цена: {totalCost} руб.</Row>
                            <Row className="fs-4 mt-2 ms-1">Адрес доставки: {address}</Row>
                            <Row className="mt-2">
                                <Col className="col-auto">
                                    <Button className='btn-success btn-lg' onClick={onOrder}>Заказать</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>) :
                (
                    <></>
                )}
        </Container>
    );
}

export default CartPage;