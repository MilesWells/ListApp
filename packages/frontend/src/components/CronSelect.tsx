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
const unitsOfTime = ["Daily", "Weekly", "Monthly"] as const;

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
  onChange: ([hour, minute]: [number | "*", number | "*"]) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ onChange }) => {
  const [hour, setHour] = useState<number | "*">(0);
  const [minute, setMinute] = useState<number | "*">(0);

  return (
    <Form.Row>
      <Col>
        <Select
          items={["*", ...oneToNPadded(24)]}
          onSelect={(hour) => {
            const parsed = Number.parseInt(hour);
            const value = isNaN(parsed) ? "*" : parsed;

            setHour(value);
            onChange([value, minute]);
          }}
        />
      </Col>
      <Col>
        <Select
          items={["*", ...oneToNPadded(60)]}
          onSelect={(minute) => {
            const parsed = Number.parseInt(minute);
            const value = isNaN(parsed) ? "*" : parsed;

            setMinute(value);
            onChange([hour, value]);
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
    onChange(theString);
  }, [minute, hour, dayOfWeek, dayOfMonth, onChange]);

  useEffect(() => {
    if (timeUnit !== "Weekly") setDayOfWeek("*");
    if (timeUnit !== "Monthly") setDayOfMonth("*");
    if (timeUnit === "Weekly") setDayOfWeek("Sunday");
    if (timeUnit === "Monthly") setDayOfMonth(1);
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
            initialValue={"Daily"}
            onChange={setTimeUnit}
            values={[...unitsOfTime]}
          />
        </Col>
        {timeUnit === "Weekly" && (
          <Col lg={1}>
            <Select
              items={[...daysOfWeek]}
              onSelect={(day) => setDayOfWeek(day as DaysOfWeek)}
            />
          </Col>
        )}
        {timeUnit === "Monthly" && (
          <Col lg={1}>
            <Select
              items={[
                ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
              ]}
              onSelect={(month) => {
                const parsed = Number.parseInt(month);
                setDayOfMonth(isNaN(parsed) ? "*" : parsed);
              }}
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
