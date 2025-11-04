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
        media: 'Gallery',
        news: 'News',
        events: 'Events',
        signIn: 'Sign In',
        joinFamily: 'Join Family',
        profile: 'My Profile',
        signOut: 'Sign Out',
        language: 'Language',
        familyTree: 'Family Tree',
        viewTree: 'View Tree',
        apiTest: 'API Test',
        seedData: 'Seed Data',
        rawData: 'Raw Data',
        dashboard: 'Dashboard',
        familyMembers: 'Family Members',
        selectLanguage: 'Select Language'
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
      mediaPage: {
        header: {
          title: 'Family Memories',
          description: 'Celebrate moments through our collection of family photos from events and milestones'
        },
        upload: {
          title: 'Share Your Memories',
          description: 'Upload photos with a title to add them to the family gallery.',
          albumTitle: 'Album Title',
          albumTitlePlaceholder: 'e.g. Wedding Celebrations',
          descriptionLabel: 'Description (Optional)',
          descriptionPlaceholder: 'Add a short description or story',
          uploadInstructions: 'Click to browse files or drag and drop',
          uploadLimit: 'Up to {{count}} images per upload. Each file must be under {{size}}MB.',
          selectedImages: 'Selected Images',
          clearAll: 'Clear All',
          imageName: 'Image {{index}}',
          uploadButton: 'Upload Memories',
          uploading: 'Uploading...',
          preparing: 'Preparing…',
          success: 'Your photos have been uploaded to the gallery.',
          error: 'Failed to upload photos. Please try again.',
          loginRequired: 'Please log in to upload photos.'
        },
        communityUploads: {
          title: 'Recent Community Uploads',
          empty: 'No community uploads yet. Be the first to share!',
          photos: '{{count}} {{count, plural, one {photo} other {photos}}}',
          morePhotos: '+{{count}} more',
          uploadedBy: 'Uploaded by {{name}}'
        },
        search: {
          placeholder: 'Search albums by title or caption...'
        },
        filters: {
          allTypes: 'All Albums',
          events: 'Events',
          news: 'News',
          community: 'Community',
          sortLabel: 'Sort by',
          typeLabel: 'Type',
          yearLabel: 'Year',
          categoryLabel: 'Category',
          eventTypeLabel: 'Event Type',
          reset: 'Reset Filters',
          yearsAll: 'All Years',
          categoriesAll: 'All Categories',
          eventTypesAll: 'All Event Types',
          sortRecent: 'Newest',
          sortOldest: 'Oldest',
          sortTitle: 'Title (A-Z)',
          sortPhotos: 'Most Photos'
        },
        sort: {
          recent: 'Newest',
          oldest: 'Oldest',
          title: 'Title (A-Z)',
          photos: 'Most Photos'
        },
        albums: {
          eventType: 'Event',
          newsType: 'News',
          communityType: 'Community',
          photoCount: '{{count}} {{count, plural, one {photo} other {photos}}}',
          unknownUploader: 'Unknown'
        },
        lightbox: {
          autoPlay: 'Auto-play',
          download: 'Download',
          preparing: 'Preparing…',
          counter: '{{current}} / {{total}}',
          date: '{{date, date, long}}',
          thumbnailStrip: 'Image thumbnails'
        },
        emptyState: {
          title: 'No memories yet',
          noResults: 'No albums match your search. Try a different query.',
          noAlbums: 'No photo albums available from events or news yet.'
        },
        loading: {
          title: 'Gathering your memories...',
          subtitle: 'This may take a moment'
        }
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
        balalGogte: 'Balal Gogte', 
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
      // About BKN (EN)
      aboutBKN: {
        heading: 'BalKrishna Nivas',
        subheading: 'Hyderabad, Kachiguda — Heritage and Legacy',
        intro1: 'Dr. Shankarrao Balwant Gogte established his medical practice in Hyderabad, the capital of the Nizam state. In his short life (1892–1935), he became one of the leading physicians of the state.',
        intro2: 'Between 1931–33, he purchased about 1,200 square yards of land at Kachiguda and built a haveli. In 1935, the building was named “BalKrishna Nivas” after his son.',
        features: 'The two-storey bungalow featured underground fuel storage, two basements, a small 5-room house in the backyard, a garage, four clinic rooms by the street, a tulsi vrindavan at the back, and a fountain pond in the front courtyard.',
        family: 'After his demise in 1935, his wife Parvatibai courageously nurtured one son and five daughters through a delicate phase of life and the transition from Nizam rule to the Indian state, while maintaining strong ties with the Gogte and Bhide families.',
        care: 'She brought relatives to live at BalKrishna Nivas and supported them through hardships — including her brother Vasudev Bhide after he lost his job.',
        legacy: 'Later, their son BalKrishna (PhD in Geology) carried forward the traditions. Today, the values of BalKrishna Nivas are carried forward by Shri Neel Gogte (Founder, Keshav Memorial Group of Colleges) and Mrs. Manisha Gogte (Founder, Telangana State Dyslexia Association).',
        changes: 'Over time, the backyard house became a lawn area, the clinic section at the front was sold, three basements were sealed, car parking was added in the front yard, and roofing was added to protect the old structure from moisture and rain.',
        galleryTitle: 'Historic Gallery',
        galleryCaption2: 'BalKrishna Nivas — Facade (c. mid 20th century)',
        galleryCaption3: 'Heritage details and family memories',
        galleryCaption4: 'Legacy preserved with love and devotion',
        galleryCaption5: 'Documents and keepsakes of the era',
        timelineTitle: 'A Journey Through Time',
        cta: 'Back to Home'
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
        registrationPendingApproval: 'Your registration will be reviewed by an administrator. Approved credentials will be emailed to you.',
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
        media: 'गॅलरी',
        news: 'बातम्या',
        events: 'कार्यक्रम',
        signIn: 'साइन इन',
        joinFamily: 'कुटुंबात सामील व्हा',
        profile: 'माझी प्रोफाइल',
        signOut: 'साइन आउट',
        language: 'भाषा',
        familyTree: 'कौटुंबिक वृक्ष',
        viewTree: 'वृक्ष पहा',
        apiTest: 'API टेस्ट',
        seedData: 'सीड डेटा',
        rawData: 'रॉ डेटा',
        dashboard: 'डॅशबोर्ड',
        familyMembers: 'कुटुंबातील सदस्य',
        selectLanguage: 'भाषा निवडा'
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
        buildingName: 'बाळकृष्ण निवास',
        testButton: 'टेस्ट',
        stopButton: 'थांबवा'
      },
      mediaPage: {
        header: {
          title: 'कौटुंबिक आठवणी',
          description: 'कार्यक्रम आणि महत्त्वाच्या क्षणांमधील कौटुंबिक छायाचित्रांच्या संग्रहातून आठवणी जतन करा'
        },
        upload: {
          title: 'आठवणी सामायिक करा',
          description: 'कुटुंबाच्या गॅलरीत छायाचित्रे जोडण्यासाठी शीर्षकासह फोटो अपलोड करा.',
          albumTitle: 'अल्बम शीर्षक',
          albumTitlePlaceholder: 'उदा. लग्न सोहळा',
          descriptionLabel: 'वर्णन (ऐच्छिक)',
          descriptionPlaceholder: 'संक्षिप्त वर्णन किंवा कथा जोडा',
          uploadInstructions: 'फायली निवडण्यासाठी क्लिक करा किंवा ड्रॅग आणि ड्रॉप करा',
          uploadLimit: 'एकावेळी {{count}} फोटो अपलोड करू शकता. प्रत्येक फाइलचा आकार {{size}}MB च्या आत असावा.',
          selectedImages: 'निवडलेले फोटो',
          clearAll: 'सर्व साफ करा',
          imageName: 'फोटो {{index}}',
          uploadButton: 'आठवणी अपलोड करा',
          uploading: 'अपलोड करत आहे...',
          preparing: 'तयार करत आहे…',
          success: 'आपले फोटो गॅलरीमध्ये अपलोड झाले आहेत.',
          error: 'फोटो अपलोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
          loginRequired: 'फोटो अपलोड करण्यासाठी कृपया लॉग इन करा.'
        },
        communityUploads: {
          title: 'नवीन कम्युनिटी अपलोड्स',
          empty: 'अजून कम्युनिटी अपलोड्स नाहीत. पहिला फोटो तुम्ही सामायिक करा!',
          photos: '{{count}} {{count, plural, one {फोटो} other {फोटो}}}',
          morePhotos: '+{{count}} अधिक',
          uploadedBy: '{{name}} यांनी अपलोड केले'
        },
        search: {
          placeholder: 'अल्बम शीर्षक किंवा कॅप्शनद्वारे शोधा...'
        },
        filters: {
          allTypes: 'सर्व अल्बम',
          events: 'कार्यक्रम',
          news: 'बातम्या',
          community: 'कम्युनिटी',
          sortLabel: 'क्रम',
          typeLabel: 'प्रकार',
          yearLabel: 'वर्ष',
          categoryLabel: 'श्रेणी',
          eventTypeLabel: 'कार्यक्रम प्रकार',
          reset: 'फिल्टर रीसेट करा',
          yearsAll: 'सर्व वर्षे',
          categoriesAll: 'सर्व श्रेणी',
          eventTypesAll: 'सर्व कार्यक्रम प्रकार',
          sortRecent: 'नवीनतम',
          sortOldest: 'जुने',
          sortTitle: 'शीर्षक (अ-ह)',
          sortPhotos: 'जास्त फोटो'
        },
        sort: {
          recent: 'नवीनतम',
          oldest: 'जुने',
          title: 'शीर्षक (अ-ह)',
          photos: 'जास्त फोटो'
        },
        albums: {
          eventType: 'कार्यक्रम',
          newsType: 'बातमी',
          communityType: 'कम्युनिटी',
          photoCount: '{{count}} {{count, plural, one {फोटो} other {फोटो}}}',
          unknownUploader: 'अज्ञात'
        },
        lightbox: {
          autoPlay: 'स्वयं-प्लेय',
          download: 'डाऊनलोड',
          preparing: 'तयार करत आहे…',
          counter: '{{current}} / {{total}}',
          date: '{{date, date, long}}',
          thumbnailStrip: 'फोटो थंबनेल्स'
        },
        emptyState: {
          title: 'अजून आठवणी नाहीत',
          noResults: 'आपल्या शोधाशी जुळणारे अल्बम नाहीत. कृपया वेगळा शोध वापरा.',
          noAlbums: 'कार्यक्रम किंवा बातम्यांचे फोटो अल्बम उपलब्ध नाहीत.'
        },
        loading: {
          title: 'आपल्या आठवणी एकत्र करत आहोत...',
          subtitle: 'कृपया थोडा वेळ प्रतीक्षा करा'
        }
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
        balalGogte: 'बलाल गोगटे',
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
      // About BKN (MR)
      aboutBKN: {
        heading: 'बाळकृष्ण निवास',
        subheading: 'हैदराबाद, काचीगुडा — वारसा आणि परंपरा',
        intro1: 'डॉ. शंकरराव बळवंत गोगटे यांनी निजाम राज्याची राजधानी हैदराबाद येथे त्यांचा वैद्यकीय दवाखाना स्थापन केला. त्यांच्या अल्पायुष्यात (१८९२–१९३५) ते निजाम राज्यातील आघाडीच्या डॉक्टरांपैकी एक बनले.',
        intro2: '१९३१–३३ दरम्यान काचीगुडा येथे सुमारे १२०० चौरस यार्ड जागा खरेदी करून त्यांनी एक हवेली उभारली. १९३५ मध्ये त्यांच्या पुत्राच्या नावावर या इमारतीला “बाळकृष्ण निवास” असे नाव देण्यात आले.',
        features: 'या दोन मजली बंगल्यात भूमिगत इंधन साठवण, दोन तळघर, मागे ५ खोल्यांचे घर, गॅरेज, रस्त्यालगत क्लिनिकसाठी ४ खोल्या, मागील आवारात तुळशीवृंदावन आणि समोरील अंगणात कारंजे असलेले तळे अशी वैशिष्ट्ये होती.',
        family: '१९३५ मध्ये त्यांच्या निधनानंतर, पत्नी पार्वतीबाईंनी आयुष्यातील नाजूक टप्प्यात आणि निजामशाहीपासून भारतीय राज्यात संक्रमणाच्या काळात एक मुलगा आणि पाच मुलींना उत्तम संस्कार देऊन वाढवले आणि गोगटे व भिडे कुटुंबियांसोबत मजबूत नाती जपली.',
        care: 'तिने नातेवाईकांना बाळकृष्ण निवासात राहण्यासाठी आणले आणि त्यांच्या कठीण प्रसंगात साथ दिली — तिच्या भावाला वासुदेव भिडे यालाही नोकरी गेल्यावर आधार दिला.',
        legacy: 'नंतर त्यांचा मुलगा बाळकृष्ण (भूशास्त्रात डॉक्टरेट) यांनी घराची परंपरा पुढे नेली. आज या घराच्या मूल्यांना श्री. नील गोगटे (केशव मेमोरियल ग्रुप ऑफ कॉलेजेसचे संस्थापक) आणि श्रीमती मनीषा गोगटे (तेलंगाणा स्टेट डिस्लेक्सिया असोसिएशनच्या संस्थापिका) पुढे नेत आहेत.',
        changes: 'काळानुसार मागील घर लॉनमध्ये रूपांतरित झाले, समोरील क्लिनिकचा भाग विकला गेला, तीन तळघर बुजवली गेली, समोरील अंगणात पार्किंगची सोय झाली आणि जुन्या वास्तूचे संरक्षण करण्यासाठी छप्पर घालण्यात आले.',
        galleryTitle: 'ऐतिहासिक गॅलरी',
        galleryCaption2: 'बाळकृष्ण निवास — समोरील दर्शनी भाग (इ. स. मध्य २०वे शतक)',
        galleryCaption3: 'वारशाचे तपशील आणि कौटुंबिक आठवणी',
        galleryCaption4: 'प्रेमाने आणि जतनाने टिकवलेली परंपरा',
        galleryCaption5: 'त्या काळातील दस्तऐवज आणि स्मृतिचिन्हे',
        timelineTitle: 'काळाचा प्रवास',
        cta: 'मुख्यपृष्ठावर परत'
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
        views: 'पाहिले',
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
        registrationPendingApproval: 'आपली नोंदणी प्रशासकाद्वारे तपासली जाईल. मंजूर झाल्यावर आपल्याला ईमेलद्वारे माहिती मिळेल.',
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