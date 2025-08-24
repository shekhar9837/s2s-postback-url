'use client';

import { useEffect, useState } from 'react';
import { getAffiliates } from '../lib/api';

interface Affiliate {
  id: number;
  name: string;
}

export default function Home() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState<number | null>(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const data = await getAffiliates();
        setAffiliates(data || []);
      } catch (error) {
        console.error('Error fetching affiliates:', error);
        setAffiliates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  const handleAffiliateSelect = (affiliateId: number) => {
    setSelectedAffiliate(affiliateId);
    localStorage.setItem('affiliate_id', affiliateId.toString());
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading your affiliate accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Your Affiliate Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Select your affiliate account to access the dashboard and manage your campaigns
          </p>
        </div>

        {/* Affiliates Selection */}
        {affiliates.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 shadow-lg max-w-md mx-auto">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No affiliates available</h3>
              <p className="text-gray-500">Please contact support to get started</p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Account</h2>
              <p className="text-lg text-gray-600">Select the affiliate account you want to manage</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {affiliates.map((affiliate, index) => (
                <button
                  key={affiliate.id}
                  onClick={() => handleAffiliateSelect(affiliate.id)}
                  className={`group relative p-6 bg-white rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-in fade-in-0 slide-in-from-bottom-4 ${
                    selectedAffiliate === affiliate.id
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      selectedAffiliate === affiliate.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white group-hover:scale-110'
                    }`}>
                      {affiliate.id}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-lg text-gray-900 mb-1">
                        {affiliate.name}
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        selectedAffiliate === affiliate.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        Affiliate #{affiliate.id}
                      </div>
                    </div>
                  </div>
                  {selectedAffiliate === affiliate.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                      <span className="text-blue-600 font-bold text-sm">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Available Features</h3>
            <p className="text-lg text-gray-600">Everything you need to manage your affiliate marketing effectively</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Dashboard Analytics</h4>
              <p className="text-gray-600 leading-relaxed">View your clicks and conversions in real-time with comprehensive analytics and insights</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔗</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Postback URLs</h4>
              <p className="text-gray-600 leading-relaxed">Generate and manage postback URLs for seamless advertiser integration</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Performance Tracking</h4>
              <p className="text-gray-600 leading-relaxed">Track affiliate performance metrics and optimize your campaigns for better results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}