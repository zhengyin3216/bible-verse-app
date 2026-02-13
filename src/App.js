import React, { useState } from 'react';
import { BookOpen, Heart, Sparkles, MessageCircle, Search, Loader } from 'lucide-react';

export default function BibleVerseApp() {
  const [customSituation, setCustomSituation] = useState('');
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const situations = [
    { id: 'comfort', label: '위로가 필요할 때', icon: '💙', gradient: 'from-blue-50 to-indigo-50' },
    { id: 'anxiety', label: '불안하고 두려울 때', icon: '🕊️', gradient: 'from-purple-50 to-pink-50' },
    { id: 'gratitude', label: '감사할 때', icon: '🙏', gradient: 'from-amber-50 to-orange-50' },
    { id: 'decision', label: '결정이 필요할 때', icon: '🛤️', gradient: 'from-teal-50 to-cyan-50' },
    { id: 'strength', label: '힘이 필요할 때', icon: '💪', gradient: 'from-green-50 to-emerald-50' },
    { id: 'forgiveness', label: '용서하고 싶을 때', icon: '🤍', gradient: 'from-slate-50 to-gray-50' },
    { id: 'hope', label: '희망이 필요할 때', icon: '🌟', gradient: 'from-yellow-50 to-amber-50' },
    { id: 'love', label: '사랑에 대해 알고 싶을 때', icon: '❤️', gradient: 'from-rose-50 to-red-50' },
  ];

  const getVerse = async (situation) => {
    setLoading(true);
    setVerse(null);

    const situationText = situation === 'custom' ? customSituation : 
                          situations.find(s => s.id === situation)?.label || situation;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `사용자가 "${situationText}" 상황에 있습니다. 
              
이 상황에 가장 적합한 성경 구절 하나를 찾아주세요. 그리고 다음 정보를 JSON 형식으로 제공해주세요:

{
  "reference": "책 장:절 (예: 시편 23:1)",
  "text": "성경 구절 원문",
  "context": "이 구절이 나온 성경의 앞뒤 문맥과 배경 설명 (2-3 문장)",
  "meaning": "이 구절이 현재 상황에 어떻게 적용되는지 설명 (2-3 문장)",
  "prayer": "이 말씀을 바탕으로 한 짧은 기도문"
}

JSON만 응답하고 다른 설명은 하지 마세요.`
            }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      // JSON 추출
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const verseData = JSON.parse(jsonMatch[0]);
        setVerse(verseData);
      }
    } catch (error) {
      console.error('Error fetching verse:', error);
      setVerse({
        reference: "오류",
        text: "말씀을 불러오는데 문제가 발생했습니다. 다시 시도해주세요.",
        context: "",
        meaning: "",
        prayer: ""
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSituationClick = (situationId) => {
    if (situationId === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      getVerse(situationId);
    }
  };

  const handleCustomSubmit = () => {
    if (customSituation.trim()) {
      getVerse('custom');
      setShowCustomInput(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: '"Crimson Text", "Noto Serif KR", serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(138, 116, 249, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(251, 207, 232, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Gothic arch pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        background: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 49px,
          rgba(255, 255, 255, 0.03) 49px,
          rgba(255, 255, 255, 0.03) 50px
        )`,
        pointerEvents: 'none'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Noto+Serif+KR:wght@400;600;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(138, 116, 249, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(138, 116, 249, 0.5);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .situation-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .situation-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        
        .verse-card {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .glow-border {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '72px',
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            📖
          </div>
          <h1 style={{
            margin: '0 0 16px 0',
            fontSize: '56px',
            fontWeight: '700',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            letterSpacing: '2px'
          }}>
            오늘의 말씀
          </h1>
          <p style={{
            margin: 0,
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '400',
            letterSpacing: '1px'
          }}>
            당신의 상황에 맞는 성경 말씀을 찾아드립니다
          </p>
        </div>

        {/* Situation Selection */}
        {!verse && !loading && (
          <div className="fade-in">
            <h2 style={{
              textAlign: 'center',
              fontSize: '28px',
              color: '#ffffff',
              marginBottom: '40px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              지금 어떤 상황이신가요?
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {situations.map((situation, index) => (
                <div
                  key={situation.id}
                  onClick={() => handleSituationClick(situation.id)}
                  className="situation-card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '32px 24px',
                    textAlign: 'center',
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out backwards'
                  }}
                >
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                  }}>
                    {situation.icon}
                  </div>
                  <div style={{
                    fontSize: '20px',
                    color: '#ffffff',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    {situation.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom situation input */}
            <div style={{
              textAlign: 'center'
            }}>
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 116, 249, 0.2), rgba(251, 207, 232, 0.2))',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '16px 40px',
                    fontSize: '18px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    fontFamily: '"Crimson Text", "Noto Serif KR", serif'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(138, 116, 249, 0.3)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <MessageCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  직접 상황 입력하기
                </button>
              ) : (
                <div style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  animation: 'fadeInUp 0.5s ease-out'
                }}>
                  <textarea
                    value={customSituation}
                    onChange={(e) => setCustomSituation(e.target.value)}
                    placeholder="지금 겪고 있는 상황을 자유롭게 적어주세요..."
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '20px',
                      fontSize: '18px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      resize: 'vertical',
                      fontFamily: '"Crimson Text", "Noto Serif KR", serif',
                      marginBottom: '16px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      onClick={handleCustomSubmit}
                      disabled={!customSituation.trim()}
                      style={{
                        background: customSituation.trim() 
                          ? 'linear-gradient(135deg, #8a74f9, #fbcfe8)'
                          : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px 32px',
                        fontSize: '18px',
                        color: '#ffffff',
                        cursor: customSituation.trim() ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        fontFamily: '"Crimson Text", "Noto Serif KR", serif'
                      }}
                    >
                      <Search size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                      말씀 찾기
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomSituation('');
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '14px 32px',
                        fontSize: '18px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        fontFamily: '"Crimson Text", "Noto Serif KR", serif'
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '100px 20px',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            <Loader size={48} style={{
              color: '#8a74f9',
              animation: 'spin 1s linear infinite',
              marginBottom: '24px'
            }} />
            <p style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              말씀을 찾고 있습니다...
            </p>
          </div>
        )}

        {/* Verse Display */}
        {verse && !loading && (
          <div className="verse-card" style={{
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Main verse card */}
            <div className="glow-border" style={{
              background: 'linear-gradient(135deg, rgba(138, 116, 249, 0.15), rgba(251, 207, 232, 0.15))',
              backdropFilter: 'blur(20px)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '50px 40px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <BookOpen size={40} style={{
                color: '#8a74f9',
                marginBottom: '24px'
              }} />
              
              <div style={{
                fontSize: '18px',
                color: '#8a74f9',
                fontWeight: '600',
                marginBottom: '24px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                {verse.reference}
              </div>
              
              <div style={{
                fontSize: '32px',
                lineHeight: '1.8',
                color: '#ffffff',
                fontWeight: '400',
                marginBottom: '40px',
                fontStyle: 'italic',
                padding: '0 20px'
              }}>
                "{verse.text}"
              </div>
            </div>

            {/* Context section */}
            {verse.context && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '22px',
                  color: '#8a74f9',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Sparkles size={24} />
                  성경의 문맥
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '18px',
                  lineHeight: '1.8',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {verse.context}
                </p>
              </div>
            )}

            {/* Meaning section */}
            {verse.meaning && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '22px',
                  color: '#fbcfe8',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Heart size={24} />
                  오늘 내게 주시는 의미
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '18px',
                  lineHeight: '1.8',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {verse.meaning}
                </p>
              </div>
            )}

            {/* Prayer section */}
            {verse.prayer && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(138, 116, 249, 0.1), rgba(251, 207, 232, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '22px',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  🙏 기도
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '19px',
                  lineHeight: '1.9',
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontStyle: 'italic'
                }}>
                  {verse.prayer}
                </p>
              </div>
            )}

            {/* Back button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  setVerse(null);
                  setCustomSituation('');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '16px 48px',
                  fontSize: '18px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Crimson Text", "Noto Serif KR", serif'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                다른 상황 선택하기
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}