import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

const SlowSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCountries = useCallback(
        debounce(async (searchTerm) => {
            if (!searchTerm) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `http://localhost:8081/slow-search?query=${searchTerm}`
                );
                setResults(response.data);
            } catch (err) {
                setError("Eroare la încărcarea datelor");
            }

            setLoading(false);
        }, 500),
        []
    );

    useEffect(() => {
        fetchCountries(query);
    }, [query, fetchCountries]);

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
            <h2>Search Country</h2>
            <input
                type="text"
                placeholder="Type a country..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {results.map((country, index) => (
                    <li key={index}>{country}</li>
                ))}
            </ul>
        </div>
    );
};

export default SlowSearch;
