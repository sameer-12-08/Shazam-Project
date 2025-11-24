export async function smartFetch(path, options = {}) {
    const endpoints = [
        "https://127.0.0.1:4040.ngrok_free.dev",
        "https://handmade-malcolm-outwardly.ngrok-free.dev",
        "http://localhost:8080"             // local development
    ];

    for (const base of endpoints) {
        if (!base) continue;

        try {
            const response = await fetch(`${base}${path}`, options);
            if (response.ok) return response;
        } catch (err) {
            console.warn(`❌ Fetch failed for: ${base}${path}`);
        }
    }

    throw new Error("All API endpoints failed");
}
