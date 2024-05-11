import "./style.css";
import Splitter from "../../components/Splitter/Splitter";
import { Container, Row, Col } from "react-bootstrap";
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/ChangePassword/ChangePassword";

function AccountPage() {
    return (
        <Container className="mt-3">
            <Row>
                <Col className="col-6 offset-3">
                    <Profile />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Splitter />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="col-6 offset-3">
                    <ChangePassword />
                </Col>
            </Row>
        </Container>
    );
}

export default AccountPage;