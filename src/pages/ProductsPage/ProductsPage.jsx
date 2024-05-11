import "./style.css";
import React, { useState, useEffect } from "react";
import { storage, API_BASE_URL } from "../../config"
import { Container, Col, Row, Form, FloatingLabel, Button } from 'react-bootstrap';
import ItemCardModal from "../../components/ItemCardModal/ItemCardModal";
import ItemCard from "../../components/ItemCard/ItemCard";

function ProductsPage() {
    const [search, setSearch] = useState("");

    const [items, setItems] = useState(null);

    const [isNew, setNew] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const url = API_BASE_URL + "item/account/" + storage.getItem('id');
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storage.getItem('token')}`
                }
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                setItems(responseData);
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onAdd = () => {
        setNew(true);
    }

    const onEdit = (item) => {
        setSelectedItem(item);
    }

    const onCloseModal = () => {
        setSelectedItem(null);
        setNew(false);
    
        fetchItems();
    };

    const renderBySearch = (item) => {
        if((!search || search.length === 0) ||
        item.name.includes(search) ||
        item.description.includes(search)||
        item.price.toString().includes(search) ||
        item.category.includes(search))
        return <ItemCard key={item.id} item={item} remWidth={20} onDoubleClick={onEdit} />;

        return <></>;
    }

    return (
        <Container className="mt-3">
            <Row className="justify-content-between">
                <Col className="col-auto">
                    <Row className="justify-content-start">
                        <Col className="col-auto">
                            <p className="fs-2 fw-bold">Товары:</p>
                        </Col>
                        <Col className="col-auto align-self-center">
                            <Button className='btn-primary' onClick={onAdd}>Добавить</Button>
                        </Col>
                    </Row>
                </Col>
                <Col className="col-2">
                    <FloatingLabel controlId="floatingSearch" label="Поиск">
                        <Form.Control type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                {(!items || items.length === 0) && <p className="fs-2 fw-bold text-center">Список пуст</p>}
                {(!!items && items.length !== 0) && items.map((item) => renderBySearch(item))}
            </Row>

            {(!!selectedItem || isNew) && (<ItemCardModal item={selectedItem} onCloseModal={onCloseModal} isNew={isNew} isOwn={true} />)}
        </Container>
    );
}

export default ProductsPage;