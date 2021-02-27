import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

import { RadioGroup, Select } from ".";

// const cronTypes = ["exact"] as const;
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
const unitsOfTime = ["day", "week", "month"] as const;

// type CronTypes = typeof cronTypes[number];
type DaysOfWeek = typeof daysOfWeek[number];
type UnitOfTime = typeof unitsOfTime[number];

const dayOfWeekMap: { [k in DaysOfWeek | "*"]: number | "*" } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  "*": "*",
};

const oneToNPadded = (num: number) => [
  ...Array.from({ length: num }, (_, i) => i.toString().padStart(2, "0")),
];

interface TimeSelectProps {
  onChange: ([hour, minute]: [number, number]) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ onChange }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  return (
    <Form.Row>
      <Col>
        <Select
          items={["*", ...oneToNPadded(24)]}
          onSelect={(hour) => {
            const parsed = Number.parseInt(hour);
            setHour(parsed);
            onChange([parsed, minute]);
          }}
        />
      </Col>
      <Col>
        <Select
          items={["*", ...oneToNPadded(60)]}
          onSelect={(minute) => {
            const parsed = Number.parseInt(minute);
            setMinute(parsed);
            onChange([hour, parsed]);
          }}
        />
      </Col>
    </Form.Row>
  );
};

interface CronStringOptions {
  dayOfMonth: number | "*";
  dayOfWeek: DaysOfWeek | "*";
  hour: number | "*";
  minute: number | "*";
}
const buildCronString = ({
  dayOfMonth,
  dayOfWeek,
  hour,
  minute,
}: CronStringOptions) =>
  `${minute} ${hour} ${dayOfMonth} * ${dayOfWeekMap[dayOfWeek]}`;

interface CronSelectProps {
  onChange: (cronString: string) => void;
}

export const CronSelect: React.FC<CronSelectProps> = ({ onChange }) => {
  // const [type, setType] = useState<CronTypes>();
  const [timeUnit, setTimeUnit] = useState<UnitOfTime>();
  const [[hour, minute], setTimeOfDay] = useState<
    [hour: number | "*", minute: number | "*"]
  >(["*", "*"]);
  const [dayOfWeek, setDayOfWeek] = useState<DaysOfWeek | "*">("*");
  const [dayOfMonth, setDayOfMonth] = useState<number | "*">("*");

  useEffect(() => {
    const theString = buildCronString({ minute, hour, dayOfMonth, dayOfWeek });
    console.log(minute, hour, dayOfMonth, dayOfWeek);
    console.log(theString);
    onChange(theString);
  }, [minute, hour, dayOfWeek, dayOfMonth, onChange]);

  useEffect(() => {
    if (timeUnit !== "week") setDayOfWeek("*");
    if (timeUnit !== "month") setDayOfMonth("*");
    if (timeUnit === "week") setDayOfWeek("Sunday");
    if (timeUnit === "month") setDayOfMonth(1);
  }, [timeUnit]);

  return (
    <Form>
      <Form.Row>
        {/* <Col lg={1}>
          <RadioGroup<CronTypes>
            initialValue={"exact"}
            onChange={setType}
            values={[...cronTypes]}
          />
        </Col> */}
        <Col lg={1}>
          <RadioGroup<UnitOfTime>
            initialValue={"day"}
            onChange={setTimeUnit}
            values={[...unitsOfTime]}
          />
        </Col>
        {timeUnit === "week" && (
          <Col lg={1}>
            <Select
              items={[...daysOfWeek]}
              onSelect={(day) => setDayOfWeek(day as DaysOfWeek)}
            />
          </Col>
        )}
        {timeUnit === "month" && (
          <Col lg={1}>
            <Select
              items={[
                ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
              ]}
              onSelect={(month) => setDayOfMonth(Number.parseInt(month))}
            />
          </Col>
        )}
        <Col lg={1}>
          <TimeSelect onChange={setTimeOfDay} />
        </Col>
      </Form.Row>
    </Form>
  );
};
