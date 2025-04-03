import { useState } from "react";

const [entryId, setEntryId] = useState(null);
const [error, setError] = useState("");
const [status, setStatus] = useState("paused"); // running, stopped, paused
const [duration, setDuration] = useState(0); // timer display
const [timer, setTimer] = useState(null); // timer interval
const [formData, setformData] = useState({
  task: "",
  project: "",
  client: "",
  billable: false,
  description: "",
});

const handleCreateEntry = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("/api/time-tracking/create-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create entry");
      return;
    }
    setEntryId(data.entry._id);
  } catch (err) {
    setError("Something went wrong");
  }
};

const handleStartTimer = async (entryId) => {
  try {
    const res = await fetch("/api/time-tracking/start-interval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entryId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to start timer");
      return;
    }
    setStatus("running");
    const timerId = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    setTimer(timerId);
  } catch (err) {
    setError("Something went wrong");
  }
};

const handlePauseTimer = async () => {
  try {
    const res = await fetch("/api/time-tracking/pause-interval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entryId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to pause timer");
      return;
    }

    clearInterval(timer);
    setTimer(null);
    setStatus("paused");
  } catch (err) {
    setError("Something went wrong");
  }
};

// resume timer

const handleStopTimer = async () => {
  try {
    const res = await fetch("/api/time-tracking/stop-interval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entryId }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to stop timer");
      return;
    }

    clearInterval(timer);
    setTimer(null);
    setStatus("stopped");
  } catch (err) {
    setError("Something went wrong");
  }
};

return (
  <div>
    <h1>Create Time Entry</h1>
    <form onSubmit={handleCreateEntry}>
      <input
        type="text"
        name="task"
        placeholder="Task"
        value={formData.task}
        onChange={(e) => setformData({ ...formData, task: e.target.value })}
      />
      <input
        type="text"
        name="project"
        placeholder="Project"
        value={formData.project}
        onChange={(e) => setformData({ ...formData, project: e.target.value })}
      />
      <input
        type="text"
        name="client"
        placeholder="Client"
        value={formData.client}
        onChange={(e) => setformData({ ...formData, client: e.target.value })}
      />
      <input
        type="checkbox"
        name="billable"
        checked={formData.billable}
        onChange={(e) =>
          setformData({ ...formData, billable: e.target.checked })
        }
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setformData({ ...formData, description: e.target.value })
        }
      ></textarea>
      <button type="submit">Create Entry</button>
    </form>

    {error && <p>{error}</p>}
    {entryId && (
      <div>
        <h2>{formData.project} - {formData.task}</h2>
        <div>Client: {formData.client}</div>
        <div>Elapsed: {duration}</div>

        {status === "paused" && duration === 0 && (
          <button onClick={() => handleStartTimer(entryId)}>Start Timer</button>
        )}

        {status === "paused" && (
          <button onClick={() => handleResumeTimer(entryId)}>Resume</button>
        )}

        {status === "running" && (
          <button onClick={handlePauseTimer}>Pause</button>
        )}

        {status !== "stopped" && (
          <button onClick={handleStopTimer}>Stop</button>
        )}
      </div>
    )}
  </div>
);
