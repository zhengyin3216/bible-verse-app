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
      // Vercel Serverless Function 호출
      const response = await fetch("/api/get-verse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation: situationText
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const verseData = await response.json();
      setVerse(verseData);

    } catch (error) {
      console.error('Error fetching verse:', error);
      
      // 에러 시 미리 준비된 구절 사용 (백업)
      const backupVerses = {
        comfort: {
          reference: "시편 46:1",
          text: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라",
          context: "시편 46편은 '제국들이 혼란에 빠지고 왕국들이 무너지는' 위기의 시대에 쓰여진 시로, 하나님께서 역사의 주관자이시며 그분의 백성의 피난처가 되신다는 확신을 노래합니다. 이 시는 특별히 예루살렘이 아시리아의 침략을 받았을 때 하나님의 보호하심을 경험한 후에 쓰여진 것으로 여겨집니다.",
          meaning: "어려운 상황 속에서도 하나님은 우리의 안전한 피난처가 되십니다. 세상이 흔들리고 모든 것이 불안정해 보일 때, 하나님은 변함없이 우리 곁에 계시며 우리에게 필요한 힘과 도움을 주십니다. 이 말씀은 우리가 두려움 가운데서도 하나님을 신뢰할 수 있음을 상기시켜줍니다.",
          prayer: "사랑하는 하나님 아버지, 제가 힘들고 어려울 때 주님은 저의 피난처가 되어주십니다. 환난 가운데서도 주님께서 저와 함께 하시며 도와주심을 믿습니다. 주님의 평안과 위로로 제 마음을 채워주시고, 이 어려운 시간을 주님과 함께 이겨낼 수 있도록 힘을 주소서. 예수님의 이름으로 기도합니다. 아멘."
        },
        anxiety: {
          reference: "마태복음 6:34",
          text: "그러므로 내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요 한 날의 괴로움은 그 날로 족하니라",
          context: "예수님께서 산상수훈에서 제자들에게 가르치신 말씀입니다. 이 구절은 먹을 것과 입을 것에 대해 염려하는 사람들에게 주신 위로와 가르침의 일부로, 하늘의 새와 들의 백합화를 예로 들며 하나님의 섬세한 돌보심을 설명하신 후에 나오는 결론입니다.",
          meaning: "미래에 대한 걱정과 불안은 우리의 마음을 무겁게 짓누릅니다. 하지만 예수님은 우리에게 오늘에 집중하라고 말씀하십니다. 내일의 문제는 내일 주어질 은혜로 해결하면 됩니다. 오늘 하루만 잘 살아내면 되고, 하나님께서 우리의 필요를 아시고 채워주실 것을 신뢰하며 살아가면 됩니다.",
          prayer: "주님, 저는 미래에 대한 걱정으로 마음이 무겁습니다. 하지만 주님께서 저의 내일도 책임지고 계심을 믿습니다. 오늘 하루를 주님과 함께 충실히 살아가게 하시고, 내일 일은 내일 주실 은혜로 감당할 수 있도록 도와주소서. 주님을 신뢰하며 평안을 누리게 하소서. 아멘."
        }
      };
      
      const fallbackVerse = backupVerses[situation] || backupVerses.comfort;
      setVerse(fallbackVerse);
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