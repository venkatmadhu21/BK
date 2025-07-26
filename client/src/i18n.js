import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        family: 'About Us',
        history: 'History',
        news: 'News',
        events: 'Events',
        signIn: 'Sign In',
        joinFamily: 'Join Family',
        profile: 'My Profile',
        signOut: 'Sign Out',
        language: 'Language'
      },
      // Home page
      home: {
        title: 'Bal Krishna Nivas',
        subtitle: 'Family Heritage Portal',
        welcome: 'Welcome to Our Family Heritage',
        description: 'Connecting generations through tradition, love, and shared memories',
        joinUs: 'Join Our Family',
        learnMore: 'Learn More',
        ourStory: 'Our Story',
        storyDescription: 'Discover the rich heritage and beautiful journey of our family spanning multiple generations.',
        familyNews: 'Family News',
        newsDescription: 'Stay updated with the latest happenings, celebrations, and milestones in our family.',
        upcomingEvents: 'Upcoming Events',
        eventsDescription: 'Join us for family gatherings, festivals, and special occasions throughout the year.',
        familyTree: 'Family Tree',
        treeDescription: 'Explore our family lineage and discover connections across generations.',
        deviImage: 'Click on the Devi image to play audio',
        testAudio: 'Test Audio',
        heartfeltWelcome: 'Heartfelt Welcome',
        architecturalMarvel: 'A magnificent architectural marvel that stands as a testament to divine craftsmanship and spiritual devotion',
        buildingName: 'BalKrishna Nivas',
        testButton: 'Test',
        stopButton: 'Stop'
      },
      // Content Data - News Articles
      newsContent: {
        article1: {
          title: 'Annual Family Reunion 2024 Announced',
          content: 'We are excited to announce our annual family reunion for 2024. This year\'s event will be bigger and better than ever before, with activities for all age groups. The reunion will take place at the beautiful Gogte Gardens, featuring traditional games, cultural performances, and a grand feast prepared by our family chefs.',
          summary: 'Join us for our biggest family gathering of the year with exciting activities and cultural performances.'
        },
        article2: {
          title: 'New Baby Born in the Family',
          content: 'Congratulations to Priya and Amit Gogte on the arrival of their beautiful baby boy! Little Arjun was born on January 10th, weighing 3.2 kg. Both mother and baby are healthy and doing well. The family is overjoyed with this new addition.',
          summary: 'Congratulations to Priya and Amit on their new arrival - baby Arjun!'
        },
        article3: {
          title: 'Traditional Cooking Workshop Success',
          content: 'Our recent traditional cooking workshop was a huge success! Over 30 family members participated in learning authentic Maharashtrian recipes passed down through generations. Special thanks to our elderly family members who shared their culinary wisdom.',
          summary: 'Family members came together to learn traditional Maharashtrian cooking techniques.'
        }
      },
      // Content Data - Events
      eventContent: {
        event1: {
          title: 'Diwali Celebration 2024',
          description: 'Join us for a grand Diwali celebration with traditional rituals, cultural performances, and a community feast. This year\'s celebration will feature rangoli competition, traditional dance performances, and fireworks display.'
        },
        event2: {
          title: 'Family Sports Day',
          description: 'Annual family sports day featuring cricket, volleyball, and traditional games. All age groups welcome! Prizes for winners and participation certificates for all.'
        },
        event3: {
          title: 'Ganesh Chaturthi Celebration',
          description: 'Traditional Ganesh Chaturthi celebration with morning aarti, cultural programs, and prasad distribution. Join us for this auspicious occasion.'
        }
      },
      // Family Tree Names
      familyNames: {
        ganeshGogte: 'Ganesh Gogte',
        balardGogte: 'Balard Gogte', 
        ramakrishnaGogte: 'Ramakrishna Gogte',
        balwantGogte: 'Balwant Gogte',
        ganeshGogte2: 'Ganesh Gogte',
        hariGogte: 'Hari Gogte'
      },
      // About page
      about: {
        title: 'About Us',
        subtitle: 'Our family story, mission, and values',
        description: 'Learn about the foundation and purpose of our family community'
      },
      // History page
      history: {
        title: 'Family History',
        subtitle: 'Historical timeline and family legacy',
        description: 'Journey through generations of family heritage'
      },
      // Family Tree page
      familyTree: {
        title: 'Family Tree',
        subtitle: 'Interactive family tree visualization',
        description: 'Explore family connections across generations'
      },
      // News page
      news: {
        title: 'Family News',
        subtitle: 'Latest updates and announcements',
        description: 'Stay connected with family happenings',
        pageTitle: 'Family News',
        pageSubtitle: 'Stay updated with the latest family announcements, achievements, and milestones',
        createNews: 'Create News',
        searchPlaceholder: 'Search news articles...',
        allCategories: 'All Categories',
        announcement: 'Announcement',
        milestone: 'Milestone',
        celebration: 'Celebration',
        by: 'By',
        views: 'views',
        priority: 'Priority',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        readMore: 'Read More',
        general: 'General',
        achievement: 'Achievement',
        memorial: 'Memorial',
        cultural: 'Cultural'
      },
      // Events page
      events: {
        title: 'Family Events',
        subtitle: 'Celebrations and gatherings',
        description: 'Join us for memorable family occasions',
        pageTitle: 'Family Events',
        pageSubtitle: 'Discover and participate in upcoming family gatherings, celebrations, and special occasions',
        createEvent: 'Create Event',
        searchPlaceholder: 'Search events...',
        allTypes: 'All Types',
        allStatuses: 'All Statuses',
        festival: 'Festival',
        milestone: 'Milestone',
        gathering: 'Gathering',
        memorial: 'Memorial',
        upcoming: 'Upcoming',
        ongoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled',
        location: 'Location',
        duration: 'Duration',
        attendees: 'Attendees',
        viewDetails: 'View Details'
      },
      // Auth pages
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        welcomeBack: 'Welcome Back',
        signInToAccount: 'Sign in to your Bal Krishna Nivas account',
        joinFamily: 'Join Bal Krishna Nivas',
        createAccount: 'Create your account to connect with your family',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        phone: 'Phone',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        occupation: 'Occupation',
        male: 'Male',
        female: 'Female',
        other: 'Other',
        required: 'Required',
        enterFirstName: 'Enter first name',
        enterLastName: 'Enter last name',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter password',
        confirmYourPassword: 'Confirm your password',
        enterPhone: 'Enter phone number',
        selectGender: 'Select gender',
        enterOccupation: 'Enter occupation',
        alreadyHaveMember: 'Already a family member?',
        signInHere: 'Sign in here',
        loading: 'Creating Account...',
        register: 'Register',
        dontHaveAccount: "Don't have an account?",
        signUpHere: 'Sign up here',
        forgotPassword: 'Forgot your password?'
      },
      // Accessibility
      accessibility: {
        toolbar: 'Accessibility Toolbar',
        fontSize: 'Font Size',
        lineSpacing: 'Line Spacing',
        voiceCommands: 'Voice Commands',
        listening: 'Listening',
        voiceCommandsHelp: 'Voice Commands Help',
        resetToDefault: 'Reset to Default',
        increaseFontSize: 'Increase Font Size',
        decreaseFontSize: 'Decrease Font Size',
        increaseLineSpacing: 'Increase Line Spacing',
        decreaseLineSpacing: 'Decrease Line Spacing'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        close: 'Close'
      }
    }
  },
  mr: {
    translation: {
      // Navigation - मराठी
      nav: {
        home: 'मुख्यपृष्ठ',
        family: 'आमच्याविषयी',
        history: 'इतिहास',
        news: 'बातम्या',
        events: 'कार्यक्रम',
        signIn: 'साइन इन',
        joinFamily: 'कुटुंबात सामील व्हा',
        profile: 'माझी प्रोफाइल',
        signOut: 'साइन आउट',
        language: 'भाषा'
      },
      // Home page - मराठी
      home: {
        title: 'बाल कृष्ण निवास',
        subtitle: 'कौटुंबिक वारसा पोर्टल',
        welcome: 'आमच्या कौटुंबिक वारसामध्ये आपले स्वागत',
        description: 'परंपरा, प्रेम आणि सामायिक आठवणींद्वारे पिढ्यांना जोडणे',
        joinUs: 'आमच्या कुटुंबात सामील व्हा',
        learnMore: 'अधिक जाणून घ्या',
        ourStory: 'आमची कथा',
        storyDescription: 'अनेक पिढ्यांमध्ये पसरलेल्या आमच्या कुटुंबाची समृद्ध वारसा आणि सुंदर प्रवास शोधा.',
        familyNews: 'कौटुंबिक बातम्या',
        newsDescription: 'आमच्या कुटुंबातील नवीनतम घडामोडी, उत्सव आणि टप्पे यांची माहिती घ्या.',
        upcomingEvents: 'आगामी कार्यक्रम',
        eventsDescription: 'वर्षभर होणाऱ्या कौटुंबिक मेळाव्या, सणांमध्ये आणि विशेष प्रसंगांमध्ये आमच्यासोबत सामील व्हा.',
        familyTree: 'कौटुंबिक वृक्ष',
        treeDescription: 'आमच्या कुटुंबाची वंशावळी एक्सप्लोर करा आणि पिढ्यांमधील कनेक्शन शोधा.',
        deviImage: 'ऑडिओ प्ले करण्यासाठी देवीच्या चित्रावर क्लिक करा',
        testAudio: 'ऑडिओ टेस्ट करा',
        heartfeltWelcome: 'आपले हार्दिक स्वागत',
        architecturalMarvel: 'एक अद्भुत स्थापत्य कला जी दैवी कारागिरी आणि आध्यात्मिक भक्तीचा पुरावा म्हणून उभी आहे',
        buildingName: 'बालकृष्ण निवास',
        testButton: 'टेस्ट',
        stopButton: 'थांबवा'
      },
      // Content Data - News Articles - मराठी
      newsContent: {
        article1: {
          title: 'वार्षिक कौटुंबिक मेळावा 2024 जाहीर',
          content: 'आम्ही 2024 च्या आमच्या वार्षिक कौटुंबिक मेळाव्याची घोषणा करताना आनंदित आहोत. यावर्षीचा कार्यक्रम पूर्वीपेक्षा मोठा आणि चांगला असेल, सर्व वयोगटांसाठी कार्यक्रम असतील. हा मेळावा सुंदर गोगटे गार्डनमध्ये होईल, ज्यामध्ये पारंपरिक खेळ, सांस्कृतिक कार्यक्रम आणि आमच्या कुटुंबातील रसोइयांनी तयार केलेली भव्य मेजवानी असेल.',
          summary: 'रोमांचक कार्यक्रम आणि सांस्कृतिक कार्यक्रमांसह वर्षातील आमच्या सर्वात मोठ्या कौटुंबिक मेळाव्यामध्ये आमच्यासोबत सामील व्हा.'
        },
        article2: {
          title: 'कुटुंबात नवजात बाळाचा जन्म',
          content: 'प्रिया आणि अमित गोगटे यांच्या सुंदर मुलाच्या आगमनाबद्दल अभिनंदन! लहान अर्जुनचा जन्म 10 जानेवारीला झाला, वजन 3.2 किलो. आई आणि बाळ दोघेही निरोगी आहेत आणि चांगले आहेत. या नवीन सदस्याने कुटुंब आनंदित आहे.',
          summary: 'प्रिया आणि अमित यांच्या नवीन आगमनाबद्दल - बाळ अर्जुन बद्दल अभिनंदन!'
        },
        article3: {
          title: 'पारंपरिक स्वयंपाक कार्यशाळेत यश',
          content: 'आमची अलीकडील पारंपरिक स्वयंपाक कार्यशाळा मोठे यशस्वी ठरली! 30 हून अधिक कुटुंबातील सदस्यांनी पिढ्यानपिढ्या चालत आलेल्या अस्सल महाराष्ट्रीयन पाककृतींचे शिक्षण घेतले. आमच्या वयोवृद्ध कुटुंबियांचे विशेष आभार ज्यांनी त्यांचे स्वयंपाकाचे ज्ञान सामायिक केले.',
          summary: 'पारंपरिक महाराष्ट्रीयन स्वयंपाक तंत्र शिकण्यासाठी कुटुंबातील सदस्य एकत्र आले.'
        }
      },
      // Content Data - Events - मराठी
      eventContent: {
        event1: {
          title: 'दिवाळी उत्सव 2024',
          description: 'पारंपरिक विधी, सांस्कृतिक कार्यक्रम आणि सामुदायिक मेजवानीसह भव्य दिवाळी उत्सवामध्ये सामील व्हा. यावर्षीच्या उत्सवामध्ये रांगोळी स्पर्धा, पारंपरिक नृत्य कार्यक्रम आणि फटाक्यांचे प्रदर्शन असेल.'
        },
        event2: {
          title: 'कौटुंबिक क्रीडा दिन',
          description: 'क्रिकेट, व्हॉलीबॉल आणि पारंपरिक खेळांचा समावेश असलेला वार्षिक कौटुंबिक क्रीडा दिन. सर्व वयोगटांचे स्वागत! विजेत्यांसाठी बक्षिसे आणि सर्वांसाठी सहभाग प्रमाणपत्रे.'
        },
        event3: {
          title: 'गणेश चतुर्थी उत्सव',
          description: 'सकाळची आरती, सांस्कृतिक कार्यक्रम आणि प्रसाद वितरणासह पारंपरिक गणेश चतुर्थी उत्सव. या शुभ प्रसंगी आमच्यात सामील व्हा.'
        }
      },
      // Family Tree Names - मराठी
      familyNames: {
        ganeshGogte: 'गणेश गोगटे',
        balardGogte: 'बालार्द गोगटे',
        ramakrishnaGogte: 'रामकृष्ण गोगटे',
        balwantGogte: 'बलवंत गोगटे',
        ganeshGogte2: 'गणेश गोगटे',
        hariGogte: 'हरी गोगटे'
      },
      // About page - मराठी
      about: {
        title: 'आमच्याविषयी',
        subtitle: 'आमची कौटुंबिक कथा, उद्दिष्ट आणि मूल्ये',
        description: 'आमच्या कौटुंबिक समुदायाचा पाया आणि हेतू जाणून घ्या'
      },
      // History page - मराठी
      history: {
        title: 'कौटुंबिक इतिहास',
        subtitle: 'ऐतिहासिक टाइमलाइन आणि कौटुंबिक वारसा',
        description: 'कौटुंबिक वारसाच्या पिढ्यांतून प्रवास करा'
      },
      // Family Tree page - मराठी
      familyTree: {
        title: 'कौटुंबिक वृक्ष',
        subtitle: 'इंटरअॅक्टिव्ह कौटुंबिक वृक्ष व्हिज्युअलायझेशन',
        description: 'पिढ्यांमधील कौटुंबिक कनेक्शन एक्सप्लोर करा'
      },
      // News page - मराठी
      news: {
        title: 'कौटुंबिक बातम्या',
        subtitle: 'नवीनतम अपडेट्स आणि घोषणा',
        description: 'कौटुंबिक घडामोडींशी कनेक्ट राहा',
        pageTitle: 'कौटुंबिक बातम्या',
        pageSubtitle: 'नवीनतम कौटुंबिक घोषणा, यश आणि मैलस्तंभांची माहिती घ्या',
        createNews: 'बातमी तयार करा',
        searchPlaceholder: 'बातम्या शोधा...',
        allCategories: 'सर्व श्रेणी',
        announcement: 'घोषणा',
        milestone: 'मैलस्तंभ',
        celebration: 'उत्सव',
        by: 'द्वारा',
        views: 'दर्शने',
        priority: 'प्राधान्य',
        high: 'उच्च',
        medium: 'मध्यम',
        low: 'कमी',
        readMore: 'अधिक वाचा',
        general: 'सामान्य',
        achievement: 'यश',
        memorial: 'स्मारक',
        cultural: 'सांस्कृतिक'
      },
      // Events page - मराठी
      events: {
        title: 'कौटुंबिक कार्यक्रम',
        subtitle: 'उत्सव आणि मेळावे',
        description: 'संस्मरणीय कौटुंबिक प्रसंगांमध्ये आमच्यासोबत सामील व्हा',
        pageTitle: 'कौटुंबिक कार्यक्रम',
        pageSubtitle: 'आगामी कौटुंबिक मेळावे, उत्सव आणि विशेष प्रसंग शोधा आणि त्यात सहभागी व्हा',
        createEvent: 'कार्यक्रम तयार करा',
        searchPlaceholder: 'कार्यक्रम शोधा...',
        allTypes: 'सर्व प्रकार',
        allStatuses: 'सर्व स्थिती',
        festival: 'सण',
        milestone: 'मैलस्तंभ',
        gathering: 'मेळावा',
        memorial: 'स्मारक',
        upcoming: 'आगामी',
        ongoing: 'चालू',
        completed: 'पूर्ण',
        cancelled: 'रद्द',
        location: 'स्थान',
        duration: 'कालावधी',
        attendees: 'उपस्थित',
        viewDetails: 'तपशील पहा'
      },
      // Auth pages - मराठी
      auth: {
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        welcomeBack: 'परत आपले स्वागत',
        signInToAccount: 'आपल्या बाल कृष्ण निवास खात्यात साइन इन करा',
        joinFamily: 'बाल कृष्ण निवासमध्ये सामील व्हा',
        createAccount: 'आपल्या कुटुंबाशी कनेक्ट होण्यासाठी आपले खाते तयार करा',
        firstName: 'पहिले नाव',
        lastName: 'आडनाव',
        email: 'ईमेल',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्डची पुष्टी करा',
        phone: 'फोन',
        dateOfBirth: 'जन्मतारीख',
        gender: 'लिंग',
        occupation: 'व्यवसाय',
        male: 'पुरुष',
        female: 'स्त्री',
        other: 'इतर',
        required: 'आवश्यक',
        enterFirstName: 'पहिले नाव प्रविष्ट करा',
        enterLastName: 'आडनाव प्रविष्ट करा',
        enterEmail: 'आपला ईमेल प्रविष्ट करा',
        enterPassword: 'पासवर्ड प्रविष्ट करा',
        confirmYourPassword: 'आपल्या पासवर्डची पुष्टी करा',
        enterPhone: 'फोन नंबर प्रविष्ट करा',
        selectGender: 'लिंग निवडा',
        enterOccupation: 'व्यवसाय प्रविष्ट करा',
        alreadyHaveMember: 'आधीपासूनच कुटुंबाचे सदस्य आहात?',
        signInHere: 'येथे साइन इन करा',
        loading: 'खाते तयार करत आहे...',
        register: 'नोंदणी करा',
        dontHaveAccount: 'खाते नाही?',
        signUpHere: 'येथे साइन अप करा',
        forgotPassword: 'आपला पासवर्ड विसरलात?'
      },
      // Accessibility - मराठी
      accessibility: {
        toolbar: 'प्रवेशयोग्यता टूलबार',
        fontSize: 'फॉन्ट आकार',
        lineSpacing: 'ओळीमधील अंतर',
        voiceCommands: 'व्हॉईस कमांड',
        listening: 'ऐकत आहे',
        voiceCommandsHelp: 'व्हॉईस कमांड मदत',
        resetToDefault: 'डिफॉल्टवर रीसेट करा',
        increaseFontSize: 'फॉन्ट आकार वाढवा',
        decreaseFontSize: 'फॉन्ट आकार कमी करा',
        increaseLineSpacing: 'ओळीमधील अंतर वाढवा',
        decreaseLineSpacing: 'ओळीमधील अंतर कमी करा'
      },
      // Common - मराठी
      common: {
        loading: 'लोड होत आहे...',
        error: 'त्रुटी',
        success: 'यशस्वी',
        save: 'सेव्ह करा',
        cancel: 'रद्द करा',
        edit: 'संपादित करा',
        delete: 'हटवा',
        view: 'पाहा',
        back: 'मागे',
        next: 'पुढे',
        previous: 'मागील',
        search: 'शोधा',
        filter: 'फिल्टर',
        close: 'बंद करा'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('selectedLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false // Disable suspense for SSR compatibility
    }
  });

export default i18n;