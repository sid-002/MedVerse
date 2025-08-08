import React, { useState, useRef } from 'react';
import { Camera, CameraOff, Play, Square, RotateCcw, Download } from 'lucide-react';

const SignLanguagePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      setIsRecording(false);
      setInterpretation('');
      setIsProcessing(false);
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const toggleRecording = async () => {
    if (!isCameraOn) {
      await startCamera();
      return;
    }

    if (isRecording) {
      // Stop recording and send snapshot to backend
      setIsRecording(false);
      setIsProcessing(true);
      setInterpretation('');

      const frameBase64 = captureFrame();
      if (!frameBase64) {
        setInterpretation('Failed to capture image from camera.');
        setIsProcessing(false);
        setCapturedImage(null);
        return;
}
      setCapturedImage(frameBase64);  // Save captured image for preview


      try {
        const response = await fetch('http://localhost:5000/sign_interpret', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: frameBase64 }),
        });
        const data = await response.json();

        if (data.error) {
          setInterpretation('Error: ' + data.error);
        } else {
          setInterpretation(data.predicted_label || 'No interpretation received');
        }
      } catch (e) {
        console.error(e);
        setInterpretation('Failed to communicate with backend.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Start recording
      setIsRecording(true);
      setInterpretation('');
    }
  };

  const resetSession = () => {
    setInterpretation('');
    setIsRecording(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign Language Interpreter</h1>
          <p className="text-lg text-gray-600">Real-time sign language to text interpretation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">Camera Feed</h2>
              </div>
              <div className="flex items-center space-x-2">
                {isRecording && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}
                {capturedImage && (
  <div className="mt-4">
    <h3 className="text-gray-700 mb-1 font-semibold">Captured Snapshot (sent to backend):</h3>
    <img
      src={capturedImage}
      alt="Captured snapshot"
      className="border border-gray-300 rounded max-w-full"
      style={{ maxHeight: 240 }}
    />
  </div>
)}

                {isProcessing && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Processing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Frame */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror effect
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Camera Not Active</p>
                    <p className="text-sm opacity-75">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}

              {/* Recording overlay */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>REC</span>
                </div>
              )}

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Processing Sign Language...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex flex-wrap gap-3">
              {!isCameraOn ? (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      isRecording
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Recording</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={stopCamera}
                    className="bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CameraOff className="w-4 h-4" />
                    <span>Stop Camera</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Interpretation Results */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">→</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Interpretation Result</h2>
              </div>
              {interpretation && (
                <button
                  onClick={resetSession}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Reset session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
              {interpretation ? (
                <div className="w-full">
                  <div className="text-sm text-teal-600 font-medium mb-4">
                    Sign Language → English Text
                  </div>
                  <div className="text-gray-800 leading-relaxed text-lg">
                    {interpretation}
                  </div>
                  {/* You can update confidence and processing time below with real data if available */}
                  <div className="mt-4 text-xs text-gray-500">
                    Confidence: 94% • Processing time: 2.3s
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">Interpretation will appear here</p>
                  <p className="text-sm">Start recording to begin sign language interpretation</p>
                </div>
              )}
            </div>

            {interpretation && (
              <div className="mt-4 flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <span>Copy Text</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use Sign Language Interpreter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📹</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Start Camera</h4>
              <p className="text-gray-600 text-sm">Allow camera access and position yourself in the frame</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✋</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Sign Clearly</h4>
              <p className="text-gray-600 text-sm">Use clear, deliberate sign language gestures</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Get Results</h4>
              <p className="text-gray-600 text-sm">View the interpreted text and save or copy as needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignLanguagePage;
