import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Languages, ArrowRight } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' }
];

const medicalInputTypes = [
  { id: 'symptom', label: 'Symptom Description', icon: '🩺' },
  { id: 'prescription', label: 'Prescription', icon: '💊' },
  { id: 'diagnosis', label: 'Diagnosis', icon: '📋' },
  { id: 'general', label: 'General Medical Question', icon: '❓' }
];

const TranslationPage = () => {
  const [inputLanguage, setInputLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [medicalType, setMedicalType] = useState('symptom');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Ref to hold the SpeechRecognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Browser doesn't support speech recognition
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = inputLanguage; // set recognition language to inputLanguage
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      // Append final results to inputText, show interim on UI if desired
      if (finalTranscript) {
        setInputText(prev => (prev + ' ' + finalTranscript).trim());
      }
    };

    recognition.onerror = (event) => {
      setErrorMessage(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
      recognition.stop();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

  }, [inputLanguage]); // reset recognition if inputLanguage changes

  const toggleRecording = () => {
    setErrorMessage('');
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!recognitionRef.current) {
        setErrorMessage('Speech recognition is not supported.');
        return;
      }
      recognitionRef.current.lang = inputLanguage; // update language before start
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setTranslatedText('');
    setAudioUrl('');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          source_lang: inputLanguage,
          target_lang: targetLanguage,
          input_type: medicalType,
        }),
      });

      if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);

      const data = await response.json();
      setTranslatedText(data.translated_text || 'No translation received');
      setAudioUrl(data.audio_url ? `http://localhost:5000${data.audio_url}` : '');
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Translation</h1>
          <p className="text-lg text-gray-600">Translate medical texts with professional accuracy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Languages className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Input & Settings</h2>
            </div>

            {/* Language Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input Language</label>
                <select
                  value={inputLanguage}
                  onChange={e => setInputLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Language</label>
                <select
                  value={targetLanguage}
                  onChange={e => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medical Input Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Medical Input Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {medicalInputTypes.map(type => (
                  <label key={type.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="medicalType"
                      value={type.id}
                      checked={medicalType === type.id}
                      onChange={e => setMedicalType(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-lg border-2 transition-all ${
                        medicalType === type.id
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium text-sm">{type.label}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Text input, recording toggle, translate button, error message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Text Input</label>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Enter your medical text here (symptoms, prescription details, diagnosis, or medical questions)..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors"
                />
                <button
                  onClick={toggleRecording}
                  className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              {isRecording && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording...</span>
                </div>
              )}
            </div>

            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isTranslating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Translate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {errorMessage && <p className="text-red-600 mt-3 font-medium text-center">{errorMessage}</p>}
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">→</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Translation Result</h2>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6 min-h-[300px] flex flex-col justify-center">
              {translatedText ? (
                <>
                  <div className="text-sm text-teal-600 font-medium mb-2">
                    {languages.find(l => l.code === inputLanguage)?.name} → {languages.find(l => l.code === targetLanguage)?.name}
                  </div>
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">{translatedText}</div>
                  {audioUrl && (
                    <audio controls src={audioUrl} className="w-full">
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Languages className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">Translation will appear here</p>
                  <p className="text-sm">Enter medical text and click translate to get started</p>
                </div>
              )}
            </div>

            {translatedText && (
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => navigator.clipboard.writeText(translatedText)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Copy Translation
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                  Save Result
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
