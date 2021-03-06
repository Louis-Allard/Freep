// Page des conversations
import React from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { ArrowLeft } from "react-feather";
import "../style/Messaging.scss";
import { backend } from "../conf";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageArray: [{}],
      recipient: [{}],
      content_form: "",
      profile: null
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const P2 = this.props.match.params.P2;
    if ("user" in localStorage) {
      const currentUser = JSON.parse(localStorage.getItem("user")).user.id;
      this.setState(
        {
          profile: currentUser
        },
        () => {
          axios
            .get(`${backend}/message/${this.state.profile}/${P2}`, {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            })
            .then(({ data }) => {
              this.setState({
                messageArray: data.results,
                recipient: data.recipent
              });
            });
        }
      );
    }
  }

  handlePrev(e) {
    const currentUser = JSON.parse(localStorage.getItem("user")).user.id;
    e.preventDefault();
    this.props.history.push(`/messagerie/${currentUser}`);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({
      content_form: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { content_form } = this.state;
    const P2 = this.props.match.params.P2;
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .post(`${backend}/message/${this.state.profile}/${P2}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        content: content_form
      })
      .then(({ data }) => {
        let messages = this.state.messageArray;
        data.hour_send = "l'instant";
        messages.unshift(data);
        this.setState({
          content_form: "",
          messageArray: messages
        });
      })
      .catch(err => {
        console.log(`Nope! ${err}`);
      });
  }

  render() {
    const currentUser = this.state.profile;
    return (
      <Row className="messages-container p-0 m-0">
        <Row className="col-12">
          <Button
            className="back-message-btn d-flex"
            onClick={e => {
              this.handlePrev(e);
            }}
          >
            <ArrowLeft className="mx-2" /> Messagerie
          </Button>
        </Row>
        <Row className="justify-content-center" />
        {this.state.recipient.map((recipe, i) => {
          return (
            <Row key={`n+${i}`} className="message-text">
              <Col
                md={{ size: 10, offset: 5 }}
                className="px-25 my-3 d-flex align-items-center"
              >
                <p className="name">{recipe.nickname}</p>
              </Col>
              <Col
                md={{ size: 12, offset: 2 }}
                className="px-25 my-3 d-flex align-items-center"
              >
                <Form
                  className="message-form"
                  onSubmit={e => {
                    this.handleSubmit(e);
                  }}
                >
                  <FormGroup className="d-flex flex-column py-0 m-0 text-center">
                    <Label for="new-message">Nouveau Message</Label>

                    <Input
                      type="textarea"
                      name="content_form"
                      id="content_field"
                      value={this.state.content_form}
                      onChange={e => {
                        this.handleChange(e);
                      }}
                    />

                    <Button className="col-6 mt-4 mx-auto message-btn">
                      Envoyer
                    </Button>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          );
        })}
        {this.state.messageArray.length === 0 ? (
          <p>Vous n'avez pas de message.</p>
        ) : (
          ""
        )}
        {this.state.messageArray.map((message, i) => {
          return (
            <React.Fragment key={i}>
              <Card
                className={
                  message.id_author === currentUser
                    ? "message-card myself"
                    : "message-card"
                }
              >
                <CardBody>
                  <Row className="message-text">
                    <Col md="3" className="d-flex align-items-center">
                      <img
                        src={message.avatar}
                        alt="Avatar"
                        className="imgAvatar avatar rounded-circle"
                      />
                    </Col>
                    <Col md="9" className="px-5 my-3">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <p className="name">{message.nickname}</p>
                        </Col>
                        <Col xs="7" className="text-right font-italic">
                          <p className="messageDate timeStamp text-muted">
                            {message.date_diff >= 1
                              ? "Il y a " + message.date_diff + " jours."
                              : "Envoyé à " + message.hour_send + "."}
                          </p>
                        </Col>
                      </Row>
                      <p className="text-justify">{message.content}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </React.Fragment>
          );
        })}
      </Row>
    );
  }
}

export default Message;
