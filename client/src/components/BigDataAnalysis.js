import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Container, Row, Col, Card, Table, Button, Form } from "react-bootstrap";

Chart.register(...registerables);

const BigDataAnalysis = () => {
    const [data, setData] = useState({});
    const [fields, setFields] = useState([]);
    const [chunkIndex, setChunkIndex] = useState(0);
    const [selectedField, setSelectedField] = useState("");
    const [stats, setStats] = useState({ bar: {}, line: {}, pie: {}, std: [] });

    useEffect(() => {
        fetch("http://localhost:8081/big-data/fields")
            .then((res) => res.json())
            .then((fields) => {
                console.log("API fields:", fields);  // 🔍 Debugging

                setFields(fields);
                if (fields.length > 0) setSelectedField(fields[0]);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8081/big-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields: [selectedField] }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }
                return res.json();
            })
            .then((dataset) => {
                console.log("API Response:", dataset);  // 🔍 Debugging
                if (dataset[selectedField]) {
                    setData(dataset);
                    calculateStats(dataset[selectedField]);
                }
            })
            .catch((err) => console.error("Fetch error:", err));

    }, [selectedField, chunkIndex]);

    const calculateStats = (dataset) => {
        if (!dataset) return;
        const chunk = dataset.slice(chunkIndex * 200, (chunkIndex + 1) * 200);
        const labels = chunk.map((_, i) => `Chunk ${i + 1}`);
        const values = chunk;

        setStats({
            bar: {
                labels,
                datasets: [{ label: "Character Frequency", data: values }],
            },
            line: {
                labels,
                datasets: [{ label: "Trend", data: values }],
            },
            pie: {
                labels,
                datasets: [{ data: values }],
            },
            std: values,
        });
    };

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                        {fields.map((field) => (
                            <option key={field} value={field}>{field}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={6} className="text-end">
                    <Button onClick={() => setChunkIndex(chunkIndex + 1)}>Next Chunk</Button>
                </Col>
            </Row>

            <Row>
                <Col md={4}><Card className="p-3"><Bar data={stats.bar} /></Card></Col>
                <Col md={4}><Card className="p-3"><Line data={stats.line} /></Card></Col>
                <Col md={4}><Card className="p-3"><Pie data={stats.pie} /></Card></Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="p-3">
                        <h4>Standard Deviation</h4>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Character</th>
                                <th>STD</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.std.map((val, i) => (
                                <tr key={i}>
                                    <td>{stats.bar.labels[i]}</td>
                                    <td>{val}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BigDataAnalysis;
