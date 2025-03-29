import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Button, Card, CardContent, CircularProgress
} from "@mui/material";
import { fetchEntries } from "@/lib/api";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

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
