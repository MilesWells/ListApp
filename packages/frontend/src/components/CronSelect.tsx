import React, { useState } from "react";
import { Col, Form } from "react-bootstrap";

import { RadioGroup } from ".";

const cronTypes = ["exact", "interval"] as const;
const unitsOfTime = ["day", "week", "month"] as const;

type CronTypes = typeof cronTypes[number];
type UnitOfTime = typeof unitsOfTime[number];

const numberOptions = (num: number) =>
  [...Array(num).keys()].map((h, idx) => (
    <option key={idx}>{h.toString().padStart(2, "0")}</option>
  ));

const TimeSelect: React.FC = () => {
  return (
    <Form.Row>
      <Col lg={0.1}>
        <Form.Control as="select">{numberOptions(24)}</Form.Control>
      </Col>
      <Col lg={0.1}>:</Col>
      <Col lg={0.1}>
        <Form.Control as="select">{numberOptions(60)}</Form.Control>
      </Col>
    </Form.Row>
  );
};

interface CronSelectProps {
  onChange: (cronString: string) => void;
}

export const CronSelect: React.FC<CronSelectProps> = ({ onChange }) => {
  const [type, setType] = useState<CronTypes>();
  const [timeUnit, setTimeUnit] = useState<UnitOfTime>();

  return (
    <Form>
      <Form.Row>
        <Col>
          <RadioGroup<CronTypes>
            initialValue={"exact"}
            onChange={setType}
            values={[...cronTypes]}
          />
        </Col>
        <Col>
          <RadioGroup<UnitOfTime>
            initialValue={"day"}
            onChange={setTimeUnit}
            values={[...unitsOfTime]}
          />
        </Col>
        <Col>
          <TimeSelect />
        </Col>
      </Form.Row>
    </Form>
  );
};
