import React from 'react';
import { Link } from 'react-router-dom';
import { Languages, Camera, Upload, MessageCircle, ArrowRight, Shield, Clock, Globe } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Languages,
      title: 'MediVerse',
      description: 'Translate medical texts, symptoms, prescriptions, and diagnoses across multiple languages',
      link: '/translation',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: Camera,
      title: 'Sign Language',
      description: 'Real-time sign language interpretation for deaf and hard-of-hearing patients',
      link: '/sign-language',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Upload,
      title: 'Prescription Upload',
      description: 'Upload and translate prescription documents with OCR technology',
      link: '/prescription',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Medical Consultation',
      description: 'Connect with healthcare professionals for multilingual medical consultations',
      link: '/consultation',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'End-to-end encryption ensures patient data privacy and security'
    },
    {
      icon: Clock,
      title: 'Real-time Processing',
      description: 'Instant translations for emergency and urgent medical situations'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Support for 50+ languages including regional dialects'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Breaking Language Barriers in
            <span className="text-teal-600 block">Healthcare</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive medical translation suite designed for healthcare professionals and patients. 
            Translate medical documents, communicate through sign language, and consult with doctors across languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/translation"
              className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Languages className="w-5 h-5" />
              <span>Start Translating</span>
            </Link>
            <Link
              to="/consultation"
              className="bg-white text-teal-600 border-2 border-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Book Consultation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">Comprehensive healthcare communication solutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-teal-600 font-medium text-sm group-hover:text-teal-700">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MedTranslate?</h2>
            <p className="text-lg text-gray-600">Trusted by healthcare professionals worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Healthcare Communication?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of healthcare professionals using MedTranslate to provide better patient care.
          </p>
          <Link
            to="/translation"
            className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;