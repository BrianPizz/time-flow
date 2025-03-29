export async function fetchEntries() {
    const token = localStorage.getItem("token");
  
    const res = await fetch("/api/time-tracking/time-entries", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!res.ok) throw new Error("Failed to fetch entries");
    return await res.json();
  }
  