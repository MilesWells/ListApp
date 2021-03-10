import React, { useEffect, useState } from "react";
import { Button, Card, Form, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Cronstrue from "cronstrue";

import { CronSelect, List } from "../components";
import { ListService } from "../services";

export const NewList: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [inFlight, setInFlight] = useState(false);
  const [cronValue, setCronValue] = useState("* * * * *");
  const [humanReadable, setHumanReadable] = useState("");
  const history = useHistory();

  useEffect(() => {
    setHumanReadable(Cronstrue.toString(cronValue));
  }, [cronValue]);

  return (
    <Card>
      <Card.Header>
        <Nav variant="pills">
          <Nav.Item>
            <Nav.Link as={Link} to="/">
              Back
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>List</Form.Label>
          <List onChange={setItems} locked={inFlight} />
        </Form.Group>

        <div>{humanReadable}</div>
        <div>{cronValue}</div>

        <CronSelect onChange={setCronValue} />

        <Button
          variant="primary"
          onClick={async () => {
            setInFlight(true);

            try {
              const list = await ListService.createList(items, name);
              if (list !== undefined) history.push("/");
            } catch (err) {
              console.error(err);
            } finally {
              setInFlight(false);
            }
          }}
        >
          Save
        </Button>
      </Card.Body>
    </Card>
  );
};
