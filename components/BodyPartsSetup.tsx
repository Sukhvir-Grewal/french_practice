'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface BodyPartsSetupProps {
  slug: string;
  title: string;
}

export function BodyPartsSetup({ slug, title }: BodyPartsSetupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'face' | 'internal' | 'mixed'>('mixed');

  const handleStart = () => {
    const params = new URLSearchParams(searchParams);
    params.set('bodyPartsMode', selectedCategory);
    router.push(`/deck/${slug}?${params.toString()}`);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 30px 0', color: '#333', fontSize: '28px' }}>
          🏥 {title}
        </h1>
        
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
          Choose a category to practice:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          {[
            { value: 'basic' as const, label: '👤 Basic Body', desc: 'Head, arms, legs, etc.' },
            { value: 'face' as const, label: '👁️ Face', desc: 'Eyes, nose, mouth, etc.' },
            { value: 'internal' as const, label: '❤️ Internal Organs', desc: 'Heart, lungs, brain, etc.' },
            { value: 'mixed' as const, label: '🎲 Mixed Practice', desc: 'All categories together' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedCategory(option.value)}
              style={{
                padding: '16px 20px',
                background: selectedCategory === option.value ? '#667eea' : '#f0f0f0',
                color: selectedCategory === option.value ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: selectedCategory === option.value ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== option.value) {
                  e.currentTarget.style.background = '#e8e8e8';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== option.value) {
                  e.currentTarget.style.background = '#f0f0f0';
                }
              }}
            >
              <span>{option.label}</span>
              <span style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                {option.desc}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          style={{
            padding: '14px 40px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s ease',
            marginBottom: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#5568d3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#667eea';
          }}
        >
          Start Practice
        </button>

        <p style={{ color: '#999', fontSize: '12px', margin: '0' }}>
          You can change categories anytime
        </p>
      </div>
    </div>
  );
}
