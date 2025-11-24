import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles } from 'lucide-react';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-card">
                {/* Header */}
                <div className="home-header">
                    <h1 className="home-title">
                        <span className="gradient-text">SHAZAM</span>

                    </h1>
                    <p className="home-subtitle">
                        Powerful tools for file sharing and AI assistance
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="features-grid">
                    {/* Seamless Transfer Card */}
                    <div
                        className="feature-card transfer-card"
                        onClick={() => navigate('/transfer')}
                    >
                        <div className="feature-icon transfer-icon">
                            <Upload size={40} />
                        </div>
                        <h2 className="feature-title">Seamless Transfer</h2>
                        <p className="feature-description">
                            Securely share files with ephemeral links and QR codes.
                            No account needed, 24-hour expiry.
                        </p>
                        <div className="feature-tags">
                            <span className="tag"> Secure</span>
                            <span className="tag"> Fast</span>
                            <span className="tag"> Mobile</span>
                        </div>
                        <button className="feature-button">
                            Start Transfer →
                        </button>
                    </div>

                    {/* Prompt Refiner Card */}
                    <div
                        className="feature-card refiner-card"
                        onClick={() => navigate('/refiner')}
                    >
                        <div className="feature-icon refiner-icon">
                            <Sparkles size={40} />
                        </div>
                        <h2 className="feature-title">Prompt Refiner</h2>
                        <p className="feature-description">
                            Enhance your prompts with intelligent suggestions.
                            Get better results from LLMs.
                        </p>
                        <div className="feature-tags">

                            <span className="tag"> Smart</span>
                            <span className="tag"> Enhanced</span>
                        </div>
                        <button className="feature-button">
                            Refine Prompts →
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="home-footer">
                    <p className="footer-text">
                        Built with using React & Spring Boot
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;