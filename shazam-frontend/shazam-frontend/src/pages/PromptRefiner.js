import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import '../App.css';
import { smartFetch } from "../utils/api";


function PromptRefiner() {
    const navigate = useNavigate();
    const [inputPrompt, setInputPrompt] = useState('');
    const [refinedPrompt, setRefinedPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [improvements, setImprovements] = useState([]); // Add this
    const [qualityScore, setQualityScore] = useState(null); // Add this

    const handleRefine = async () => {
        if (!inputPrompt.trim()) {
            alert('Please enter a prompt to refine!');
            return;
        }

        setIsRefining(true);

        try {
            const response = await smartFetch("/api/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: inputPrompt })
            });

            if (!response.ok) throw new Error('Refinement failed');

            const data = await response.json();

            setRefinedPrompt(data.refinedPrompt);
            setImprovements(data.improvements || []);
            setQualityScore(data.qualityScore || 0);

            console.log('✅ Prompt refined successfully');
            console.log('Quality Score:', data.qualityScore);
            console.log('Improvements:', data.improvements);

        } catch (error) {
            console.error('Refinement error:', error);
            alert('Failed to refine prompt: ' + error.message);
        } finally {
            setIsRefining(false);
        }
    };

    const copyRefinedPrompt = () => {
        navigator.clipboard.writeText(refinedPrompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReset = () => {
        setInputPrompt('');
        setRefinedPrompt('');
        setImprovements([]);
        setQualityScore(null);
        setIsCopied(false);
    };

    return (
        <div className="app-container">
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    top: '2rem',
                    left: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    zIndex: 1000,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'translateX(-4px)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateX(0)';
                }}
            >
                <ArrowLeft size={20}/>
                Back to Home
            </button>

            <div className="luminous-card">
                <div className="content">
                    <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <Sparkles size={32} color="#a78bfa"/>
                            <h1 className="title" style={{margin: 0}}>Prompt Refiner</h1>
                        </div>
                        <p style={{color: '#aaa', fontSize: '0.95rem'}}>
                            Transform your prompts into powerful, well-structured queries
                        </p>
                    </div>

                    <div style={{marginBottom: '1.5rem'}}>
                        <label style={{
                            display: 'block',
                            color: '#ccc',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            Original Prompt
                        </label>
                        <textarea
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            placeholder="Enter your prompt here... e.g., 'write code for sorting'"
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #444',
                                background: 'rgba(255, 255, 255, 0.03)',
                                color: '#fff',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                        <button
                            onClick={handleRefine}
                            disabled={isRefining || !inputPrompt.trim()}
                            className="action-button upload-button"
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                opacity: (isRefining || !inputPrompt.trim()) ? 0.5 : 1
                            }}
                        >
                            <Sparkles size={20}/>
                            {isRefining ? 'Refining...' : 'Refine Prompt'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="action-button reset-button"
                            style={{
                                flex: 0,
                                minWidth: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <RefreshCw size={18}/>
                            Reset
                        </button>
                    </div>

                    {/* Refined Output */}
                    {refinedPrompt && (
                        <div>
                            {/* Refined Prompt Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.75rem'
                                }}>
                                    <label style={{
                                        color: '#ccc',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}>
                                        Refined Prompt
                                    </label>
                                    <button
                                        onClick={copyRefinedPrompt}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            background: isCopied
                                                ? 'rgba(34, 197, 94, 0.2)'
                                                : 'rgba(167, 139, 250, 0.2)',
                                            border: `1px solid ${isCopied
                                                ? 'rgba(34, 197, 94, 0.3)'
                                                : 'rgba(167, 139, 250, 0.3)'}`,
                                            borderRadius: '0.5rem',
                                            color: isCopied ? '#4ade80' : '#a78bfa',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCopied) {
                                                e.currentTarget.style.background = 'rgba(167, 139, 250, 0.3)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCopied) {
                                                e.currentTarget.style.background = 'rgba(167, 139, 250, 0.2)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check size={16} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Refined Prompt Content */}
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(167, 139, 250, 0.3)',
                                    background: 'rgba(167, 139, 250, 0.05)',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}>
                                    {refinedPrompt}
                                </div>
                            </div>

                            {/* Improvements Section - Separate */}
                            {improvements && improvements.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        color: '#ccc',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        marginBottom: '0.75rem'
                                    }}>
                                        ✨ Improvements Applied
                                    </label>
                                    <div style={{
                                        padding: '1.5rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(96, 165, 250, 0.3)',
                                        background: 'rgba(96, 165, 250, 0.05)',
                                    }}>
                                        {improvements.map((improvement, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    gap: '0.75rem',
                                                    marginBottom: index < improvements.length - 1 ? '0.75rem' : '0',
                                                    color: '#e0e0e0',
                                                    fontSize: '0.9rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                            <span style={{
                                color: '#60a5fa',
                                fontWeight: '600',
                                minWidth: '1.5rem'
                            }}>
                                {index + 1}.
                            </span>
                                                <span>{improvement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quality Score Section - Separate */}
                            {qualityScore !== null && (
                                <div>
                                    <label style={{
                                        display: 'block',
                                        color: '#ccc',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        marginBottom: '0.75rem'
                                    }}>
                                        📊 Quality Analysis
                                    </label>
                                    <div style={{
                                        padding: '1.5rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        background: 'rgba(34, 197, 94, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: '#aaa',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Prompt Quality Score
                                            </div>
                                            <div style={{
                                                fontSize: '2rem',
                                                fontWeight: '600',
                                                color: qualityScore >= 80 ? '#4ade80' :
                                                    qualityScore >= 60 ? '#fbbf24' : '#f87171'
                                            }}>
                                                {qualityScore}/100
                                            </div>
                                        </div>

                                        {/* Visual Score Bar */}
                                        <div style={{ flex: 1, maxWidth: '200px', marginLeft: '2rem' }}>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${qualityScore}%`,
                                                    height: '100%',
                                                    background: qualityScore >= 80
                                                        ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                                                        : qualityScore >= 60
                                                            ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                                            : 'linear-gradient(90deg, #f87171, #ef4444)',
                                                    transition: 'width 0.5s ease',
                                                    borderRadius: '4px'
                                                }} />
                                            </div>
                                            <div style={{
                                                marginTop: '0.5rem',
                                                fontSize: '0.75rem',
                                                color: '#888',
                                                textAlign: 'right'
                                            }}>
                                                {qualityScore >= 80 ? 'Excellent' :
                                                    qualityScore >= 60 ? 'Good' : 'Needs Work'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default PromptRefiner;