import "./style.css";
import React, { useState, useEffect } from 'react';
import { Row, Col, FloatingLabel, Form, Button, Modal, Image } from 'react-bootstrap';
import { API_BASE_URL, storage } from '../../config';

function ItemCardModal({ item, onCloseModal, isNew, isOwn }) {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(null);
    const [cost, setCost] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const [file, setFile] = useState(null);

    const [categories, setCategories] = useState(null);

    const [isNameInvalid, setNameInvalid] = useState(false);
    const [nameLabel, setNameLabel] = useState("Название");

    const [isCategoryInvalid, setCategoryInvalid] = useState(false);
    const [categoryLabel, setCategoryLabel] = useState("Категория");

    const [isCostInvalid, setCostInvalid] = useState(false);
    const [costLabel, setCostLabel] = useState("Стоимость");

    const [isDescriptionInvalid, setDescriptionInvalid] = useState(false);
    const [descriptionLabel, setDescriptionLabel] = useState("Описание");

    const [isImageInvalid, setImageInvalid] = useState(false);
    const [imageLabel, setImageLabel] = useState("Изображение");

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

        if (!!item) {
            setName(item.name);
            setCategoryId(item.categoryId);
            setCost(item.price);
            setDescription(item.description);
            setImage(item.imagePath);
        }
    }, [item]);

    const onChangeImage = (e) => {
        const targetFile = e.target.files[0];
        setFile(targetFile);
        if (targetFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(targetFile);
        }
    };

    const onUploadImage = async () => {
        const formData = new FormData();

        formData.append('image', file);

        try {
            const response = await fetch(API_BASE_URL + "img", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`
                },
                body: formData,
            });

            const responseData = await response.json();

            console.log(responseData);
            if (!responseData.keyword) {
                return responseData.message;
            }
            else if (responseData.keyword === "FILE") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
                return null;
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    const onCreate = async () => {
        const url = API_BASE_URL + "item";
        let img = image;
        if (!!file) {
            img = await onUploadImage();
            if (!img)
                return;
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accountId: storage.getItem("id"),
                    name: name,
                    price: cost,
                    description: description,
                    imagePath: img,
                    categoryId: categoryId
                }),
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                onCloseModal();
            }
            else if (responseData.keyword === "CATEGORY_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
            else if (responseData.keyword === "ACCOUNT_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onUpdate = async () => {
        const url = API_BASE_URL + "item";
        let img = image;
        if (!!file) {
            img = await onUploadImage();
            if (!img)
                return;
        }

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item.id,
                    name: name,
                    price: cost,
                    description: description,
                    imagePath: img,
                    categoryId: categoryId
                }),
            });
            const responseData = await response.json();

            if (!responseData.keyword) {
                onCloseModal();
            }
            else if (responseData.keyword === "CATEGORY_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const isImage = (file) => {
        return file.toString().startsWith('data:image/');
    };

    function isDouble(value) {
        return /^\d+(\.\d+)?$/.test(value);
    }

    const onSave = async () => {
        let isInvalid = name.length === 0 || cost.toString().length === 0 || description.length === 0;

        setNameInvalid(name.length === 0);
        setNameLabel(name.length === 0 ? "Заполните поле!" : "Название");

        setCostInvalid(cost.toString().length === 0);
        setCostLabel(cost.toString().length === 0 ? "Заполните поле!" : "стоимость");

        setDescriptionInvalid(description.length === 0);
        setDescriptionLabel(description.length === 0 ? "Заполните поле!" : "Описание");

        if (isInvalid)
            return;

        isInvalid = !!file && file.length !== 0 && !isImage(image);
        setImageInvalid(isInvalid);
        setImageLabel(isInvalid ? "Выберите изображение!" : "Изображение");

        if (isInvalid)
            return;

        isInvalid = !categoryId;

        setCategoryInvalid(isInvalid);
        setCategoryLabel(isInvalid? "Заполните поле!": "Категория");

        if (isInvalid)
            return;

        isInvalid = !isDouble(cost);

        setCostInvalid(isInvalid);
        setCostLabel(isInvalid? "Некорректный ввод!": "Категория");

        if (isInvalid)
            return;

        await (isNew ? onCreate() : onUpdate());
    }

    const onDelete = async () => {
        const url = API_BASE_URL + "item/" + item.id;

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
                onCloseModal();
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const onAddToCart = async () => {

        const url = API_BASE_URL + "card_item";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accountId: storage.getItem("id"),
                    itemId: item.id,
                    count: 1
                }),
            });
            const responseData = await response.json();

            if (!responseData.keyword) {
                onCloseModal();
            }
            else if (responseData.keyword === "ITEM_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
            else if (responseData.keyword === "ACCOUNT_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const renderByOwn = () => {
        if (!isOwn)
            return (
                <Modal show="true" onHide={onCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{name + " (" + item.category + ")"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="justify-content-center">
                            <Col className="col-auto">
                                <Image src={image} style={{ width: '460px', height: '200px' }} alt="Изображение" />
                            </Col>
                        </Row>
                        <Row className="mt-5 ms-5 me-5">
                            Стоимость: {cost.toString() + " pyб."}
                        </Row>
                        <Row className="mt-5 ms-5 me-5">
                            Описание: {description}
                        </Row>
                        <Row className='mt-4 justify-content-start'>
                        <Button className='col-auto btn-primary ms-3' onClick={onAddToCart} disabled={item.accountId.toString() === storage.getItem("id")}>В корзину</Button>
                    </Row>
                    </Modal.Body>
                </Modal>
            )

        return (
            <Modal show="true" onHide={onCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew ? "Добавление" : "Изменение"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="justify-content-center">
                        <Col className="col-auto">
                            <Image src={image} style={{ width: '460px', height: '200px' }} alt="Изображение" />
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <FloatingLabel controlId="floatingImage" isInvalid={isImageInvalid} label={imageLabel}>
                            <Form.Control isInvalid={isImageInvalid} type="file" onChange={onChangeImage} />
                        </FloatingLabel>
                    </Row>
                    <Row className="mt-3">
                        <FloatingLabel controlId="floatingName" isInvalid={isNameInvalid} label={nameLabel}>
                            <Form.Control isInvalid={isNameInvalid} value={name} type="text" onChange={(e) => setName(e.target.value)} />
                        </FloatingLabel>
                    </Row>
                    <Row className="mt-3">
                        <FloatingLabel controlId="floatingCategory" isInvalid={isCategoryInvalid} label={categoryLabel}>
                            <Form.Select isInvalid={isCategoryInvalid} onChange={(e) => setCategoryId(e.target.value)}>
                                <option value={null}>Выберите категорию</option>
                                {!!categories && categories.length !== 0 && categories.map((category, index) => (
                                    <option key={index} value={category.id} selected={category.id === categoryId}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Row>
                    <Row className="mt-3">
                        <FloatingLabel controlId="floatingCost" isInvalid={isCostInvalid} label={costLabel}>
                            <Form.Control isInvalid={isCostInvalid} value={cost} type="text" onChange={(e) => setCost(e.target.value)} />
                        </FloatingLabel>
                    </Row>
                    <Row className="mt-3">
                        <FloatingLabel controlId="floatingDescription" isInvalid={isDescriptionInvalid} label={descriptionLabel}>
                            <Form.Control isInvalid={isDescriptionInvalid} as="textarea" rows={11} placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FloatingLabel>
                    </Row>
                    <Row className='mt-4 justify-content-start'>
                        <Button className='col-auto btn-primary ms-3' onClick={onSave}>Сохранить</Button>
                        {!isNew && (<Button className='col-auto btn-danger ms-3' onClick={onDelete}>Удалить</Button>)}
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }

    return renderByOwn();
}

export default ItemCardModal;