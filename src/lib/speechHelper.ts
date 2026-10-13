/**
 * Utilitários de Voz (Web Speech API nativa do navegador)
 * Custo Zero, Latência Zero, 100% Client-Side.
 */

// Interface para reconhecimento de fala
interface IWindowSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechManager {
  private static synth: SpeechSynthesis | null = null;
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static isSpeaking: boolean = false;

  private static getSynth(): SpeechSynthesis | null {
    if (typeof window === "undefined") return null;
    if (!this.synth && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
    return this.synth;
  }

  /**
   * Fala um texto usando síntese nativa com voz pt-BR
   */
  public static speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    const synth = this.getSynth();
    if (!synth) return;

    // Cancela falas anteriores
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1.05; // Levemente dinâmico
    utterance.pitch = 1.0;

    // Tenta encontrar uma voz em português de boa qualidade
    const voices = synth.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang.startsWith("pt") || v.lang.includes("BR")
    );
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    synth.speak(utterance);
  }

  /**
   * Interrompe qualquer áudio em andamento
   */
  public static stopSpeaking(): void {
    const synth = this.getSynth();
    if (synth) {
      synth.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Verifica se o navegador suporta reconhecimento de voz
   */
  public static isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    const win = window as IWindowSpeech;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  /**
   * Inicia a escuta do microfone para reconhecimento de voz
   */
  public static startListening(
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): boolean {
    if (typeof window === "undefined") return false;
    const win = window as IWindowSpeech;
    const SpeechRecClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecClass) {
      onError(new Error("Reconhecimento de fala não suportado neste navegador."));
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      const rec = new SpeechRecClass();
      rec.lang = "pt-BR";
      rec.continuous = false;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      rec.onerror = (event: any) => {
        this.isListening = false;
        onError(event);
      };

      rec.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition = rec;
      rec.start();
      this.isListening = true;
      return true;
    } catch (err) {
      onError(err);
      return false;
    }
  }

  /**
   * Para a captura de microfone
   */
  public static stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignora se já estiver parado
      }
      this.isListening = false;
    }
  }
}
