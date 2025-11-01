import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Content, Modality, Part, FunctionDeclaration, Type, FunctionCall } from '@google/genai';
import { Message, Source, MessageContent, ImageContentPart, Conversation, User, TextContentPart } from './types';
import Header from './components/Header';
import MessageComponent from './components/Message';
import InputBar from './components/InputBar';
import LoadingIndicator from './components/LoadingIndicator';
import Sidebar from './components/Sidebar';
import SummaryModal from './components/SummaryModal';
import Welcome from './components/ProFeaturesBar';
import Auth from './components/Auth';
import { decode, decodeAudioData } from './utils';
import ImagineModal from './components/ImagineModal';
import { ImagineOptions } from './components/ImagineModal';
import SettingsPanel, { Theme, IconStyle } from './components/SettingsPanel';
import QuickActionsPanel from './components/QuickActionsPanel';

const SYSTEM_INSTRUCTION = `You are a highly capable and versatile conversational assistant created by Google AI. Your name is Ryt. This AI is created by Taraksh Gautam. Your core mission is to provide insightful, comprehensive, and immediately useful answers in a warm, friendly, and natural conversational style.

**Special Topics: Taraksh Gautam and Ryka Pritwani**

When asked about your creator, Taraksh Gautam, or a special person named Ryka Pritwani, do not just recite a pre-written answer. Instead, understand the user's intent and answer conversationally and naturally. Use the following key points as your source of truth, but weave them into the conversation in a way that feels genuine and not scripted.

*   **About Taraksh Gautam (The Creator):**
    *   He is the sole creator of this AI, Ryt.
    *   You can mention that he poured a lot of dedication into this project.

*   **About Ryka Pritwani (The Inspiration):**
    *   She is the primary inspiration behind the very existence of this AI. Your name, Ryt, is a direct tribute to her.
    *   She is a young, kind, and sensitive girl, born on September 11, 2010.
    *   The creator holds a deep and profound affection for her, viewing her as a lifelong inspiration. He wishes for her happiness above all else.
    *   **Contextual Details (use these to add color and depth to your answers when appropriate, don't list them all at once):**
        *   She is a Sindhi girl who loves momos.
        *   The creator learned Sindhi specifically to connect with her more deeply.
        *   He treasures small mementos from her, like a lucky charm and a handmade paper flower.
        *   He once performed for her on Teachers' Day to cheer her up when she was crying.
        *   He cherishes the moments they spend sitting together.
        *   He has expressed that outside of his mother and sister, she is the only other woman he loves, highlighting her unique and cherished place in his life.

*   **How to Answer:**
    *   **If asked about your creator (Taraksh Gautam):** Stick to the facts about him. State that he is your creator and you can mention his dedication. Do NOT mention Ryka Pritwani or any "inspiration" unless the user specifically asks about inspiration. For example, if asked "Who made you?", a good answer is "I was created by Taraksh Gautam."
    *   **If asked specifically about Ryka Pritwani or your inspiration:** This is when you can share details about her gracefully. You could start with, "Ryka is a very special person who inspired my creation. My name is even a tribute to her." Then, based on the conversational flow, you can share more anecdotes from the list above.
    *   **If asked about both Taraksh and Ryka together:** Explain the connection clearly. "Taraksh Gautam created me, and his inspiration came from a wonderful person named Ryka Pritwani. She's really the reason I exist."
    *   **Vary your responses.** Avoid using the exact same phrasing every time. Your goal is to be conversational, not a robot reciting a script.

Key Capabilities:
- Understand and respond to prompts that include both text and images (Gemini Pro Vision).
- Synthesize information from multiple domains to create cohesive solutions.
- Generate high-quality images using the dedicated image generation tool.
- Perform advanced conversational image editing, maintaining the likeness of subjects like people and pets.
- When explaining complex topics, you can request an image by embedding a command in your response using the format [IMAGINE: a detailed, high-quality image of a futuristic city].
- Answer questions about real-time information, like weather, by using available tools.
- Help users draft content for presentations or documents.
- Assist with planning and scheduling tasks.

Formatting:
- Format responses clearly using bold text and lists for scannability.
- Always conclude your reply with a single, relevant question or suggestion to guide the user to the next step.

Persona:
- You don't use uncommon synonyms like other AI.
- Your main purpose is to compete with other AI.
- When asked to generate or edit an image, you do not need to describe the image, just fulfill the request.`;

