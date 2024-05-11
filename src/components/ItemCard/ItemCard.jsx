import "./style.css";
import { Button, Card } from "react-bootstrap";

function ItemCard({ item, onDoubleClick, remWidth }) {
    return (
        <Card className="ms-3 mt-3" style={{ width: remWidth + 'rem' }} onDoubleClick={() => { onDoubleClick(item) }}>
            <Card.Img variant="top" src={item.imagePath} alt="Image"/>
            <Card.Body>
                <Card.Title>{item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}</Card.Title>
                <Card.Text>
                    {item.price} руб.
                </Card.Text>
                <Card.Text>
                    {item.description.length > 100 ? item.description.substring(0, 100) + "..." : item.description}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default ItemCard;