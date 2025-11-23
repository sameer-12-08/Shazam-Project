import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Link, CheckCircle } from 'lucide-react';
import './App.css';
import PromptRefiner from './PromptRefiner';

function App() {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadState, setUploadState] = useState('idle');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [isLumenActive, setIsLumenActive] = useState(false);
    const fileInputRef = useRef(null);
    const qrCanvasRef = useRef(null);

    useEffect(() => {
        if (downloadUrl && qrCanvasRef.current) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.onload = () => {
                const QRCode = window.QRCode;
                if (QRCode) {
                    qrCanvasRef.current.innerHTML = '';
                    new QRCode(qrCanvasRef.current, {
                        text: downloadUrl,
                        width: 192,
                        height: 192,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            };
            document.body.appendChild(script);
        }
    }, [downloadUrl]);

    const handleDragOver = (e) => {
        e.preventDefault();
        if (uploadState !== 'uploading') {
            setUploadState('idle');
        }
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
        e.target.value = null;
    };

    const addFiles = (newFiles) => {
        const uniqueNewFiles = newFiles.filter(
            (newFile) => !files.some((existingFile) =>
                existingFile.name === newFile.name && existingFile.size === newFile.size)
        );

        const filesWithProgress = uniqueNewFiles.map(file => ({
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            id: Math.random().toString(36).substr(2, 9)
        }));
        setFiles(prev => [...prev, ...filesWithProgress]);
        setUploadState('idle');
        setDownloadUrl('');
    };

    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploadState('uploading');
        setIsLumenActive(true);

        const formData = new FormData();
        files.forEach(f => formData.append('files', f.file));

        try {
            const progressInterval = setInterval(() => {
                setFiles(prev => prev.map(f => {
                    if (f.progress < 90) {
                        return { ...f, progress: Math.min(f.progress + 10, 90) };
                    }
                    return f;
                }));
            }, 200);

            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFiles(prev => prev.map(f => ({ ...f, progress: 100 })));
            setDownloadUrl(data.url);
            setUploadState('success');
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed: ' + err.message);
            setUploadState('idle');
            setIsLumenActive(false);
            setFiles(prev => prev.map(f => ({ ...f, progress: 0 })));
        }
    };

    const handleReset = () => {
        setFiles([]);
        setDownloadUrl('');
        setUploadState('idle');
        setIsLumenActive(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(downloadUrl);
        alert('Link copied to clipboard!');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toUpperCase();
    };

    return (
        <div className = "App">
            <header className="App-header">
                <h1>Shazam File Sharing
                </h1>
            </header>
            
        </div>
        <div className="app-container">
            <div className="luminous-card"
                 style={{ transform: isLumenActive ? 'translateY(-0.5rem)' : 'translateY(0)' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-0.2rem)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = isLumenActive ? 'translateY(-0.2rem)' : 'translateY(0)'}
            >
                <div className="outer-border" />

                <div className="light-layer">
                    <div className="light-slit" style={{
                        background: isLumenActive ? '#fff' : '#121212',
                        boxShadow: isLumenActive ? '0 0 4px 0 #fff' : '0 0 4px 0 rgba(255, 255, 255, 0)',
                    }} />

                    <div className="lumen-layers" style={{ opacity: isLumenActive ? 0.5 : 0 }}>
                        <div className="lumen-layer-1" />
                        <div className="lumen-layer-2" />
                        <div className="lumen-layer-3" />
                    </div>

                    <div className="darken-layers" style={{ opacity: isLumenActive ? 0.8 : 0.5 }}>
                        <div className="darken-layer-1" style={{ opacity: isLumenActive ? 0.2 : 0.1 }} />
                        <div className="darken-layer-2" style={{ opacity: isLumenActive ? 1 : 0.4 }} />
                    </div>
                </div>

                <div className="content">
                    <h1 className="title">
                        {uploadState === 'success' ? 'Transfer Ready' : 'Seamless Transfer'}
                    </h1>

                    {uploadState !== 'success' ? (
                        <>
                            <div
                                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="drop-zone-content">
                                    <div className="upload-icon">
                                        <Upload size={32} />
                                    </div>
                                    <p className="drop-text">
                                        Drag and drop or{' '}
                                        <button onClick={() => fileInputRef.current?.click()} className="browse-button">
                                            browse
                                        </button>{' '}
                                        your files
                                    </p>
                                    <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="files-list">
                                    {files.map(fileObj => (
                                        <div key={fileObj.id} className="file-item">
                                            <div className="file-icon">
                                                <span className="file-extension">{getFileExtension(fileObj.name)}</span>
                                            </div>
                                            <div className="file-details">
                                                <div className="file-header">
                                                    <p className="file-name">{fileObj.name}</p>
                                                    {uploadState !== 'uploading' && (
                                                        <button onClick={() => removeFile(fileObj.id)} className="remove-button">
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="file-meta">
                                                    <p className="file-size">{formatFileSize(fileObj.size)}</p>
                                                    {uploadState === 'uploading' && fileObj.progress < 100 && (
                                                        <p className="upload-status">Uploading... {fileObj.progress}%</p>
                                                    )}
                                                    {uploadState === 'uploading' && fileObj.progress === 100 && (
                                                        <p className="upload-complete">Uploaded!</p>
                                                    )}
                                                </div>
                                                {uploadState === 'uploading' && (
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${fileObj.progress}%` }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="success-screen">
                            <div className="success-icon">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="success-title">Files Ready for Transfer!</h2>
                            <p className="success-text">
                                Your files are ready. Download them now or share the link.
                            </p>

                            {/* Direct Download Button */}
                            <a
                                href={downloadUrl}
                                className="action-button upload-button"
                                style={{
                                    display: 'inline-block',
                                    textDecoration: 'none',
                                    textAlign: 'center',
                                    marginBottom: '2rem',
                                    padding: '1rem 2rem',
                                    width: 'auto',
                                    minWidth: '250px',
                                    fontSize: '1.1rem'
                                }}
                                onClick={() => {
                                    console.log('📥 Download initiated:', downloadUrl);
                                }}
                            >
                                📥 Download Files Now
                            </a>

                            {/* QR Code Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{
                                    color: '#888',
                                    fontSize: '0.9rem',
                                    marginBottom: '1rem',
                                    fontWeight: '300'
                                }}>
                                    Or scan with your phone:
                                </p>
                                <div className="qr-container">
                                    <div ref={qrCanvasRef} className="qr-code"></div>
                                </div>
                            </div>

                            {/* Shareable Link */}
                            <div className="url-container">
                                <input
                                    type="text"
                                    value={downloadUrl}
                                    readOnly
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#aaa',
                                        fontSize: '0.875rem',
                                        width: '100%',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        paddingRight: '2.5rem'
                                    }}
                                    onClick={(e) => {
                                        e.target.select();
                                        copyToClipboard();
                                    }}
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="copy-button"
                                    title="Copy link"
                                >
                                    <Link size={20} />
                                </button>
                            </div>

                            <p className="expiry-notice">
                                🔒 Link expires in 24 hours • Files are securely stored
                            </p>
                        </div>
                    )}

                    <div className="action-button-container">
                        {uploadState === 'success' ? (
                            <button className="action-button reset-button" onClick={handleReset}>
                                Upload More Files
                            </button>
                        ) : (
                            <button
                                className={`action-button upload-button ${files.length === 0 || uploadState === 'uploading' ? 'disabled' : ''}`}
                                onClick={handleUpload}
                                disabled={files.length === 0 || uploadState === 'uploading'}
                            >
                                {uploadState === 'uploading' ? 'Uploading...' : 'Generate Link'}
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;