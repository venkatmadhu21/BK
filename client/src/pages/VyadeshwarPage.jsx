import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import shivvImage from '../assets/images/shivv.webp';
import templeImage from '../assets/images/temple.jpg';

const VyadeshwarPage = () => {
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-600" />
        <div className="relative text-white py-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  to="/" 
                  className="inline-flex items-center text-amber-100 hover:text-white transition-colors duration-200 mb-3"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {language === 'mr' ? 'मुख्य पृष्ठावर परत' : 'Back to Home'}
                </Link>
                <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm tracking-tight">{currentContent.title}</h1>
                <p className="text-base md:text-lg text-amber-100 mt-1">{currentContent.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 border border-white/30 backdrop-blur"><MapPin size={14} className="mr-1" /> {currentContent.location}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 border border-white/30 backdrop-blur"><Clock size={14} className="mr-1" /> {currentContent.distance}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 border border-white/30 backdrop-blur"><Calendar size={14} className="mr-1" /> {currentContent.established}</span>
                </div>
              </div>
              <img src={shivvImage} alt="Vyadeshwar" className="hidden md:block w-24 h-24 rounded-2xl object-cover ring-2 ring-white/70 shadow-xl" />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left - Images & Info */}
          <aside className="lg:w-1/3 lg:sticky top-24 self-start">
            <div className="space-y-8">
              {/* Shiva Image */}
              <div className="overflow-hidden rounded-2xl shadow-md bg-white">
                <img 
                  src={shivvImage} 
                  alt="Lord Shiva"
                  className="w-full h-full object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {language === 'mr' ? 'भगवान शिव' : 'Lord Shiva'}
                  </h3>
                </div>
              </div>

              {/* Temple Image */}
              <div className="overflow-hidden rounded-2xl shadow-md bg-white">
                <img 
                  src={templeImage} 
                  alt="Vyadeshwar Temple"
                  className="w-full h-full object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {language === 'mr' ? 'व्याडेश्वर मंदिर' : 'Vyadeshwar Temple'}
                  </h3>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {language === 'mr' ? 'त्वरित माहिती' : 'Quick Information'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'mr' ? 'स्थान' : 'Location'}</p>
                      <p className="font-medium text-gray-800">{currentContent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'mr' ? 'अंतर' : 'Distance'}</p>
                      <p className="font-medium text-gray-800">{currentContent.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{language === 'mr' ? 'स्थापना' : 'Established'}</p>
                      <p className="font-medium text-gray-800">{currentContent.established}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right - Content */}
          <section className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'mr' ? 'मंदिराचे वर्णन' : 'Temple Description'}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {currentContent.description.split('\n\n').map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>

              {/* Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                    {currentContent.sections.history}
                  </h3>
                  <p className="text-gray-700">{currentContent.historyText}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
                    </svg>
                    {currentContent.sections.architecture}
                  </h3>
                  <p className="text-gray-700">{currentContent.architectureText}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 text-orange-600 mr-2" />
                    {currentContent.sections.significance}
                  </h3>
                  <p className="text-gray-700">{currentContent.significanceText}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {currentContent.sections.festivals}
                  </h3>
                  <p className="text-gray-700">{currentContent.festivalsText}</p>
                </div>
              </div>

              {/* Visiting Info */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-100 rounded-2xl shadow-md p-6 md:p-8 mt-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-amber-700 mr-2" />
                  {currentContent.sections.visiting}
                </h3>
                <p className="text-gray-700">{currentContent.visitingText}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default VyadeshwarPage;
