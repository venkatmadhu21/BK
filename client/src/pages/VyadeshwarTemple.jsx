import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import shivvImage from '../assets/images/shivv.webp';
import templeImage from '../assets/images/temple.jpg';

// Calm temple-vibe redesign. Content preserved exactly as provided by the user.
export default function VyadeshwarTemple() {
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 text-gray-900 antialiased">
      {/* Subtle patterned background using pseudo elements via Tailwind utilities */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Top navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{language === 'mr' ? 'मुख्य पृष्ठावर परत' : 'Back to Home'}</span>
            </Link>
          </div>

          {/* Hero area */}
          <header className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-amber-900">
                {currentContent.title}
              </h1>
              <p className="mt-3 text-lg text-amber-800/90 max-w-3xl">{currentContent.subtitle}</p>

              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <span className="text-sm font-medium">{currentContent.location}</span>
                </div>
                <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span className="text-sm font-medium">{currentContent.distance}</span>
                </div>
                <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <Calendar className="w-4 h-4 text-amber-800" />
                  <span className="text-sm font-medium">{currentContent.established}</span>
                </div>
              </div>
            </div>

            {/* Right: calm portrait */}
            <div className="lg:col-span-1 flex items-start justify-end">
              <figure className="w-48 md:w-56 rounded-2xl overflow-hidden shadow-lg border border-amber-100 bg-white">
                <img src={templeImage} alt="Vyadeshwar Temple" className="w-full h-full object-cover aspect-[4/5]" />
                <figcaption className="p-3 text-xs text-amber-700/90 bg-gradient-to-t from-white/80 to-transparent">{language === 'mr' ? 'व्याडेश्वर मंदिर' : 'Vyadeshwar Temple'}</figcaption>
              </figure>
            </div>
          </header>

          {/* Main layout: left column (images + quick info), right column content */}
          <main className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: images and quick facts */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-md bg-white border border-amber-100">
                <img src={shivvImage} alt="Lord Shiva" className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-amber-900">{language === 'mr' ? 'भगवान शिव' : 'Lord Shiva'}</h4>
                  <p className="mt-2 text-sm text-amber-800/90">{language === 'mr' ? 'आदरणीय' : 'Revered'}</p>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-white shadow-sm border border-amber-50">
                <h5 className="text-sm font-semibold text-amber-900">{language === 'mr' ? 'त्वरित माहिती' : 'Quick Information'}</h5>
                <dl className="mt-3 space-y-3 text-sm text-amber-800/90">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-amber-800" />
                    <div>
                      <dt className="font-medium">{language === 'mr' ? 'स्थान' : 'Location'}</dt>
                      <dd className="leading-tight">{currentContent.location}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-1 text-amber-800" />
                    <div>
                      <dt className="font-medium">{language === 'mr' ? 'अंतर' : 'Distance'}</dt>
                      <dd className="leading-tight">{currentContent.distance}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-1 text-amber-800" />
                    <div>
                      <dt className="font-medium">{language === 'mr' ? 'स्थापना' : 'Established'}</dt>
                      <dd className="leading-tight">{currentContent.established}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Soft callout for visiting */}
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100 text-amber-900 shadow-sm">
                <h6 className="font-semibold">{currentContent.sections.visiting}</h6>
                <p className="text-sm mt-2">{currentContent.visitingText}</p>
              </div>
            </aside>

            {/* Right column: content cards */}
            <section className="lg:col-span-2 space-y-6">
              <article className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-amber-100">
                <h2 className="text-2xl font-serif font-bold text-amber-900 mb-3">{language === 'mr' ? 'मंदिराचे वर्णन' : 'Temple Description'}</h2>
                <div className="prose prose-lg max-w-none text-amber-800">
                  {currentContent.description.split('\n\n').map((p, i) => (
                    <p key={i} className="leading-relaxed">{p}</p>
                  ))}
                </div>
              </article>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900">{currentContent.sections.history}</h3>
                      <p className="mt-2 text-amber-800 text-sm">{currentContent.historyText}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900">{currentContent.sections.architecture}</h3>
                      <p className="mt-2 text-amber-800 text-sm">{currentContent.architectureText}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900">{currentContent.sections.significance}</h3>
                      <p className="mt-2 text-amber-800 text-sm">{currentContent.significanceText}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900">{currentContent.sections.festivals}</h3>
                      <p className="mt-2 text-amber-800 text-sm">{currentContent.festivalsText}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer call-to-action */}
              <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 text-amber-900 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-xl font-bold">Plan your visit</h4>
                    <p className="text-sm mt-1">Best time to visit: Mahashivratri, Shravan Mondays, Kartik Mondays.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to="/" className="inline-flex items-center px-4 py-2 rounded-md bg-amber-800 text-white text-sm shadow-sm hover:bg-amber-900 transition">{language === 'mr' ? 'परत जा' : 'Go back'}</Link>
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(currentContent.location)}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 rounded-md border border-amber-200 text-amber-800 text-sm hover:bg-amber-100 transition">{language === 'mr' ? 'नकाशा' : 'View on Map'}</a>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
