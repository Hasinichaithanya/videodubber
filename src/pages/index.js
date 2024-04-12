// pages/index.js

import {
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  rem,
  Button,
  Title,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
import styles from "../styles/TableSelection.module.css";

export default function TableSelection() {
  const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
  };
  const [selection, setSelection] = useState(["1"]);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [status, setStatus] = useState(apiStatusConstants.initial);
  const [resMsg, setResMsg] = useState("");

  useEffect(() => {
    setStatus(apiStatusConstants.inProgress);
    const getData = async () => {
      const options = {
        method: "GET",
      };
      const result = await fetch(
        "https://6618d1549a41b1b3dfbe040a.mockapi.io/users/users",
        options
      );
      const response = await result.json();
      console.log(response);
      if (result.ok === true) {
        setData(response);
        setStatus(apiStatusConstants.success);
      } else {
        setErrMsg("Could not fetch data!!");
        setStatus(apiStatusConstants.failure);
      }
    };
    getData();
  }, []);

  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.id)
    );

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr
        key={item.id}
        className={`${selected ? styles.rowSelected : ""}`}
      >
        <Table.Td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
          />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
      </Table.Tr>
    );
  });

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleMailChange = (e) => {
    setMail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name == "" || mail == "") {
      alert("Please enter the details");
    }
    const newUser = { name, mail };
    console.log(newUser);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    };
    const result = await fetch(
      "https://6618d1549a41b1b3dfbe040a.mockapi.io/users/users",
      options
    );
    const response = await result.json();
    if (result.ok) {
      setMail("");
      setName("");
      setResMsg("User Added Sucessfully!!");
    }
    console.log(response);
  };

  const renderLoadingView = () => (
    <Loader color="blue" className={styles.Loader} />
  );

  const renderSuccessView = () => {
    return (
      <ScrollArea>
        <Table miw={800} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === data.length}
                  indeterminate={
                    selection.length > 0 && selection.length !== data.length
                  }
                />
              </Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };

  const renderFailureView = () => {
    return <div>{errMsg}</div>;
  };
  const renderUI = () => {
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className={styles.main}>
      {renderUI()}
      <form className={styles.postReqCosntainer} onSubmit={handleSubmit}>
        <Title>Add User</Title>
        <div className={styles.inputContainer}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            type="text"
            placeholder={"Enter your name..."}
            required
            className={styles.nameInput}
            value={name}
            onChange={handleNameChange}
            id="name"
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="email">E-mail:</label>
          <br />
          <input
            type="email"
            placeholder={"Enter your e-mail..."}
            required
            className={styles.mailInput}
            value={mail}
            onChange={handleMailChange}
            id="email"
          />
        </div>
        <Button type="submit">Add User</Button>
        {resMsg !== "" && <p>{resMsg}</p>}
      </form>
    </div>
  );
}
