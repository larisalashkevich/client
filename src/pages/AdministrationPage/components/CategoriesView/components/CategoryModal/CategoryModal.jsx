import "./style.css";
import React, { useState } from 'react';
import { Row, FloatingLabel, Form, Button, Modal } from 'react-bootstrap';
import { API_BASE_URL, storage } from '../../../../../../config';

function CategoryModal({ category, onCloseModal, isNew }) {
    const [name, setName] = useState(!isNew ? category.name : "");

    const [isNameInvalid, setNameInvalid] = useState(false);
    const [nameLabel, setNameLabel] = useState("Название");

    const onCreate = async () => {
        const url = API_BASE_URL + "category";

        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: null,
                    name: name
                }),
            });

            onCloseModal();
        } catch (error) {
            console.error(error);
        }
    }

    const onUpdate = async () => {
        const url = API_BASE_URL + "category";

        try {
            await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: category.id,
                    name: name
                }),
            });

            onCloseModal();
        } catch (error) {
            console.error(error);
        }
    }

    const onSave = async () => {
        let isInvalid = name.length === 0;

        setNameInvalid(isInvalid);
        setNameLabel(isInvalid ? "Заполните поле!" : "Название");

        if (isInvalid)
            return;

        await (isNew ? onCreate() : onUpdate());
    }

    return (
        <Modal show="true" onHide={onCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{isNew ? "Добавление" : "Изменение"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel controlId="floatingName" isInvalid={isNameInvalid} label={nameLabel}>
                    <Form.Control isInvalid={isNameInvalid} type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                </FloatingLabel>
                <Row className='mt-4 justify-content-center'>
                    <Button className='col-5 btn-primary' onClick={onSave}>Сохранить</Button>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

export default CategoryModal;