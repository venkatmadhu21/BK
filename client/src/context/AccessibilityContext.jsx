import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(100); // Percentage
  const [lineHeight, setLineHeight] = useState(1.5); // Line height multiplier
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // No localStorage - settings are session-based only
  
  // Clean up accessibility classes on mount
  useEffect(() => {
    document.body.classList.remove('accessibility-active');
  }, []);

  // Apply styles to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accessibility-font-size', `${fontSize}%`);
    root.style.setProperty('--accessibility-line-height', lineHeight);
    
    // Only add accessibility-active class when settings are changed from defaults
    const isAccessibilityActive = fontSize !== 100 || lineHeight !== 1.5;
    
    if (isAccessibilityActive) {
      document.body.classList.add('accessibility-active');
    } else {
      document.body.classList.remove('accessibility-active');
    }
  }, [fontSize, lineHeight]);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150); // Max 150%
    setFontSize(newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80); // Min 80%
    setFontSize(newSize);
  };

  const increaseLineHeight = () => {
    const newHeight = Math.min(lineHeight + 0.1, 2.5); // Max 2.5
    setLineHeight(newHeight);
  };

  const decreaseLineHeight = () => {
    const newHeight = Math.max(lineHeight - 0.1, 1.2); // Min 1.2
    setLineHeight(newHeight);
  };

  const resetToDefault = () => {
    setFontSize(100);
    setLineHeight(1.5);
    setIsVoiceEnabled(false);
    stopVoiceRecognition();
    
    // Ensure accessibility classes are removed
    document.body.classList.remove('accessibility-active');
  };

  const toggleVoiceCommands = () => {
    const newVoiceState = !isVoiceEnabled;
    setIsVoiceEnabled(newVoiceState);
    
    if (newVoiceState) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    console.log('🎤 Attempting to start voice recognition...');
    
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ Speech recognition not supported in this browser');
      alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsVoiceEnabled(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      
      // Enhanced configuration
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('✅ Voice recognition started successfully');
        setIsListening(true);
        
        // Show visual feedback
        const notification = document.createElement('div');
        notification.textContent = '🎤 Voice commands active - Say "increase font", "high contrast", etc.';
        notification.style.cssText = `
          position: fixed;
          top: 100px;
          right: 20px;
          background: #3b82f6;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 9999;
          max-width: 300px;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      };

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript;
          console.log('🎯 Voice command detected:', command);
          console.log('🔧 Confidence:', lastResult[0].confidence);
          handleVoiceCommand(command);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = '';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
            setIsVoiceEnabled(false);
            break;
          case 'no-speech':
            console.log('⏸️ No speech detected, continuing to listen...');
            return; // Don't show alert for no-speech
          case 'audio-capture':
            errorMessage = 'No microphone found. Please connect a microphone and try again.';
            setIsVoiceEnabled(false);
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        if (errorMessage) {
          alert(errorMessage);
        }
      };

      recognition.onend = () => {
        console.log('🔄 Voice recognition ended');
        setIsListening(false);
        
        // Auto-restart if still enabled and no error occurred
        if (isVoiceEnabled) {
          setTimeout(() => {
            console.log('🔄 Restarting voice recognition...');
            startVoiceRecognition();
          }, 1000);
        }
      };

      console.log('🚀 Starting speech recognition...');
      recognition.start();
      window.speechRecognition = recognition;
      
    } catch (error) {
      console.error('❌ Failed to initialize voice recognition:', error);
      setIsVoiceEnabled(false);
      setIsListening(false);
      alert('Failed to start voice recognition. Please try again or check your microphone permissions.');
    }
  };

  const stopVoiceRecognition = () => {
    if (window.speechRecognition) {
      window.speechRecognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (command) => {
    console.log('Voice command received:', command);
    
    // Normalize the command
    const normalizedCommand = command.toLowerCase().trim();
    
    // Create a visual feedback function
    const showVoiceCommandFeedback = (message) => {
      // Create temporary notification
      const notification = document.createElement('div');
      notification.textContent = `🎤 ${message}`;
      notification.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #059669, #10b981);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.opacity = '1';
      }, 10);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    };

    // Enhanced command matching
    let commandExecuted = false;

    // Font size commands
    if (normalizedCommand.match(/increase|bigger|larger|more.*font|font.*up/)) {
      increaseFontSize();
      showVoiceCommandFeedback('Font size increased');
      commandExecuted = true;
    } else if (normalizedCommand.match(/decrease|smaller|reduce|less.*font|font.*down/)) {
      decreaseFontSize();
      showVoiceCommandFeedback('Font size decreased');
      commandExecuted = true;
    }
    
    // Line spacing commands
    else if (normalizedCommand.match(/increase.*spacing|more.*spacing|spacing.*up|line.*up/)) {
      increaseLineHeight();
      showVoiceCommandFeedback('Line spacing increased');
      commandExecuted = true;
    } else if (normalizedCommand.match(/decrease.*spacing|less.*spacing|spacing.*down|line.*down/)) {
      decreaseLineHeight();
      showVoiceCommandFeedback('Line spacing decreased');
      commandExecuted = true;
    }
    

    
    // Reset commands
    else if (normalizedCommand.match(/reset|default|clear|original/)) {
      resetToDefault();
      showVoiceCommandFeedback('Settings reset to default');
      commandExecuted = true;
    }
    
    // Navigation commands
    else if (normalizedCommand.match(/go.*home|home.*page|navigate.*home/)) {
      window.location.href = '/';
      showVoiceCommandFeedback('Going to home page');
      commandExecuted = true;
    }

    // If no command was recognized
    if (!commandExecuted) {
      console.log('Command not recognized:', normalizedCommand);
      showVoiceCommandFeedback(`Command not recognized: "${normalizedCommand}"`);
    }
  };

  // Expose for debugging in browser console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.accessibilityContext = {
        handleVoiceCommand,
        startVoiceRecognition,
        stopVoiceRecognition,
        state: {
          fontSize,
          lineHeight,
          isVoiceEnabled,
          isListening
        }
      };
    }
  }, [fontSize, lineHeight, isVoiceEnabled, isListening]);

  const value = {
    fontSize,
    lineHeight,
    isVoiceEnabled,
    isListening,
    increaseFontSize,
    decreaseFontSize,
    increaseLineHeight,
    decreaseLineHeight,
    toggleVoiceCommands,
    resetToDefault,
    handleVoiceCommand // Expose for testing
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;