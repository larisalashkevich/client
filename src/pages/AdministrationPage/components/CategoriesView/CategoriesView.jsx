import "./style.css";
import { Container, Table, Col, Row, FloatingLabel, Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, storage } from '../../../../config';
import CategoryModal from "./components/CategoryModal/CategoryModal";

function CategoriesView() {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isNew, setNew] = useState(false);

    const filterBySearch = (category, index) => {
        const value = (
            <tr key={category.id} onDoubleClick={()=>onEdit(category)}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.itemsCount}</td>
                <td><Button className='btn-danger' onClick={() => {onDelete(category.id)}}>Удалить</Button></td>
            </tr>
        );
        
        if (search.length === 0 ||
            (index+1).toString().includes(search) ||
            category.name.includes(search) ||
            category.itemsCount.toString().includes(search))
            return value;

        return (<></>);
    }

    const fetchCategories = async () => {
        const url = API_BASE_URL + "category";
        try {
            const response = await fetch(url);
            const responseData = await response.json();
            setCategories(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const onAdd = () => {
        setNew(true);
    }

    const onEdit = (category) => {
        setSelectedCategory(category);
    }

    const onDelete = async (id) => {
        const url = API_BASE_URL + "category/" + id;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            const responseData = await response.json();

            if(!responseData.keyword){
                await fetchCategories();
            }
            else if(responseData.keyword === "ID"){
                alert("Произошла непредвиденная ошибка");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onCloseModal = () => {
        setSelectedCategory(null);
        setNew(false);

        fetchCategories();
    };

    return (
        <Container>
            <Row className="justify-content-between mt-3">
                <Col className="col-auto">
                    <Row>
                        <Col className="col-auto">
                            <p className='fs-3'>Категории товаров:</p>
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
            {!!categories && categories.length !== 0 ? (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Название</th>
                            <th>Количество товаров</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => filterBySearch(category, index))}
                    </tbody>
                </Table>) :
                (
                    <Row className="justify-content-center">
                        <Col className="col-auto">
                            <p className='fs-3 mt-3'>Список пуст</p>
                        </Col>
                    </Row>
                )}

            {(!!selectedCategory || isNew) && (<CategoryModal category={selectedCategory} onCloseModal={onCloseModal} isNew={isNew} />)}
        </Container>
    );
}

export default CategoriesView;