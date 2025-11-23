import React, { useState } from 'react';

// A simple progress bar component for the quality score
const QualityScoreBar = ({ score }) => {
    const getColor = (s) => {
        if (s < 40) return '#dc3545'; // red
        if (s < 75) return '#ffc107'; // yellow
        return '#28a745'; // green
    };

    return (
        <div>
            <strong style={{ display: 'block', marginBottom: '5px' }}>Quality Score: {score} / 100</strong>
            <div style={{
                height: '20px',
                width: '100%',
                backgroundColor: '#e9ecef',
                borderRadius: '5px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${score}%`,
                    backgroundColor: getColor(score),
                    transition: 'width 0.5s ease-in-out'
                }} />
            </div>
        </div>
    );
};

const PromptRefiner = () => {
    const [rawPrompt, setRawPrompt] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRefine = async () => {
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const apiResponse = await fetch('/api/prompt/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: rawPrompt }),
            });

            if (!apiResponse.ok) {
                throw new Error('The server returned an error.');
            }

            const data = await apiResponse.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '40px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>AI Prompt Refiner</h2>
            <textarea
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                placeholder="Enter a prompt to analyze and refine..."
                style={{ width: '100%', minHeight: '120px', padding: '12px', boxSizing: 'border-box', borderRadius: '5px', borderColor: '#ccc', fontSize: '16px' }}
            />
            <button
                onClick={handleRefine}
                disabled={isLoading}
                style={{ display: 'block', width: '100%', padding: '12px', marginTop: '10px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
            >
                {isLoading ? 'Analyzing...' : 'Refine Prompt'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}
            
            {response && (
                <div style={{ marginTop: '25px' }}>
                    <QualityScoreBar score={response.qualityScore} />

                    <h3 style={{ color: '#333', marginTop: '20px' }}>Refined Prompt:</h3>
                    <p style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', whiteSpace: 'pre-wrap', border: '1px solid #eee' }}>
                        {response.refinedPrompt}
                    </p>

                    <h3 style={{ color: '#333', marginTop: '20px' }}>Improvements Made:</h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {response.improvements.map((item, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PromptRefiner;
