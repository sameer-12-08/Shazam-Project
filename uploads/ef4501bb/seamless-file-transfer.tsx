import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Link, CheckCircle } from 'lucide-react';

export default function LuminousFileTransfer() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLumenActive, setIsLumenActive] = useState(false);
  const fileInputRef = useRef(null);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    if (downloadUrl && qrCanvasRef.current) {
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
      (newFile) => !files.some((existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size)
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
      // Simulate progress for UI feedback
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.progress < 90) {
            return { ...f, progress: Math.min(f.progress + 10, 90) };
          }
          return f;
        }));
      }, 200);

      // Spring Boot backend endpoint
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      // Complete progress to 100%
      setFiles(prev => prev.map(f => ({ ...f, progress: 100 })));
      
      // The backend returns { url: "http://localhost:8080/d/abc123" }
      setDownloadUrl(data.url);
      setUploadState('success');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + err.message);
      setUploadState('idle');
      setIsLumenActive(false);
      // Reset progress on error
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
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      <style>{`
        @font-face {
          font-family: "Aeonik Pro Regular";
          src: url("https://db.onlinewebfonts.com/t/12ff62164c9778917bddb93c6379cf47.eot");
          src: url("https://db.onlinewebfonts.com/t/12ff62164c9778917bddb93c6379cf47.eot?#iefix") format("embedded-opentype"),
            url("https://db.onlinewebfonts.com/t/12ff62164c9778917bddb93c6379cf47.woff2") format("woff2"),
            url("https://db.onlinewebfonts.com/t/12ff62164c9778917bddb93c6379cf47.woff") format("woff"),
            url("https://db.onlinewebfonts.com/t/12ff62164c9778917bddb93c6379cf47.ttf") format("truetype"),
            url("https://db.onlinewebfonts.com/t/12ff62164c9778917bddb93c6379cf47.svg#Aeonik Pro Regular") format("svg");
        }
        
        .luminous-transfer {
          font-family: "Aeonik Pro Regular", -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 luminous-transfer" style={{
        background: 'radial-gradient(circle at 50% 30%, #2a2a2a 0%, #131313 64%)'
      }}>
        <div 
          className="relative"
          style={{
            background: 'radial-gradient(circle at 50% 0%, #3a3a3a 0%, #1a1a1a 64%)',
            boxShadow: isLumenActive 
              ? 'inset 0 1.01rem 0.1rem -1rem rgba(255, 255, 255, 0.67), inset 0 -4rem 3rem -3rem rgba(0, 0, 0, 0.67), 0 -1.02rem 0.2rem -1rem rgba(255, 255, 255, 0.67), 0 1rem 0.2rem -1rem #0000, 0 0 0 1px rgba(255, 255, 255, 0.13), 0 4px 4px 0 rgba(0, 0, 0, 0.27), 0 0 0 1px #333'
              : 'inset 0 1.01rem 0.2rem -1rem rgba(255, 255, 255, 0), inset 0 -1.01rem 0.2rem -1rem rgba(0, 0, 0, 0), 0 -1.02rem 0.2rem -1rem rgba(255, 255, 255, 0), 0 1rem 0.2rem -1rem rgba(0, 0, 0, 0), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 4px 4px 0 rgba(0, 0, 0, 0.27), 0 0 0 1px #333',
            width: '90vw',
            maxWidth: '48rem',
            minHeight: '32rem',
            borderRadius: '1.8rem',
            color: '#fff',
            padding: '2rem',
            transition: 'all 0.4s ease-in-out',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-0.2rem)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {/* Outer border decoration */}
          <div style={{
            content: '""',
            display: 'block',
            width: 'calc(100% + 2rem)',
            height: 'calc(100% + 2rem)',
            position: 'absolute',
            left: '-1rem',
            top: '-1rem',
            boxShadow: 'inset 0 0 0px 0.06rem rgba(255, 255, 255, 0.13)',
            borderRadius: '2.6rem',
            clipPath: 'polygon(4rem 0, 0 0, 0 4rem, 4rem 4rem, 4rem calc(100% - 4rem), 0 calc(100% - 4rem), 0 100%, 4rem 100%, 4rem calc(100% - 4rem), calc(100% - 4rem) calc(100% - 4rem), calc(100% - 4rem) 100%, 100% 100%, 100% calc(100% - 4rem), calc(100% - 4rem) calc(100% - 4rem), calc(100% - 4rem) 4rem, 100% 4rem, 100% 0, calc(100% - 4rem) 0, calc(100% - 4rem) 4rem, 4rem 4rem)',
            transition: 'all 0.4s ease-in-out',
            pointerEvents: 'none'
          }} />

          {/* Light layer */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            transformStyle: 'preserve-3d',
            perspective: '400px',
            pointerEvents: 'none',
            borderRadius: '1.8rem',
            overflow: 'hidden'
          }}>
            {/* Light slit */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              margin: 'auto',
              width: '64%',
              height: '1.2rem',
              transform: 'rotateX(-76deg)',
              background: isLumenActive ? '#fff' : '#121212',
              boxShadow: isLumenActive ? '0 0 4px 0 #fff' : '0 0 4px 0 rgba(255, 255, 255, 0)',
              transition: 'all 0.4s ease-in-out'
            }} />

            {/* Lumen layers */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              margin: 'auto',
              width: '100%',
              height: '100%',
              perspective: '400px',
              opacity: isLumenActive ? 0.5 : 0,
              transition: 'opacity 0.4s ease-in-out'
            }}>
              <div style={{
                width: '70%',
                height: '3rem',
                background: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.67))',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: '2.5rem',
                margin: 'auto',
                transform: 'rotateX(-42deg)',
                opacity: 0.4
              }} />
              <div style={{
                width: '74%',
                height: '13rem',
                background: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.67))',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: '10rem',
                margin: 'auto',
                transform: 'rotateX(-42deg)',
                filter: 'blur(1rem)',
                opacity: 0.8,
                borderRadius: '100% 100% 0 0'
              }} />
              <div style={{
                width: '50%',
                height: '13rem',
                background: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.67))',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: '12rem',
                margin: 'auto',
                transform: 'rotateX(22deg)',
                filter: 'blur(1rem)',
                opacity: 0.6,
                borderRadius: '100% 100% 0 0'
              }} />
            </div>

            {/* Darken layers */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              margin: 'auto',
              width: '100%',
              height: '100%',
              perspective: '400px',
              transition: 'opacity 0.4s ease-in-out',
              opacity: isLumenActive ? 0.8 : 0.5
            }}>
              <div style={{
                width: '64%',
                height: '10rem',
                background: 'linear-gradient(#000, rgba(0, 0, 0, 0))',
                position: 'absolute',
                left: 0,
                right: 0,
                top: '9.6rem',
                bottom: 0,
                margin: 'auto',
                filter: 'blur(0.2rem)',
                opacity: isLumenActive ? 0.2 : 0.1,
                borderRadius: '0 0 100% 100%',
                transform: 'rotateX(-22deg)',
                transition: 'opacity 0.4s ease-in-out'
              }} />
              <div style={{
                width: '62%',
                height: '10rem',
                background: 'linear-gradient(rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0))',
                position: 'absolute',
                left: 0,
                right: 0,
                top: '11rem',
                bottom: 0,
                margin: 'auto',
                filter: 'blur(0.8rem)',
                opacity: isLumenActive ? 1 : 0.4,
                borderRadius: '0 0 100% 100%',
                transform: 'rotateX(22deg)',
                transition: 'opacity 0.4s ease-in-out'
              }} />
            </div>
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="text-3xl font-light text-center mb-8" style={{ color: '#ccc' }}>
              {uploadState === 'success' ? 'Transfer Ready' : 'Seamless Transfer'}
            </h1>

            {uploadState !== 'success' ? (
              <>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-blue-400 bg-blue-900 bg-opacity-20' : 'border-gray-600'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-4" style={{
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      <Upload className="w-8 h-8 text-blue-400" />
                    </div>
                    <p style={{ color: '#aaa' }}>
                      Drag and drop or{' '}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        browse
                      </button>{' '}
                      your files
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
                    {files.map(fileObj => (
                      <div key={fileObj.id} className="border rounded-lg p-4" style={{
                        borderColor: '#444',
                        backgroundColor: 'rgba(255,255,255,0.03)'
                      }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444'
                          }}>
                            <span className="text-xs font-medium" style={{ color: '#888' }}>
                              {getFileExtension(fileObj.name)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate" style={{ color: '#ccc' }}>
                                {fileObj.name}
                              </p>
                              {uploadState !== 'uploading' && (
                                <button
                                  onClick={() => removeFile(fileObj.id)}
                                  className="text-gray-500 hover:text-gray-300 flex-shrink-0 ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs" style={{ color: '#666' }}>
                                {formatFileSize(fileObj.size)}
                              </p>
                              {uploadState === 'uploading' && fileObj.progress < 100 && (
                                <p className="text-xs text-blue-400">
                                  Uploading... {fileObj.progress}%
                                </p>
                              )}
                              {uploadState === 'uploading' && fileObj.progress === 100 && (
                                <p className="text-xs text-green-400">
                                  Uploaded!
                                </p>
                              )}
                            </div>
                            {uploadState === 'uploading' && (
                              <div className="mt-2 rounded-full h-1 overflow-hidden" style={{ backgroundColor: '#333' }}>
                                <div
                                  className="h-full transition-all duration-300"
                                  style={{ 
                                    width: `${fileObj.progress}%`,
                                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto" style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                }}>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-light mb-2" style={{ color: '#ccc' }}>Files Ready!</h2>
                <p className="mb-8" style={{ color: '#888' }}>Scan the QR code or copy the link to download your files.</p>

                <div className="my-8 flex justify-center">
                  <div ref={qrCanvasRef} className="inline-block p-4 rounded-lg" style={{
                    backgroundColor: 'white',
                    border: '2px solid #444'
                  }}></div>
                </div>

                <div className="relative rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm truncate pr-10" style={{ color: '#aaa' }}>{downloadUrl}</p>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                    title="Copy link"
                  >
                    <Link className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#555' }}>Link will expire in 24 hours (or after first download).</p>
              </div>
            )}

            <div className="mt-8">
              {uploadState === 'success' ? (
                <button
                  className="w-full font-medium py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: '#555',
                    color: '#fff',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#666'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555'}
                  onClick={handleReset}
                >
                  Upload More Files
                </button>
              ) : (
                <button
                  className="w-full font-medium py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: files.length === 0 || uploadState === 'uploading' ? '#334' : '#3b82f6',
                    color: '#fff',
                    boxShadow: files.length === 0 || uploadState === 'uploading' 
                      ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(59, 130, 246, 0.3)',
                    cursor: files.length === 0 || uploadState === 'uploading' ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (files.length > 0 && uploadState !== 'uploading') {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (files.length > 0 && uploadState !== 'uploading') {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                    }
                  }}
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
    </>
  );
}