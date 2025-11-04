import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, MapPin, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import deviImage from '../assets/images/devi.png';
import deviAudio from '../assets/images/devi-audio.mp3';

export default function YogeshwariDevi() {
  // Use same language key as original Yogeshwari (currentLanguage) if your context exposes it.
  // If your LanguageContext uses `language` like Vyadeshwar page, change accordingly.
  const { currentLanguage } = useLanguage(); // keep original variable name
  const languageKey = currentLanguage || 'en';

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);

  // Keep content exactly as original Yogeshwari Devi (english + marathi)
  const content = {
    en: {
      title: "Yogeshwari Devi",
      subtitle: "Sacred Kuladevi of Jogalekar Families (Ambajogai)",
      location: "Ambajogai, Marathwada, Maharashtra",
      backButton: "Back to Home",
      distance: "—",
      established: "Ancient (approx. 1500 yrs)",
      description: `Yogeshwari Devi of Ambajogai in Marathwada is the family deity (Kuladevi) of most Chitpavan Kokanastha Brahmins. Therefore, devotees come from all parts of Maharashtra for the darshan of this goddess.

For the Atrigotri Chitpavan Jogalekar families, this Dantasurmardini, Rajrajeshwari Devi is their special powerful Kulaswamini. The establishment of this Shri Yogeshwari Devi temple is believed to be about one and a half thousand years old.

The north-facing temple of Shri Yogeshwari Devi, built in Hemadpanti architecture, is located on the western bank of the Jayanti river flowing through the center of Ambajogai city.

The annual festivals of Shri Yogeshwar Devi are celebrated in the months of Ashwin and Margashirsha. The Shatchandi Havan is completed at the confluence of Ashtami and Navami tithis. In the month of Margashirsha, Ghatasthapana takes place from Shuddha Saptami and the Shatchandi Yajna is completed on the full moon day.

Margashirsha Purnima is the incarnation day of Shri Yogeshwari Devi. On this day, bhog is offered to the goddess.

It is believed that Jogalekar family members must have darshan of their Kulaswamini at least once in their lifetime. There is a tradition that couples should have darshan of the Kulaswamini after marriage.

Those going to Ambajogai for darshan of Shri Yogeshwari Devi or for religious ceremonies should take help from the Kshetra Upadhyayas of this temple:

1. Kshetra Upadhyaya Bhikaji Kashinath Pathakshastri
2. Kshetra Upadhyaya Vasant Martand Ausekar-Pathak`,
      visitingText: `Located in Ambajogai town near Jayanti river; best visited during Margashirsha Purnima and festival days.`,
      footerNote: "🙏 May Shri Yogeshwari Devi bless all devotees with peace, prosperity, and spiritual growth 🙏",
      mapQuery: "Yogeshwari+Devi+Temple,+Ambajogai,+Maharashtra"
    },
    mr: {
      title: "योगेश्वरी देवी",
      subtitle: "आंबेजोगाई येथील कुलदेवी",
      location: "आंबेजोगाई, मराठवाडा, महाराष्ट्र",
      backButton: "मुख्यपृष्ठावर परत जा",
      distance: "—",
      established: "प्राचीन (सुमारे १५०० वर्षे)",
      description: `मराठवाड्यातील आंबेजोगाईची अंबापुरवासिनी श्री योगेश्वरी देवी ही बहुतेक सर्वच चित्तपावन कोकणस्थ ब्राह्मणांची कुलदेवता आहे. त्यामुळे महाराष्ट्रातील सर्व भागांतून या देवीच्या दर्शनास भक्तगण येत असतात.

अत्रिगोत्रीय चित्पावन जोगळेकर कुटुंबीयांची तर ही दंतासुरमर्दिनी, राजराजेश्वरीदेवी, विशेष शक्ती असलेली कुलस्वामिनीच आहे. ह्या श्री योगेश्वरी देवीच्या देवस्थानाच्या स्थापनेचा काळ सुमारे दीड हजार वर्षांपूर्वींचा मानला जातो.

श्री योगेश्वरी देवीचे, हेमाडपंती रचनेचे, उत्तराभिमुख मंदिर आंबेजोगाई शहराच्या मध्यभागातून वाहणाऱ्या जयंती नदीच्या पश्चिम किनाऱ्यावर स्थित आहे.

श्री योगेश्वर देवीचे वार्षिक उत्सव, अश्विन व मार्गशीर्ष महिन्यात साजरे केले जातात. अष्टमी व नवमी तिथीच्या संधिकालावर शतचंडी हवनावर पूर्णाहती होते. मार्गशीर्ष महिन्यांत घटस्थापना शुद्ध सप्तमीपासून होऊन पौर्णिमेच्या दिवशी शतचंडी यज्ञाची पूर्णाहती होते.

मार्गशीर्ष पौर्णिमा हा श्री योगेश्वरी देवीचा अवतारदिवस आहे. या दिवशी देवीला भोग चढवितात.

जोगळेकर कुटुंबीयांना कुलस्वामिनीचे आयुष्यात एकदा तरी दर्शन घेणे आवश्यक आहे असे मानले जाते. लग्नानंतर जोडप्याने कुलस्वामिनीचे दर्शन घेण्याची प्रथा आहे.

आंबेजोगाईला दर्शन किंवा धार्मिक विधीसाठी जाणाऱ्यांनी या देवस्थानाचे क्षेत्रउपाध्याय यांची मदत घ्यावी:

१. क्षेत्र उपाध्याय भिकाजी काशिनाथ पाठकशास्त्री
२. क्षेत्र उपाध्याय वसंत मार्तंड औसेकर-Pathak`,
      visitingText: `जयंती नदीच्या काठावर आंबेजोगाई येथे स्थित; मार्गशीर्ष पौर्णिमा आणि उत्सवाच्या दिवशी भेट देणे उत्तम.`,
      footerNote: "🙏 श्री योगेश्वरी देवी सर्व भक्तांना शांती, समृद्धी आणि आध्यात्मिक वाढीचा आशीर्वाद देवो 🙏",
      mapQuery: "Yogeshwari+Devi+Temple,+Ambajogai,+Maharashtra"
    }
  };

  const curr = content[languageKey] || content.en;

  // Audio auto-play attempt & handlers (keeps original behavior)
  useEffect(() => {
    if (audioLoaded && audioRef.current) {
      const tryPlay = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          // autoplay blocked by browser — user can press Play
          // console.log('autoplay prevented', err);
        }
      };
      const t = setTimeout(tryPlay, 200);
      return () => clearTimeout(t);
    }
  }, [audioLoaded]);

  const handleAudioLoad = () => setAudioLoaded(true);
  const handleAudioEnd = () => setIsPlaying(false);

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      // console.error('audio error', err);
    }
  };

  // Open Google Maps in new tab (used by top & under-image button)
  const openMap = () => {
    const q = curr.mapQuery || encodeURIComponent(curr.location);
    const url = `https://www.google.com/maps/search/${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50/30 to-orange-50 relative overflow-hidden">
      {/* Enhanced Background Decorative Elements (exact Vyadeshwar style) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-amber-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-orange-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-100/30 to-amber-100/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-l from-amber-200/25 to-orange-200/20 rounded-full blur-xl"></div>

        {/* Sacred Geometry Pattern (matching Vyadeshwar) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-5">
          <div className="w-full h-full border-2 border-orange-300 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute inset-4 border border-amber-300 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-8 border border-orange-400 rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
        </div>
      </div>

      {/* Header area (Vyadeshwar style) */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 text-white py-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/20 to-amber-800/20"></div>
        <div className="relative container mx-auto px-4 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-orange-100 hover:text-white transition-all duration-300 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">{curr.backButton || (languageKey === 'mr' ? 'मुख्य पृष्ठावर परत' : 'Back to Home')}</span>
            </Link>
          </div>

          {/* Right controls: audio + map (Vyadeshwar top-right style) */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              disabled={!audioLoaded}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-transform duration-200 ${isPlaying ? 'bg-orange-300/20 text-white' : 'bg-white/10 text-orange-100'} hover:scale-105`}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlaying ? (languageKey === 'mr' ? 'थांबवा' : 'Pause') : (languageKey === 'mr' ? 'प्ले करा' : 'Play')}</span>
            </button>

            <button
              onClick={openMap}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
              title={languageKey === 'mr' ? 'नकाशावर पहा' : 'View on Map'}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{languageKey === 'mr' ? 'नकाशा' : 'Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content container (Vyadeshwar layout) */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - image & quick info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Devi Image Card (Vyadeshwar style) */}
              <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100/50">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-white rounded-3xl overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={deviImage}
                      alt="Yogeshwari Devi"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-white text-6xl filter drop-shadow-2xl animate-pulse">🕉️</div>
                    </div>
                  </div>

                  <div className="p-6 text-center bg-gradient-to-b from-white to-orange-50/30">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                      {languageKey === 'mr' ? 'योगेश्वरी देवी' : 'Yogeshwari Devi'}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Button under image (second map button, Vyadeshwar style) */}
                    <div className="mt-4">
                      <button
                        onClick={openMap}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-50 text-orange-700 border border-orange-200/50 hover:shadow-md transition"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{languageKey === 'mr' ? 'नकाशा पहा' : 'View on Map'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick info card (Vyadeshwar style) */}
              <div className="group bg-white rounded-3xl shadow-xl p-8 border border-orange-100/50 hover:shadow-2xl transition-all duration-500">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                    {languageKey === 'mr' ? 'त्वरित माहिती' : 'Quick Information'}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto"></div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-700 mb-1">{languageKey === 'mr' ? 'स्थान' : 'Location'}</p>
                      <p className="font-semibold text-gray-800 leading-relaxed">{curr.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-700 mb-1">{languageKey === 'mr' ? 'अंतर' : 'Distance'}</p>
                      <p className="font-semibold text-gray-800 leading-relaxed">{curr.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-700 mb-1">{languageKey === 'mr' ? 'स्थापना' : 'Established'}</p>
                      <p className="font-semibold text-gray-800 leading-relaxed">{curr.established}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Right column - content (Vyadeshwar style) */}
          <main className="lg:col-span-2">
            <div className="space-y-8">
              <div className="group bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-orange-100/50 hover:shadow-2xl transition-all duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                    {languageKey === 'mr' ? 'देवीचे वर्णन' : 'Divine Description'}
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto"></div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {curr.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6 text-lg leading-8">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Visiting / Festivals / Footer sections (kept simpler but in Vyadeshwar style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group bg-white rounded-3xl shadow-xl p-8 border border-orange-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-orange-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    {languageKey === 'mr' ? 'उत्सव आणि समारंभ' : 'Festivals & Celebrations'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {curr.visitingText}
                  </p>
                </div>

                <div className="group bg-white rounded-3xl shadow-xl p-8 border border-amber-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-amber-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    {languageKey === 'mr' ? 'भेट देण्याची माहिती' : 'Visiting Information'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{curr.visitingText}</p>
                </div>
              </div>

              <div className="group bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 rounded-3xl shadow-xl p-8 md:p-10 border border-orange-200/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-xl font-bold">Plan your visit</h4>
                    <p className="text-sm mt-1">Best time: Margashirsha Purnima & festival days</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to="/" className="inline-flex items-center px-4 py-2 rounded-md bg-amber-800 text-white text-sm shadow-sm hover:bg-amber-900 transition">
                      {languageKey === 'mr' ? 'परत जा' : 'Go back'}
                    </Link>
                    <button
                      onClick={openMap}
                      className="inline-flex items-center px-4 py-2 rounded-md border border-amber-200 text-amber-800 text-sm hover:bg-amber-100 transition"
                    >
                      {languageKey === 'mr' ? 'नकाशा' : 'View on Map'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>

      {/* Hidden audio element retained exactly */}
      <audio
        ref={audioRef}
        src={deviAudio}
        onLoadedData={handleAudioLoad}
        onEnded={handleAudioEnd}
        preload="auto"
      />
    </div>
  );
}
