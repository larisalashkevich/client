import "./style.css";
import { API_BASE_URL } from "../../../../config";
import React, { useState, useEffect } from "react";
import { Col, Button } from 'react-bootstrap';

function CategoryPanel({ parentInvoke }) {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        fetchCategories();
        parentInvoke(category);
    }, [])

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

    const handleSelect = (eventKey) => {
        setCategory(eventKey);
        parentInvoke(eventKey);
    };

    return (
        <Col className='float-end col-auto'>
            <Button className='w-100' disabled={category === ""} onClick={() => handleSelect("")}>Все</Button>
            {!!categories && categories.map((item) => (
                <Button className='w-100 mt-2' disabled={category === item.name} onClick={() => handleSelect(item.name)}>{item.name}</Button>
            ))}
        </Col>
    );
}

export default CategoryPanel;