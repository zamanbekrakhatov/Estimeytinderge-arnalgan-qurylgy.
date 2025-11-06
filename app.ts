import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseSpeechRecognitionProps {
  language: 'kk-KZ' | 'ru-RU';
}

export const useSpeechRecognition = ({ language }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error(
        language === 'kk-KZ'
          ? 'Браузер дыбыс тануды қолдамайды'
          : 'Браузер не поддерживает распознавание речи'
      );
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript((prev) => {
        const updated = prev + finalTranscript;
        return updated + interimTranscript;
      });
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        toast.info(
          language === 'kk-KZ'
            ? 'Дыбыс анықталмады'
            : 'Речь не обнаружена'
        );
      } else if (event.error === 'not-allowed') {
        toast.error(
          language === 'kk-KZ'
            ? 'Микрофонға рұқсат беріңіз'
            : 'Разрешите доступ к микрофону'
        );
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      if (isListeningRef.current) {
        try {
          recognitionInstance.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setIsListening(false);
          isListeningRef.current = false;
        }
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        isListeningRef.current = true;
        toast.success(
          language === 'kk-KZ'
            ? 'Тыңдау басталды'
            : 'Прослушивание начато'
        );
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [recognition, language]);

  const stopListening = useCallback(() => {
    if (recognition) {
      isListeningRef.current = false;
      recognition.stop();
      setIsListening(false);
      toast.info(
        language === 'kk-KZ'
          ? 'Тыңдау тоқтатылды'
          : 'Прослушивание остановлено'
      );
    }
  }, [recognition, language]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
  };
};
