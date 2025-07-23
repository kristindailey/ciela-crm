import "./App.css";
import { useState } from "react";

function App() {
  const [apiResponse, setApiResponse] = useState(false);

  const testConnection = async () => {
    const apiUrl = "http://localhost:8000/api/test";
    
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setApiResponse(true);
      console.log("API connection successful:", data);
    } catch (error) {
      setApiResponse(false);
      console.log("Error fetching data:", error);
    }
  };

  return (
    <>
      <h1 className="font-thin">Ciela CRM</h1>
      <button onClick={testConnection}>Test Connection</button>
    </>
  );
}

export default App;