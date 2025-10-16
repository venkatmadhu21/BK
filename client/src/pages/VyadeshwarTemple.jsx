import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import shivvImage from '../assets/images/shivv.webp';
import templeImage from '../assets/images/temple.jpg';

const VyadeshwarTemple = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Shree Vyadeshwar Temple, Guhagar",
      subtitle: "Ancient Temple of Lord Shiva in Ratnagiri District",
      location: "Guhagar, Ratnagiri District, Maharashtra",
      distance: "45 km from Chiplun",
      established: "Around 1200 AD (Temple: 200-250 years old)",
      description: `Shree Vyadeshwar Temple in Guhagar is located very close to the bus stand, and the Guhagar market is situated around it. Guhagar is a village in Ratnagiri district and is the headquarters of a taluka. Guhagar is about 45 kilometers away from Chiplun.

Although Guhagar was founded around 1200 AD, Shri Vyadeshwar Temple is about 200/250 years old. The Shivalinga in the Vyadeshwar Temple is very ancient and self-sufficient.

After Jamadagniputra Parashurama created Konkanbhoomi, many sages came and stayed in that area. Among them, Vyad Rishi founded it, hence it was called Vyadeshwar.

This temple has walls on all four sides and has entrances on the north, south and east. Although the temple faces east, the entrance facing south is mainly used.

Shri Vyadeshwar is the family head of most of the Chitpavan Konkanstha Brahmin families. This Vyadeshwar is the family head of many Joglekar families.

There is a Gak lake near the temple and there is also a temple of Vitthal-Rakhumai. There is open space in the temple premises and the temple is of the Panchayat system.

Small temples like Shri Surya, Shri Ganapati, Shri Ambika and Shri Lakshmi-Vishnu are located on all four sides of Shri Vyadeshwar temple. The temple's Upadhyaya helps the devotees in religious activities.

A special festival is held here on Kartiki Gakdashila. There is a five-day Vyadeshwar festival in the month of Magh. Katha-kirtan programs are held during the festival. There is a palanquin procession.

Rudrabhishek is continuously performed on the Vyadeshwar temple during Chaturmas. A silver idol of Shiva is kept in the temple on the days of Ashadhi, Kartiki Gakdashi and Mahashivratri.

Many devotees come to have darshan of Shri Vyadeshwar on Mahashivratri, Shravan and Kartik Mondays.`,
      sections: {
        history: "History & Origin",
        architecture: "Temple Architecture",
        significance: "Religious Significance",
        festivals: "Festivals & Celebrations",
        visiting: "Visiting Information"
      },
      historyText: "Founded by Vyad Rishi after Parashurama created Konkanbhoomi. The ancient self-sufficient Shivalinga makes this temple spiritually significant.",
      architectureText: "The temple has walls on all four sides with entrances on north, south, and east. Though east-facing, the south entrance is primarily used. Surrounded by smaller temples of various deities.",
      significanceText: "Shri Vyadeshwar serves as the family deity (Kuladevata) for most Chitpavan Konkanstha Brahmin families, especially many Joglekar families.",
      festivalsText: "Major celebrations include Kartiki Gakdashila festival, five-day Vyadeshwar festival in Magh month with Katha-kirtan programs and palanquin processions.",
      visitingText: "Located near Guhagar bus stand and market. Best visited during Mahashivratri, Shravan Mondays, and Kartik Mondays for special darshan."
    },
    mr: {
      title: "श्री व्याडेश्वर मंदिर, गुहागर",
      subtitle: "रत्नागिरी जिल्ह्यातील भगवान शिवाचे प्राचीन मंदिर",
      location: "गुहागर, रत्नागिरी जिल्हा, महाराष्ट्र",
      distance: "चिपळूणपासून ४५ किमी",
      established: "सुमारे १२०० इ.स. (मंदिर: २००-२५० वर्षे जुने)",
      description: `गुहागरमधील श्री व्याडेश्वर मंदिर बस स्थानकाच्या अगदी जवळ आहे आणि गुहागर बाजार त्याच्या आजूबाजूला वसलेला आहे. गुहागर हे रत्नागिरी जिल्ह्यातील एक गाव आहे आणि तालुक्याचे मुख्यालय आहे. गुहागर चिपळूणपासून सुमारे ४५ किलोमीटर अंतरावर आहे.

गुहागरची स्थापना सुमारे १२०० इ.स.च्या आसपास झाली असली तरी श्री व्याडेश्वर मंदिर सुमारे २००/२५० वर्षे जुने आहे. व्याडेश्वर मंदिरातील शिवलिंग अतिशय प्राचीन आणि स्वयंभू आहे.

जमदग्निपुत्र परशुरामाने कोकणभूमी निर्माण केल्यानंतर अनेक ऋषी आले आणि त्या भागात राहिले. त्यापैकी व्याड ऋषींनी त्याची स्थापना केली, म्हणून त्याला व्याडेश्वर म्हटले गेले.

या मंदिराला चारही बाजूंना भिंती आहेत आणि उत्तर, दक्षिण आणि पूर्वेला प्रवेशद्वार आहेत. मंदिराचे तोंड पूर्वेकडे असले तरी दक्षिणेकडील प्रवेशद्वाराचा मुख्यतः वापर केला जातो.

श्री व्याडेश्वर हे बहुतेक चितपावन कोकणस्थ ब्राह्मण कुटुंबांचे कुलदैवत आहेत. हे व्याडेश्वर अनेक जोगळेकर कुटुंबांचे कुलदैवत आहेत.

मंदिराजवळ गाक तलाव आहे आणि विठ्ठल-रखुमाईचे मंदिरही आहे. मंदिराच्या आवारात मोकळी जागा आहे आणि मंदिर पंचायत प्रणालीचे आहे.

श्री व्याडेश्वर मंदिराच्या चारही बाजूंना श्री सूर्य, श्री गणपती, श्री अंबिका आणि श्री लक्ष्मी-विष्णू यांसारखी छोटी मंदिरे आहेत. मंदिराचे उपाध्याय भक्तांना धार्मिक कार्यात मदत करतात.

कार्तिकी गकदशीला येथे विशेष उत्सव होतो. माघ महिन्यात पाच दिवसांचा व्याडेश्वर उत्सव होतो. उत्सवात कथा-कीर्तन कार्यक्रम होतात. पालखी मिरवणूक काढली जाते.

चातुर्मास्यात व्याडेश्वर मंदिरावर सतत रुद्राभिषेक केला जातो. आषाढी, कार्तिकी गकदशी आणि महाशिवरात्रीच्या दिवशी मंदिरात शिवाची चांदीची मूर्ती ठेवली जाते.

महाशिवरात्री, श्रावण आणि कार्तिक सोमवारी श्री व्याडेश्वराचे दर्शन घेण्यासाठी अनेक भक्त येतात.`,
      sections: {
        history: "इतिहास आणि उत्पत्ति",
        architecture: "मंदिर वास्तुकला",
        significance: "धार्मिक महत्त्व",
        festivals: "उत्सव आणि समारंभ",
        visiting: "भेट देण्याची माहिती"
      },
      historyText: "परशुरामाने कोकणभूमी निर्माण केल्यानंतर व्याड ऋषींनी स्थापना केली. प्राचीन स्वयंभू शिवलिंगामुळे हे मंदिर आध्यात्मिकदृष्ट्या महत्त्वपूर्ण आहे.",
      architectureText: "मंदिराला चारही बाजूंना भिंती आहेत आणि उत्तर, दक्षिण आणि पूर्वेला प्रवेशद्वार आहेत. पूर्वमुखी असले तरी दक्षिण प्रवेशद्वाराचा मुख्य वापर होतो. विविध देवतांच्या छोट्या मंदिरांनी वेढलेले.",
      significanceText: "श्री व्याडेश्वर हे बहुतेक चितपावन कोकणस्थ ब्राह्मण कुटुंबांचे, विशेषतः अनेक जोगळेकर कुटुंबांचे कुलदैवत आहेत.",
      festivalsText: "मुख्य उत्सवांमध्ये कार्तिकी गकदशी उत्सव, माघ महिन्यातील पाच दिवसांचा व्याडेश्वर उत्सव कथा-कीर्तन कार्यक्रम आणि पालखी मिरवणुकीसह.",
      visitingText: "गुहागर बस स्थानक आणि बाजाराजवळ स्थित. महाशिवरात्री, श्रावण सोमवार आणि कार्तिक सोमवारी विशेष दर्शनासाठी भेट देणे योग्य."
    }
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-orange-50 relative overflow-hidden">
      {/* Enhanced Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-amber-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-orange-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-100/30 to-amber-100/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-l from-amber-200/25 to-orange-200/20 rounded-full blur-xl"></div>
        {/* Sacred Geometry Pattern */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-5">
          <div className="w-full h-full border-2 border-orange-300 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute inset-4 border border-amber-300 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
          <div className="absolute inset-8 border border-orange-400 rounded-full animate-spin" style={{animationDuration: '25s'}}></div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 text-white py-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/20 to-amber-800/20"></div>
        <div className="relative container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-orange-100 hover:text-white transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">{language === 'mr' ? 'मुख्य पृष्ठावर परत' : 'Back to Home'}</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent leading-tight">
              {currentContent.title}
            </h1>
            <p className="text-orange-100 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              {currentContent.subtitle}
            </p>
            {/* Decorative Line */}
            <div className="mt-6 flex items-center justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent w-24"></div>
              <div className="mx-4 w-3 h-3 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full animate-pulse"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Shivv Image */}
              <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100/50">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-white rounded-3xl overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={shivvImage}
                      alt="Lord Shiva"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xl font-bold drop-shadow-lg">Lord Shiva</p>
                      </div>
                    </div>
                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-white text-6xl filter drop-shadow-2xl animate-pulse">🕉️</div>
                    </div>
                  </div>

                  <div className="p-6 text-center bg-gradient-to-b from-white to-orange-50/30">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                      {language === 'mr' ? 'भगवान शिव' : 'Lord Shiva'}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Temple Image */}
              <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100/50">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-white rounded-3xl overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={templeImage}
                      alt="Vyadeshwar Temple"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xl font-bold drop-shadow-lg">Vyadeshwar Temple</p>
                      </div>
                    </div>
                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-white text-6xl filter drop-shadow-2xl animate-pulse">🙏</div>
                    </div>
                  </div>

                  <div className="p-6 text-center bg-gradient-to-b from-white to-amber-50/30">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors duration-300">
                      {language === 'mr' ? 'व्याडेश्वर मंदिर' : 'Vyadeshwar Temple'}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="group bg-white rounded-3xl shadow-xl p-8 border border-orange-100/50 hover:shadow-2xl transition-all duration-500">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                    {language === 'mr' ? 'त्वरित माहिती' : 'Quick Information'}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto"></div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 group/item">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-700 mb-1">{language === 'mr' ? 'स्थान' : 'Location'}</p>
                      <p className="font-semibold text-gray-800 leading-relaxed">{currentContent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 group/item">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-700 mb-1">{language === 'mr' ? 'अंतर' : 'Distance'}</p>
                      <p className="font-semibold text-gray-800 leading-relaxed">{currentContent.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 group/item">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-700 mb-1">{language === 'mr' ? 'स्थापना' : 'Established'}</p>
                      <p className="font-semibold text-gray-800 leading-relaxed">{currentContent.established}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Main Description */}
              <div className="group bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-orange-100/50 hover:shadow-2xl transition-all duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                    {language === 'mr' ? 'मंदिराचे वर्णन' : 'Temple Description'}
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto"></div>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {currentContent.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-lg leading-8 hover:text-gray-800 transition-colors duration-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* History */}
                <div className="group bg-white rounded-3xl shadow-xl p-8 border border-orange-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-orange-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span>{currentContent.sections.history}</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentContent.historyText}</p>
                </div>

                {/* Architecture */}
                <div className="group bg-white rounded-3xl shadow-xl p-8 border border-amber-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-amber-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{currentContent.sections.architecture}</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentContent.architectureText}</p>
                </div>

                {/* Significance */}
                <div className="group bg-white rounded-3xl shadow-xl p-8 border border-orange-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-orange-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span>{currentContent.sections.significance}</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentContent.significanceText}</p>
                </div>

                {/* Festivals */}
                <div className="group bg-white rounded-3xl shadow-xl p-8 border border-amber-100/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-amber-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{currentContent.sections.festivals}</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentContent.festivalsText}</p>
                </div>
              </div>

              {/* Visiting Information */}
              <div className="group bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 rounded-3xl shadow-xl p-8 md:p-10 border border-orange-200/50 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center group-hover:text-orange-800 transition-colors duration-300">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <span>{currentContent.sections.visiting}</span>
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{currentContent.visitingText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VyadeshwarTemple;