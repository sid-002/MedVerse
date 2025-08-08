import './ConsultationPage.css';

import React, { useState } from 'react';
import { MessageCircle, Video, Phone, Calendar, Clock, User, Star, Languages } from 'lucide-react';

const ConsultationPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

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

  const specialties = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology'
  ];

  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      languages: ['English', 'Spanish'],
      rating: 4.9,
      experience: '15 years',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Dr. Raj Patel',
      specialty: 'Cardiology',
      languages: ['English', 'Hindi', 'Tamil'],
      rating: 4.8,
      experience: '12 years',
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Dr. Maria Garcia',
      specialty: 'Dermatology',
      languages: ['English', 'Spanish', 'Portuguese'],
      rating: 4.9,
      experience: '10 years',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleBookConsultation = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert('Consultation booked successfully! You will receive a confirmation email shortly.');
  };

  const filteredDoctors = selectedSpecialty 
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : doctors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Consultation</h1>
          <p className="text-lg text-gray-600">Book multilingual consultations with healthcare professionals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Book Consultation</h2>
            </div>

            <div className="space-y-6">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Consultation Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'video', label: 'Video Call', icon: Video },
                    { id: 'phone', label: 'Phone Call', icon: Phone },
                    { id: 'chat', label: 'Text Chat', icon: MessageCircle }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <label key={type.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="consultationType"
                          value={type.id}
                          checked={consultationType === type.id}
                          onChange={(e) => setConsultationType(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-lg border-2 transition-all ${
                          consultationType === type.id
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-teal-300'
                        }`}>
                          <div className="flex flex-col items-center space-y-2">
                            <Icon className="w-6 h-6" />
                            <span className="font-medium text-sm">{type.label}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Specialty Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Doctor
                </label>
                <div className="space-y-3">
                  {filteredDoctors.map((doctor) => (
                    <label key={doctor.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="doctor"
                        value={doctor.id}
                        checked={selectedDoctor === doctor.id}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDoctor === doctor.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{doctor.rating}</span>
                              </div>
                              <span className="text-sm text-gray-600">{doctor.experience}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Languages className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {doctor.languages.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms/Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms or Reason for Consultation
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors"
                />
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookConsultation}
                className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Consultation</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Info */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-xs text-gray-600">30 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Languages className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Translation</p>
                    <p className="text-xs text-gray-600">Real-time interpretation available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Privacy</p>
                    <p className="text-xs text-gray-600">HIPAA compliant & secure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consultation Fee</span>
                  <span className="text-sm font-medium text-gray-900">$75</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Translation Service</span>
                  <span className="text-sm font-medium text-gray-900">$15</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-semibold text-teal-600">$90</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available 24/7 to assist you with booking or technical issues.
              </p>
              <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;