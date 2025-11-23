import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SeamlessTransfer from './pages/SeamlessTransfer';
import PromptRefiner from './pages/PromptRefiner';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/transfer" element={<SeamlessTransfer />} />
                <Route path="/refiner" element={<PromptRefiner />} />
            </Routes>
        </Router>
    );
}

export default App;