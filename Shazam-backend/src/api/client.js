// .env: REACT_APP_API_BASE=http://192.168.1.10:8080/api
const API_BASE = process.env.REACT_APP_API_BASE;

export async function uploadFiles(formData, onProgress) {
    // Use fetch for simplicity or XMLHttpRequest for granular progress
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed: ' + res.statusText);
    return res.json(); // { url: "http://..../api/d/..." }
}