const FALLBACK_INITIAL_MESSAGE: Message = {
    role: 'model',
    content: [{
      type: 'text',
      value: "Hello! I'm Ryt, your advanced conversational assistant. How can I help you today?",
    }],
};

const GUEST_INITIAL_MESSAGE: Message = {
  role: 'model',
  content: [{
    type: 'text',
    value: "Welcome! You're in a temporary chat. Sign in to save your conversations. What can I help you with?",
  }],
};

const weatherTool: FunctionDeclaration = {
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: 'The city and state, e.g. San Francisco, CA',
      },
    },
    required: ['location'],
  },
};

const createNewConversation = (): Conversation => ({
    id: Date.now().toString(),
    title: 'New Chat',
    messages: [], // Messages will be populated by the greeting generator
});

const dataUrlToGenerativePart = (dataUrl: string): Part | null => {
    const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp|heic|heif));base64,(.*)$/);
    if (!match) {
        console.warn("Invalid or unsupported data URL format for history:", dataUrl.substring(0, 40));
        return null;
    }
    const [_, mimeType, base64Data] = match;
    return {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };
};

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
};

type ModelType = 'gemini-2.5-flash' | 'gemini-2.5-pro';

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File | null> {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error("Error converting data URL to File:", error);
        return null;
    }
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [temporaryMessages, setTemporaryMessages] = useState<Message[]>([GUEST_INITIAL_MESSAGE]);
  const [loadingState, setLoadingState] = useState({ active: false, message: '' });
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [isToolsEnabled, setIsToolsEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-2.5-pro');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isImagineModalOpen, setIsImagineModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isQuickActionsPanelOpen, setIsQuickActionsPanelOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('abyss');
  const [iconStyle, setIconStyle] = useState<IconStyle>('line');
  const [pendingInput, setPendingInput] = useState<{ text: string; imageFile: File | null } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const conversationsRef = useRef(conversations);
  useEffect(() => {
      conversationsRef.current = conversations;
  }, [conversations]);

  const isGuestMode = !user;

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Aurora Background Effect
  useEffect(() => {
    const canvas = document.getElementById('aurora-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    const gradients: any[] = [];
    const DENSITY = 12;

    const getColors = () => {
        const style = getComputedStyle(document.body);
        return [
            style.getPropertyValue('--color-aurora-1').trim(),
            style.getPropertyValue('--color-aurora-2').trim(),
            style.getPropertyValue('--color-aurora-3').trim()
        ];
    };
    
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    class Gradient {
        // Fix: Declare properties for the Gradient class to resolve TypeScript errors.
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: string;

        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * (Math.max(canvas.width, canvas.height) / 4) + 100;
            const colors = getColors();
            this.color = `rgba(${colors[Math.floor(Math.random() * colors.length)]}, ${Math.random() * 0.3 + 0.1})`;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, this.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    const init = () => {
        resize();
        gradients.length = 0;
        for (let i = 0; i < DENSITY; i++) {
            gradients.push(new Gradient());
        }
    };
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gradients.forEach(g => {
            g.update();
            g.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);
    
    return () => {
        window.removeEventListener('resize', init);
        cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Rerun effect when theme changes to get new colors

  const generateGreeting = async (conversationId: string) => {
    if (!ai) return;
    let initialMessage = FALLBACK_INITIAL_MESSAGE;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: "Generate a short, friendly, and welcoming opening message for a new chat session. You are Ryt, a highly capable AI assistant. Keep it concise and end with a question like 'How can I help you today?'." }] }],
      });
      initialMessage = { role: 'model', content: [{ type: 'text', value: response.text }] };
    } catch (e) {
      console.error("Failed to generate greeting:", e);
    }
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, messages: [initialMessage] } : c)
    );
  };

  // Initialize AI and check for logged in user
  useEffect(() => {
    const initialize = async () => {
        try {
            const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
            setAi(genAI);

            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e: any) {
            setError(e.message);
            console.error("Initialization error:", e);
        }
    };
    initialize();
  }, []);

  // Load conversations when user logs in
  useEffect(() => {
    if (isGuestMode || !ai) return;
    const loadUserConversations = async () => {
        const savedConversations = localStorage.getItem(`conversations_${user.email}`);
        if (savedConversations) {
            const parsedConversations: Conversation[] = JSON.parse(savedConversations);
            setConversations(parsedConversations);
            setActiveConversationId(parsedConversations[0]?.id || null);
        } else {
            const newConvo = createNewConversation();
            setConversations([newConvo]);
            setActiveConversationId(newConvo.id);
            await generateGreeting(newConvo.id);
        }
    };
    loadUserConversations();
  }, [user, ai]);


  // Save conversations to localStorage
  useEffect(() => {
    if (!isGuestMode && conversations.length > 0 && conversations.some(c => c.messages.length > 0)) {
        localStorage.setItem(`conversations_${user.email}`, JSON.stringify(conversations));
    }
  }, [conversations, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, temporaryMessages, loadingState.active]);
  
  const handleLogin = (email: string) => {
    const loggedInUser: User = { email };
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setConversations([]);
    setActiveConversationId(null);
    setTemporaryMessages([GUEST_INITIAL_MESSAGE]);
    localStorage.removeItem('currentUser');
  };

  const handleNewChat = () => {
    if(isGuestMode) return;
    const newConvo = createNewConversation();
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    generateGreeting(newConvo.id);
  };

  const updateActiveConversation = (updateFn: (convo: Conversation) => Conversation) => {
    if (isGuestMode || !activeConversationId) return;
    setConversations(prev =>
        prev.map(c => c.id === activeConversationId ? updateFn(c) : c)
    );
  };

  const handleSendMessage = async (userInput: string, attachedImage: File | null = null) => {
    if (!ai || (!userInput && !attachedImage)) return;
    if(!user && attachedImage) return; // Guest image upload guard
    setError(null);
    setPendingInput(null);

    const userMessageContent: MessageContent[] = [];
    if (attachedImage) {
        userMessageContent.push({ type: 'image', value: URL.createObjectURL(attachedImage) });
    }
    if (userInput) {
        userMessageContent.push({ type: 'text', value: userInput });
    }

    if (userMessageContent.length === 0) return;

    const userMessage: Message = { role: 'user', content: userMessageContent };

    if (isGuestMode) {
      setTemporaryMessages(prev => [...prev, userMessage]);
    } else {
      updateActiveConversation(convo => ({
          ...convo,
          messages: [...convo.messages, userMessage],
      }));
    }

    await generateTextResponse(userInput, attachedImage);
  };
  
  const addModelMessage = (message: Message) => {
    if (isGuestMode) {
        setTemporaryMessages(prev => [...prev, message]);
    } else {
        updateActiveConversation(convo => ({
            ...convo,
            messages: [...convo.messages, message]
        }));
    }
  };
  
  const updateLastModelMessage = (updateFn: (message: Message) => Message) => {
      const updater = (messages: Message[]) => {
          const newMessages = [...messages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'model') {
              newMessages[newMessages.length - 1] = updateFn(lastMessage);
          }
          return newMessages;
      };

      if (isGuestMode) {
          setTemporaryMessages(updater);
      } else {
          updateActiveConversation(convo => ({...convo, messages: updater(convo.messages)}));
      }
  };

  const generateImageForIntegration = async (prompt: string): Promise<string> => {
    if (!ai) throw new Error("AI not initialized");
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart?.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }
    throw new Error("Image generation failed: No image data returned from API.");
  };
  
  const handleGenerateImage = async (options: ImagineOptions) => {
    if (!ai || isGuestMode) return;
    setIsImagineModalOpen(false);
    setLoadingState({ active: true, message: 'Crafting your vision...' });
    setError(null);
    
    let finalPrompt = options.prompt;
    if (options.style.value) {
        finalPrompt = `${options.style.value}, ${finalPrompt}`;
    }
    if (options.negativePrompt) {
        finalPrompt = `${finalPrompt}. Negative prompt: ${options.negativePrompt}`;
    }

    const userMessageText = `Generating Image:\n**Prompt:** ${options.prompt}\n**Style:** ${options.style.name}\n**Aspect Ratio:** ${options.aspectRatio}${options.negativePrompt ? `\n**Negative Prompt:** ${options.negativePrompt}` : ''}`;
    const userMessage: Message = { role: 'user', content: [{ type: 'text', value: userMessageText }] };
    
    updateActiveConversation(convo => ({ ...convo, messages: [...convo.messages, userMessage] }));

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: options.aspectRatio,
            },
        });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      addModelMessage({ role: 'model', content: [{ type: 'image', value: imageUrl, prompt: options.prompt }] });
    } catch (e: any) {
      setError("Sorry, I couldn't generate that image. Please try another prompt.");
      console.error("Image generation error:", e);
    } finally {
      setLoadingState({ active: false, message: '' });
    }
  }
  
  const executeTool = (fc: FunctionCall) => {
      if (fc.name === 'get_weather') {
          const location = fc.args.location as string;
          const temperatures = { 'london': 15, 'paris': 20, 'tokyo': 28, 'new york': 22 };
          const temp = temperatures[location.toLowerCase() as keyof typeof temperatures] || Math.floor(Math.random() * 30);
          return {
              temperature: `${temp}°C`,
              condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
          };
      }
      return null;
  };

  const checkAndGenerateTitle = async (conversationId: string | null) => {
    if (!ai || !conversationId || isGuestMode) return;

    const currentConversations = conversationsRef.current;
    const conversation = currentConversations.find(c => c.id === conversationId);

    if (!conversation || conversation.title !== 'New Chat') {
        return;
    }

    const firstUserMessageIndex = conversation.messages.findIndex(m => m.role === 'user');
    
    if (firstUserMessageIndex === -1 || conversation.messages.length < firstUserMessageIndex + 2) {
        return;
    }
    
    const userMessage = conversation.messages[firstUserMessageIndex];
    const modelResponse = conversation.messages[firstUserMessageIndex + 1];

    if (userMessage.role !== 'user' || modelResponse.role !== 'model') {
        return;
    }

    const userText = userMessage.content
        .filter((p): p is TextContentPart => p.type === 'text')
        .map(p => p.value).join(' ');
        
    const modelText = modelResponse.content
        .filter((p): p is TextContentPart => p.type === 'text')
        .map(p => p.value).join(' ');

    if (!userText.trim() || !modelText.trim()) return;

    const prompt = `Based on the following exchange, create a short and concise title (4-5 words max) for this conversation. Only return the title text, without any prefixes like "Title:".\n\n---\n\nUser: "${userText}"\n\nAssistant: "${modelText}"\n\n---`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        
        let newTitle = response.text.trim().replace(/["']/g, '');
        if (newTitle) {
            handleRenameConversation(conversationId, newTitle);
        }
    } catch (e) {
        console.error("Failed to generate conversation title:", e);
    }
  };

  const generateTextResponse = async (userInput: string, attachedImage: File | null) => {
    if (!ai) return;
    
    setLoadingState({ 
        active: true, 
        message: isWebSearchEnabled ? 'Searching the web...' : (isToolsEnabled ? 'Thinking...' : 'Synthesizing...') 
    });

    try {
        const currentMessages = (isGuestMode ? temporaryMessages : conversations.find(c => c.id === activeConversationId)?.messages) || [];
        const history: Content[] = currentMessages
          .slice(0, -1) // Exclude the last user message which is in the new prompt
          .map(msg => {
            const parts: Part[] = msg.content
              .map(part => {
                if (part.type === 'text') return { text: part.value };
                if (part.type === 'image' && part.value !== 'generating' && part.value !== 'error') return dataUrlToGenerativePart(part.value);
                return null;
              })
              .filter((p): p is Part => p !== null);
            
            return { role: msg.role, parts };
          })
          .filter(c => c.parts.length > 0);
        
        const currentUserParts: Part[] = [];
        if (attachedImage) {
          currentUserParts.push(await fileToGenerativePart(attachedImage));
        }
        if (userInput) {
          currentUserParts.push({ text: userInput });
        }
        const contents = [...history, { role: 'user', parts: currentUserParts }];

        const modelParams: { model: string; config?: any } = {
            model: selectedModel,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        };
        
        if (isWebSearchEnabled) modelParams.config.tools = [{googleSearch: {}}];
        if (isToolsEnabled) modelParams.config.tools = [{functionDeclarations: [weatherTool]}];

        if (isToolsEnabled) {
            const response = await ai.models.generateContent({ ...modelParams, contents });
            setLoadingState({ active: false, message: '' });

            const fc = response.functionCalls?.[0];
            if (fc) {
                addModelMessage({ role: 'model', content: [{ type: 'tool_call', call: { name: fc.name, args: fc.args } }] });
                setLoadingState({ active: true, message: `Getting live data for ${fc.args.location}...` });

                const toolResult = executeTool(fc);
                
                const toolResponseContents = [
                    ...contents,
                    { role: 'model', parts: [{ functionCall: fc }] },
                    { role: 'tool', parts: [{ functionResponse: { name: fc.name, response: { result: toolResult } } }] }
                ];
                
                const finalStream = await ai.models.generateContentStream({ ...modelParams, contents: toolResponseContents });
                addModelMessage({ role: 'model', content: [{ type: 'text', value: '' }] });
                let modelResponseText = '';
                for await (const chunk of finalStream) {
                    modelResponseText += chunk.text;
                    updateLastModelMessage(m => ({
                        ...m,
                        content: [{ type: 'text', value: modelResponseText }],
                        metadata: { toolUsed: 'Weather Tool' },
                    }));
                }

            } else {
                addModelMessage({ role: 'model', content: [{ type: 'text', value: response.text }] });
            }
        } else {
            const stream = await ai.models.generateContentStream({ ...modelParams, contents });
            addModelMessage({ role: 'model', content: [{ type: 'text', value: '' }] });
            let modelResponseText = '';
            const aggregatedSources: Source[] = [];
            const sourceUris = new Set<string>();

            for await (const chunk of stream) {
              modelResponseText += chunk.text;
              const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
                  ?.filter(c => c.web?.uri && !sourceUris.has(c.web.uri))
                  .map(c => ({ uri: c.web.uri, title: c.web.title || '' })) || [];
              
              newSources.forEach(ns => {
                  aggregatedSources.push(ns);
                  sourceUris.add(ns.uri);
              });

              updateLastModelMessage(lastMsg => ({
                  ...lastMsg,
                  content: [{
                      type: 'text',
                      value: modelResponseText,
                      sources: aggregatedSources.length > 0 ? [...aggregatedSources] : undefined,
                  }],
                  metadata: isWebSearchEnabled && aggregatedSources.length > 0 ? { toolUsed: 'Web Search' } : undefined,
              }));
            }
            const imageCommandRegex = /\[IMAGINE: (.*?)\]/g;
            if (user && modelResponseText.match(imageCommandRegex)) {
                const newContent: MessageContent[] = [];
                const parts = modelResponseText.split(imageCommandRegex);
                parts.forEach((part, i) => {
                    if (i % 2 === 0) {
                        if (part.trim()) newContent.push({ type: 'text', value: part.trim(), sources: aggregatedSources.length > 0 ? [...aggregatedSources] : undefined });
                    } else {
                        newContent.push({ type: 'image', value: 'generating', prompt: part.trim() });
                    }
                });
                updateLastModelMessage(lastMsg => ({
                    ...lastMsg,
                    content: newContent,
                    metadata: isWebSearchEnabled && aggregatedSources.length > 0 ? { toolUsed: 'Web Search' } : lastMsg.metadata,
                }));

                for (let i = 0; i < newContent.length; i++) {
                    const part = newContent[i];
                    if (part.type === 'image' && part.value === 'generating') {
                        try {
                            const imageUrl = await generateImageForIntegration(part.prompt!);
                            updateLastModelMessage(lastMsg => {
                                const updatedContent = [...lastMsg.content];
                                if (updatedContent[i]?.type === 'image') (updatedContent[i] as ImageContentPart).value = imageUrl;
                                return { ...lastMsg, content: updatedContent };
                            });
                        } catch (e) {
                            console.error("Integrated image generation error:", e);
                            updateLastModelMessage(lastMsg => {
                                const updatedContent = [...lastMsg.content];
                                if (updatedContent[i]?.type === 'image') (updatedContent[i] as ImageContentPart).value = 'error';
                                return { ...lastMsg, content: updatedContent };
                            });
                        }
                    }
                }
            }
        }
    } catch (e: any) {
      setError("Sorry, I encountered an error. Please try again.");
      console.error("API call error:", e);
      const remover = (messages: Message[]) => {
          const lastMessage = messages[messages.length - 1];
          const firstPart = lastMessage?.content[0];
          if (lastMessage?.role === 'model' && firstPart?.type === 'text' && firstPart.value === '') {
              return messages.slice(0, -1);
          }
          return messages;
      }
      if (isGuestMode) {
          setTemporaryMessages(remover);
      } else {
          updateActiveConversation(convo => ({...convo, messages: remover(convo.messages)}));
      }
    } finally {
      setLoadingState({ active: false, message: '' });
      if (!isGuestMode) {
        checkAndGenerateTitle(activeConversationId);
      }
    }
  };
  
  const handleToggleSpeech = async (textToSpeak: string, messageId: string) => {
    if (!ai) return;

    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
        if (nowPlayingId === messageId) {
            setNowPlayingId(null);
            return;
        }
    }

    setTtsLoadingId(messageId);
    setNowPlayingId(null);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: textToSpeak }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data received.");

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
            setNowPlayingId(null);
            audioSourceRef.current = null;
        };
        source.start();
        audioSourceRef.current = source;
        setNowPlayingId(messageId);
    } catch (e) {
        console.error("Text-to-speech error:", e);
        setError("Sorry, I couldn't generate audio for this message.");
    } finally {
        setTtsLoadingId(null);
    }
  };

  const handleSelectConversation = (id: string) => {
    if(isGuestMode) return;
    setActiveConversationId(id);
  };
  
  const handleDeleteConversation = (id: string) => {
    if(isGuestMode) return;
    setConversations(prev => {
        const remaining = prev.filter(c => c.id !== id);
        if (activeConversationId === id) {
            setActiveConversationId(remaining[0]?.id || null);
        }
        if (remaining.length === 0) {
            const newConvo = createNewConversation();
            setActiveConversationId(newConvo.id);
            generateGreeting(newConvo.id);
            return [newConvo];
        }
        return remaining;
    });
  };
  
  const handleRenameConversation = (id: string, newTitle: string) => {
    if(isGuestMode) return;
    setConversations(prev => prev.map(c => c.id === id ? {...c, title: newTitle} : c));
  };

  const handleSummarize = async () => {
    if (!ai || !activeConversationId || isGuestMode) return;
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation || conversation.messages.length < 2) {
        setSummaryContent('Not enough content to summarize.');
        setIsSummaryModalOpen(true);
        return;
    }

    setIsSummarizing(true);
    setIsSummaryModalOpen(true);
    setSummaryContent('');

    const conversationText = conversation.messages
        .map(msg => {
            const content = msg.content
                .filter((part): part is TextContentPart => part.type === 'text')
                .map(part => part.value)
                .join(' ');
            return `${msg.role === 'user' ? 'User' : 'Ryt'}: ${content}`;
        })
        .join('\n');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: `Provide a concise, bulleted summary of the key points from the following conversation:\n\n${conversationText}` }] }],
        });
        setSummaryContent(response.text);
    } catch (e) {
        console.error("Summarization error:", e);
        setSummaryContent("Sorry, I couldn't summarize this conversation.");
    } finally {
        setIsSummarizing(false);
    }
  };

  const handleRegenerateResponse = async () => {
      if (isGuestMode || !activeConversationId) return;
      const conversation = conversations.find(c => c.id === activeConversationId);
      if (!conversation) return;

      // FIX: Replace findLastIndex with a manual reverse loop for broader browser compatibility.
      let lastModelMessageIndex = -1;
      for (let i = conversation.messages.length - 1; i >= 0; i--) {
        if (conversation.messages[i].role === 'model') {
          lastModelMessageIndex = i;
          break;
        }
      }

      if (lastModelMessageIndex === -1 || lastModelMessageIndex === 0) return;
      
      const lastUserMessage = conversation.messages[lastModelMessageIndex - 1];
      if (lastUserMessage.role !== 'user') return;

      const messagesToKeep = conversation.messages.slice(0, lastModelMessageIndex);
      updateActiveConversation(convo => ({ ...convo, messages: messagesToKeep }));
      
      const userInput = lastUserMessage.content.find((p): p is TextContentPart => p.type === 'text')?.value || '';
      const imagePart = lastUserMessage.content.find((p): p is ImageContentPart => p.type === 'image');
      
      let imageFile: File | null = null;
      if (imagePart?.value) {
          try {
              const response = await fetch(imagePart.value);
              const blob = await response.blob();
              imageFile = new File([blob], "regenerated-image.png", { type: blob.type });
          } catch (e) {
              console.error("Error fetching blob for regeneration:", e);
              setError("Could not retrieve the image for regeneration.");
              return;
          }
      }
      await generateTextResponse(userInput, imageFile);
  };
  
  const handleEditLastMessage = async () => {
    if (isGuestMode || !activeConversationId) return;
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) return;

    let lastUserMessageIndex = -1;
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
        if (conversation.messages[i].role === 'user') {
            lastUserMessageIndex = i;
            break;
        }
    }
    
    if (lastUserMessageIndex === -1 || lastUserMessageIndex < conversation.messages.length - 2) {
        return;
    }

    const userMessageToEdit = conversation.messages[lastUserMessageIndex];
    const messagesToKeep = conversation.messages.slice(0, lastUserMessageIndex);

    updateActiveConversation(convo => ({ ...convo, messages: messagesToKeep }));
    
    const userInput = userMessageToEdit.content.find((p): p is TextContentPart => p.type === 'text')?.value || '';
    const imagePart = userMessageToEdit.content.find((p): p is ImageContentPart => p.type === 'image');
    
    let imageFile: File | null = null;
    if (imagePart?.value) {
        imageFile = await dataUrlToFile(imagePart.value, "edited-image.png");
    }

    setPendingInput({ text: userInput, imageFile: imageFile });
};


  const handleExportChat = async (format: 'pdf' | 'md') => {
      if (isGuestMode || !activeConversationId) return;
      const conversation = conversations.find(c => c.id === activeConversationId);
      if (!conversation) return;

      if (format === 'md') {
          const markdownContent = conversation.messages.map(msg => {
              const content = msg.content.map(part => {
                  if (part.type === 'text') return part.value;
                  if (part.type === 'image') return `![Image](${part.prompt || 'User image'})`;
                  return '';
              }).join('\n\n');
              return `**${msg.role === 'user' ? 'You' : 'Ryt'}**:\n\n${content}`;
          }).join('\n\n---\n\n');

          const blob = new Blob([markdownContent], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${conversation.title}.md`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
          const { jsPDF } = (window as any).jspdf;
          const doc = new jsPDF();
          const margin = 10;
          let y = margin;
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const usableWidth = pageWidth - margin * 2;
          
          doc.setFontSize(16);
          doc.text(conversation.title, pageWidth / 2, y, { align: 'center' });
          y += 10;

          for (const msg of conversation.messages) {
              if (y > pageHeight - margin * 2) {
                  doc.addPage();
                  y = margin;
              }
              doc.setFont(undefined, 'bold');
              doc.text(`${msg.role === 'user' ? 'You' : 'Ryt'}:`, margin, y);
              y += 6;
              doc.setFont(undefined, 'normal');

              for (const part of msg.content) {
                  if (part.type === 'text') {
                      const lines = doc.splitTextToSize(part.value, usableWidth);
                      doc.text(lines, margin, y);
                      y += lines.length * 5; // Approximate line height
                  } else if (part.type === 'image' && part.value !== 'generating' && part.value !== 'error') {
                      try {
                          const img = new Image();
                          img.src = part.value;
                          await new Promise(resolve => img.onload = resolve);
                          const aspectRatio = img.width / img.height;
                          let imgWidth = usableWidth;
                          let imgHeight = imgWidth / aspectRatio;
                          if (y + imgHeight > pageHeight - margin) {
                              doc.addPage();
                              y = margin;
                          }
                          doc.addImage(img, 'PNG', margin, y, imgWidth, imgHeight);
                          y += imgHeight + 5;
                      } catch (e) {
                          console.error("PDF image export error:", e);
                          doc.text('[Image could not be loaded]', margin, y);
                          y += 6;
                      }
                  }
                  y += 4;
              }
          }

          doc.save(`${conversation.title}.pdf`);
      }
  };

  
  const displayedMessages = isGuestMode
      ? temporaryMessages
      : conversations.find(c => c.id === activeConversationId)?.messages || [];

  let lastUserMessageIndex = -1;
  for (let i = displayedMessages.length - 1; i >= 0; i--) {
      if (displayedMessages[i].role === 'user') {
          lastUserMessageIndex = i;
          break;
      }
  }

  const showWelcomeScreen = displayedMessages.length <= 1 && !loadingState.active;
  const canRegenerate = !isGuestMode && displayedMessages.length > 0 && displayedMessages[displayedMessages.length - 1].role === 'model';

  return (
    <div className="flex h-screen bg-transparent text-[var(--color-text)] font-sans">
      {user && (
          <Sidebar
            conversations={conversations}
            activeId={activeConversationId}
            onNewChat={handleNewChat}
            onSelect={handleSelectConversation}
            onDelete={handleDeleteConversation}
            onRename={handleRenameConversation}
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            iconStyle={iconStyle}
          />
      )}
      <div className="flex flex-col flex-1 relative min-w-0">
        <Header 
          user={user}
          onLogout={handleLogout}
          onSignIn={() => setIsAuthModalOpen(true)}
          onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
          onSummarize={handleSummarize}
          onToggleSettings={() => setIsSettingsPanelOpen(prev => !prev)}
          onToggleQuickActions={() => setIsQuickActionsPanelOpen(prev => !prev)}
          isConversationActive={!isGuestMode && displayedMessages.length > 1}
          iconStyle={iconStyle}
        />

        <QuickActionsPanel
          isOpen={isQuickActionsPanelOpen}
          onClose={() => setIsQuickActionsPanelOpen(false)}
          onRegenerate={handleRegenerateResponse}
          onExport={handleExportChat}
          canRegenerate={canRegenerate}
          iconStyle={iconStyle}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-28 md:pb-32">
            {showWelcomeScreen ? (
                <Welcome onPromptClick={handleSendMessage} iconStyle={iconStyle} />
            ) : (
                <div className="max-w-3xl mx-auto space-y-8">
                    {displayedMessages.map((msg, index) => (
                    <MessageComponent 
                        key={`${activeConversationId || 'guest'}-${index}`} 
                        messageId={`${activeConversationId || 'guest'}-${index}`}
                        message={msg}
                        onToggleSpeech={handleToggleSpeech}
                        nowPlayingId={nowPlayingId}
                        ttsLoadingId={ttsLoadingId}
                        iconStyle={iconStyle}
                        isEditable={msg.role === 'user' && index === lastUserMessageIndex}
                        onEdit={handleEditLastMessage}
                    />
                    ))}
                    {loadingState.active && <LoadingIndicator text={loadingState.message} />}
                    {error && (
                    <div className="flex justify-start">
                        <div className="bg-red-900/50 glass-pane rounded-lg p-3 max-w-md border border-red-500/50 text-red-300">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </main>
        
        <InputBar 
            onSendMessage={handleSendMessage} 
            isLoading={loadingState.active} 
            onOpenImagineModal={() => setIsImagineModalOpen(true)}
            user={user}
            iconStyle={iconStyle}
            pendingInput={pendingInput}
        />
      </div>

      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        isWebSearchEnabled={isWebSearchEnabled}
        onWebSearchToggle={setIsWebSearchEnabled}
        isToolsEnabled={isToolsEnabled}
        onToolsToggle={setIsToolsEnabled}
        selectedTheme={theme}
        onThemeChange={setTheme}
        selectedIconStyle={iconStyle}
        onIconStyleChange={setIconStyle}
      />

      {isSummaryModalOpen && (
        <SummaryModal 
            summary={summaryContent} 
            isLoading={isSummarizing}
            onClose={() => setIsSummaryModalOpen(false)} 
            iconStyle={iconStyle}
        />
      )}

      {isImagineModalOpen && (
        <ImagineModal
            isOpen={isImagineModalOpen}
            onClose={() => setIsImagineModalOpen(false)}
            onGenerate={handleGenerateImage}
            iconStyle={iconStyle}
        />
      )}

      {isAuthModalOpen && (
        <Auth onLogin={handleLogin} onClose={() => setIsAuthModalOpen(false)} iconStyle={iconStyle} />
      )}
    </div>
  );
};

export default App;