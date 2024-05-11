import "./style.css";
import { storage, API_BASE_URL } from "../../config";
import React, { useState, useEffect } from "react";
import { Container, Col, Row, Form, FloatingLabel } from 'react-bootstrap';
import ItemCardModal from "../../components/ItemCardModal/ItemCardModal";
import ItemCard from "../../components/ItemCard/ItemCard";
import Splitter from "../../components/Splitter/Splitter";
import CategoryPanel from "./components/CategoryPanel/CategoryPanel";

function CatalogPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [items, setItems] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const url = API_BASE_URL + "item";
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

    const onSelect = (item) => {
        setSelectedItem(item);
    }

    const onCloseModal = () => {
        setSelectedItem(null);

        fetchItems();
    };

    const renderBySearch = (item) => {
        if (!((!search || search.length === 0) ||
            item.name.includes(search) ||
            item.description.includes(search) ||
            item.price.toString().includes(search) ||
            item.category.includes(search)))
            return <></>;

        if (category !== "" && item.category !== category)
            return <></>;

        return <ItemCard key={item.id} item={item} remWidth={20} onDoubleClick={onSelect} />;
    }

    return (
        <Container className="mt-3">
            <Row className="justify-content-between">
                <Col className="col-auto">
                    <p className="fs-2 fw-bold">Каталог:</p>
                </Col>
                <Col className="col-2">
                    <FloatingLabel controlId="floatingSearch" label="Поиск">
                        <Form.Control type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col className="col-9">
                    <Row>
                        {(!items || items.length === 0) && <p className="fs-2 fw-bold text-center">Список пуст</p>}
                        {(!!items && items.length !== 0) && items.map((item) => renderBySearch(item))}
                    </Row>
                </Col>
                <Col className="col-auto">
                    <Splitter orientation="vertical"/>
                </Col>
                <Col className="col-2">
                    <CategoryPanel parentInvoke={setCategory}/>
                </Col>
            </Row>

            {(!!selectedItem) && (<ItemCardModal item={selectedItem} onCloseModal={onCloseModal} isNew={false} isOwn={false} />)}
        </Container>
    );
}

export default CatalogPage;