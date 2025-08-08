import React, { useState, useRef } from 'react';
import { Upload, FileText, Camera, X, Eye, Download, Languages } from 'lucide-react';

const PrescriptionPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('ta');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ta', name: 'Tamil' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      processFiles(validFiles);
    }
  };

  const processFiles = (files: File[]) => {
    setIsProcessing(true);
    setExtractedText('');
    
    // Simulate OCR processing
    setTimeout(() => {
      const mockExtractedText = `PRESCRIPTION

Dr. Sarah Johnson, MD
Internal Medicine Specialist
Medical License: #12345

Patient: John Smith
DOB: 01/15/1980
Date: ${new Date().toLocaleDateString()}

Rx:
1. Metformin 500mg
   - Take twice daily with meals
   - Quantity: 60 tablets
   - Refills: 2

2. Lisinopril 10mg
   - Take once daily in the morning
   - Quantity: 30 tablets
   - Refills: 3

3. Atorvastatin 20mg
   - Take once daily at bedtime
   - Quantity: 30 tablets
   - Refills: 2

Instructions:
- Take medications as prescribed
- Monitor blood pressure daily
- Follow up in 3 months
- Contact office if side effects occur

Dr. Sarah Johnson
Signature: [Signed]`;

      setExtractedText(mockExtractedText);
      setIsProcessing(false);
    }, 3000);
  };

  const handleTranslate = () => {
    if (!extractedText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation
    setTimeout(() => {
      const selectedLang = languages.find(l => l.code === targetLanguage);
      setTranslatedText(`[Translated to ${selectedLang?.name}]\n\n${extractedText}\n\n(This is a demo - actual translation would be handled by backend services)`);
      setIsTranslating(false);
    }, 2000);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setExtractedText('');
      setTranslatedText('');
    }
  };

  const capturePhoto = () => {
    // This would open camera interface
    alert('Camera capture functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Prescription Upload & Translation</h1>
          <p className="text-lg text-gray-600">Upload prescription images or PDFs for text extraction and translation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Upload Prescription</h2>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop prescription files here
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    or click to browse (JPG, PNG, PDF)
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Browse Files</span>
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Processing prescription...</p>
                    <p className="text-xs text-blue-700">Extracting text using OCR technology</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Eye className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Extracted Text</h2>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4 min-h-[300px] mb-6">
              {extractedText ? (
                <div className="w-full">
                  <div className="text-sm text-teal-600 font-medium mb-3">
                    Extracted from prescription document
                  </div>
                  <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {extractedText}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <div>
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Extracted text will appear here</p>
                    <p className="text-sm">Upload a prescription to get started</p>
                  </div>
                </div>
              )}
            </div>

            {/* Translation Section */}
            {extractedText && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Translation</h3>
                  </div>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 mb-4"
                >
                  {isTranslating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Languages className="w-4 h-4" />
                      <span>Translate Prescription</span>
                    </>
                  )}
                </button>

                {translatedText && (
                  <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
                    <div className="text-sm text-teal-600 font-medium mb-3">
                      Translated to {languages.find(l => l.code === targetLanguage)?.name}
                    </div>
                    <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                      {translatedText}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {extractedText && (
              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Copy Text
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Prescription Processing Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">OCR Technology</h4>
              <p className="text-gray-600 text-sm">Advanced optical character recognition for accurate text extraction</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌐</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Multi-language Support</h4>
              <p className="text-gray-600 text-sm">Translate prescriptions to multiple languages instantly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile Friendly</h4>
              <p className="text-gray-600 text-sm">Take photos directly or upload from your device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;