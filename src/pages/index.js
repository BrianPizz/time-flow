import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Button, Card, CardContent, CircularProgress
} from "@mui/material";
import { fetchEntries } from "@/lib/api";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      window.location.href = "/login";
    } else {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    fetchEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    }).catch((err) => {
      console.error("❌ Error fetching entries:", err.message);
      setLoading(false);
    });
  }, [token]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Time Tracker Dashboard
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          entries.map((entry) => (
            <Card key={entry._id} sx={{ my: 2 }}>
              <CardContent>
                <Typography variant="h6">{entry.task}</Typography>
                <Typography variant="body2">{entry.project} — {entry.client}</Typography>
                <Typography>Status: {entry.status}</Typography>
                <Typography>
                  Duration: {(entry.duration / 60).toFixed(1)} minutes
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}
