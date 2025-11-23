import React, { useState } from 'react';

const PromptRefiner = () => {
    const [rawPrompt, setRawPrompt] = useState('');
    const [refinedPrompt, setRefinedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRefine = async () => {
        setIsLoading(true);
        setError(null);
        setRefinedPrompt('');

        try {
            const response = await fetch('/api/prompt/refine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: rawPrompt }),
            });

            if (!response.ok) {
                throw new Error('Something went wrong with the API call.');
            }

            const data = await response.json();
            setRefinedPrompt(data.refinedPrompt);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px', 
            margin: '40px auto', 
            padding: '20px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Prompt Refiner</h2>
            <textarea
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                style={{ 
                    width: '100%', 
                    minHeight: '100px', 
                    padding: '10px', 
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    borderColor: '#ccc'
                }}
            />
            <button
                onClick={handleRefine}
                disabled={isLoading}
                style={{ 
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    marginTop: '10px',
                    backgroundColor: isLoading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {isLoading ? 'Refining...' : 'Refine Prompt'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
            
            {refinedPrompt && (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ color: '#333' }}>Refined Prompt:</h3>
                    <p style={{ 
                        background: '#f7f7f7', 
                        padding: '15px', 
                        borderRadius: '4px', 
                        whiteSpace: 'pre-wrap' 
                    }}>
                        {refinedPrompt}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PromptRefiner;
