import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Upload, 
  Copy, 
  Wand2, 
  Layers, 
  Box, 
  Settings,
  RefreshCw,
  FileJson,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Play,
  ArrowRight,
  ArrowRightLeft,
  Loader2,
  Cpu,
  X,
  ShieldCheck,
  Languages,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Eraser,
  KeyRound
} from 'lucide-react';

// --- Types based on PRD Schema v2.0 ---

interface MetaData {
  template_name: string;
  template_id: string;
  version: string;
  author?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

interface GlobalSettings {
  default_platform: string;
  prompt_separator: string;
  section_separator: string;
  auto_capitalize: boolean;
  remove_duplicates: boolean;
}

interface Attribute {
  attr_id: string;
  label: string;
  label_ko?: string;
  type: string;
  value: any;
  value_ko?: string; // Added for storing Korean translation
  options?: string[] | { value: string; label: string; label_ko?: string }[];
  is_active: boolean;
  prefix?: string;
  weight?: { enabled: boolean; value: number };
  platform_overrides?: Record<string, any>;
  help_text?: string;
  validation?: any;
}

interface Component {
  component_id: string;
  component_label: string;
  component_label_ko?: string;
  is_active: boolean;
  is_collapsed?: boolean;
  attributes: Attribute[];
}

interface Section {
  section_id: string;
  section_label: string;
  section_label_ko?: string;
  order?: number;
  is_active: boolean;
  is_collapsed?: boolean;
  is_midjourney_params?: boolean;
  components: Component[];
}

interface Template {
  meta_data: MetaData;
  global_settings?: GlobalSettings;
  variables?: any[];
  prompt_sections: Section[];
  presets?: any[];
  platform_configs?: any;
  color_palette?: any;
}

// --- Sample Data from User (Pixar Skeleton) ---
const SAMPLE_TEMPLATE: Template = {
  "meta_data": {
    "template_name": "Cute Pixar Skeleton Hiker",
    "template_id": "tpl_pixar_skeleton_01",
    "version": "1.0.1",
    "category": "character",
    "tags": [
      "skeleton",
      "pixar",
      "cute",
      "hiking",
      "3d",
      "animation"
    ]
  },
  "prompt_sections": [
    {
      "section_id": "sec_subject",
      "section_label": "Main Subject",
      "section_label_ko": "주요 피사체",
      "is_active": true,
      "components": [
        {
          "component_id": "comp_character",
          "component_label": "Character",
          "component_label_ko": "캐릭터",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "char_desc",
              "label": "Character Description",
              "label_ko": "캐릭터 묘사",
              "type": "textarea",
              "value": "cute anthropomorphic skeleton character, big expressive round eye sockets, friendly smile, smooth white bone texture, chibi proportions, adorable face",
              "value_ko": "귀여운 의인화된 해골 캐릭터, 크고 표현력 있는 둥근 눈구멍, 친근한 미소, 매끄러운 흰색 뼈 질감, 꼬마 비율, 사랑스러운 얼굴",
              "is_active": true
            }
          ]
        },
        {
          "component_id": "comp_outfit",
          "component_label": "Outfit",
          "component_label_ko": "복장",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "outfit_main",
              "label": "Hiking Gear",
              "label_ko": "등산 장비",
              "type": "textarea",
              "value": "colorful small hiking backpack, sturdy brown hiking boots, red bandana around neck, casual outdoor vest",
              "value_ko": "알록달록한 작은 등산 배낭, 튼튼한 갈색 등산화, 목에 두른 빨간 반다나, 캐주얼한 아웃도어 조끼",
              "is_active": true
            }
          ]
        },
        {
          "component_id": "comp_props",
          "component_label": "Props",
          "component_label_ko": "소품",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "prop_hand",
              "label": "Hand Props",
              "label_ko": "손 소품",
              "type": "text",
              "value": "wooden walking stick",
              "value_ko": "나무 지팡이",
              "is_active": true
            }
          ]
        }
      ]
    },
    {
      "section_id": "sec_environment",
      "section_label": "Environment",
      "section_label_ko": "환경",
      "is_active": true,
      "components": [
        {
          "component_id": "comp_background",
          "component_label": "Background",
          "component_label_ko": "배경",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "bg_loc",
              "label": "Location",
              "label_ko": "장소",
              "type": "textarea",
              "value": "sunny mountain trail, lush green pine trees, rocky path, bright blue sky with fluffy white clouds, nature scenery",
              "value_ko": "화창한 산길, 울창한 푸른 소나무, 바위가 있는 오솔길, 솜사탕 같은 흰 구름이 떠 있는 맑고 푸른 하늘, 자연 풍경",
              "is_active": true
            }
          ]
        },
        {
          "component_id": "comp_lighting",
          "component_label": "Lighting",
          "component_label_ko": "조명",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "light_main",
              "label": "Lighting Style",
              "label_ko": "조명 스타일",
              "type": "textarea",
              "value": "bright natural sunlight, soft shadows, warm cinematic lighting, volumetric sun rays, high key lighting",
              "value_ko": "밝은 자연광, 부드러운 그림자, 따뜻한 시네마틱 조명, 볼류메트릭 선레이(빛내림), 하이키 조명",
              "is_active": true
            }
          ]
        }
      ]
    },
    {
      "section_id": "sec_camera",
      "section_label": "Camera",
      "section_label_ko": "카메라",
      "is_active": true,
      "components": [
        {
          "component_id": "comp_camera_settings",
          "component_label": "Camera Settings",
          "component_label_ko": "카메라 설정",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "cam_shot",
              "label": "Shot Type",
              "label_ko": "샷 타입",
              "type": "text",
              "value": "medium full shot, slightly low angle to show adventure, depth of field background blur",
              "value_ko": "미디엄 풀 샷, 모험심을 보여주는 약간 낮은 앵글, 배경 흐림(피사계 심도)",
              "is_active": true
            }
          ]
        }
      ]
    },
    {
      "section_id": "sec_style",
      "section_label": "Style",
      "section_label_ko": "스타일",
      "is_active": true,
      "components": [
        {
          "component_id": "comp_render",
          "component_label": "Render Style",
          "component_label_ko": "렌더링 스타일",
          "is_active": true,
          "attributes": [
            {
              "attr_id": "style_main",
              "label": "Art Style",
              "label_ko": "예술 스타일",
              "type": "textarea",
              "value": "Pixar animation style, Disney aesthetic, 3D rendering, Unreal Engine 5, Octane Render, high fidelity, vibrant colors, cute aesthetic",
              "value_ko": "픽사 애니메이션 스타일, 디즈니 미적 감각, 3D 렌더링, 언리얼 엔진 5, 옥테인 렌더, 고해상도, 선명한 색감, 귀여운 분위기",
              "is_active": true
            }
          ]
        }
      ]
    }
  ]
};

// --- Default Empty Template ---

const DEFAULT_TEMPLATE: Template = {
  meta_data: {
    template_name: "새 템플릿",
    template_id: "tpl_new",
    version: "1.0.0",
    author: "User",
    description: "새로운 프롬프트 템플릿"
  },
  global_settings: {
    default_platform: "midjourney",
    "prompt_separator": ", ",
    "section_separator": ", ",
    "auto_capitalize": false,
    "remove_duplicates": true
  },
  prompt_sections: []
};

// --- Helper Functions ---

const generatePromptString = (template: Template | null, platform = 'midjourney'): string => {
  if (!template || !Array.isArray(template.prompt_sections)) return "";

  const parts: string[] = [];
  const params: string[] = [];
  
  const sortedSections = [...template.prompt_sections]
    .filter(s => s && (s.is_active !== false)) // Default to true if undefined
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  
  for (const section of sortedSections) {
    const sectionParts: string[] = [];
    const components = section.components || [];
    
    // Parameter section handling
    if (section.is_midjourney_params) {
      for (const comp of components) {
        if (!comp || (comp.is_active === false)) continue; // Default to true if undefined
        const attributes = comp.attributes || [];
        for (const attr of attributes) {
          if (!attr || (attr.is_active === false) || !attr.value) continue;
          
          const prefix = attr.prefix ?? '';
          params.push(`${prefix}${attr.value}`);
        }
      }
      continue;
    }
    
    // Normal section handling
    for (const comp of components) {
      if (!comp || (comp.is_active === false)) continue; // Default to true if undefined
      
      const attributes = comp.attributes || [];
      for (const attr of attributes) {
        if (!attr || (attr.is_active === false) || (!attr.value && attr.value !== 0)) continue;
        
        let value = Array.isArray(attr.value) 
          ? attr.value.join(', ') 
          : String(attr.value);
        
        // Weight handling
        if (attr.weight?.enabled && attr.weight.value !== 1) {
          value += `::${attr.weight.value}`;
        }
        
        sectionParts.push(value);
      }
    }
    
    if (sectionParts.length > 0) {
      parts.push(sectionParts.join(template.global_settings?.prompt_separator || ', '));
    }
  }
  
  let prompt = parts.join(template.global_settings?.section_separator || ', ');
  
  // Remove duplicates logic
  if (template.global_settings?.remove_duplicates) {
    const words = prompt.split(',').map(s => s.trim()).filter(Boolean);
    prompt = [...new Set(words)].join(', ');
  }
  
  if (params.length > 0) {
    prompt += ' ' + params.join(' ');
  }
  
  return prompt;
};

// Helper to get display label (Priority: value_ko -> label_ko in options -> raw value)
const getDisplayValue = (attr: Attribute, value: any) => {
  // If we have a direct Korean translation of the current value, use it.
  if (attr.value_ko) return attr.value_ko;

  const valStr = Array.isArray(value) ? value.join(', ') : String(value);
  
  if (!attr.options) return valStr;

  // Find option matching value
  const option = attr.options.find(opt => {
    if (typeof opt === 'string') return opt === valStr;
    return opt.value === valStr;
  });

  if (!option) return valStr;

  if (typeof option === 'string') return option;
  return option.label_ko || option.label || option.value;
};

// Function to recursively remove '_ko' keys and 'options' for clean English JSON export
const getCleanJson = (data: any): any => {
  if (Array.isArray(data)) return data.map(getCleanJson);
  if (data !== null && typeof data === 'object') {
    const newObj: any = {};
    for (const key in data) {
      if (key.endsWith('_ko')) continue; // Strip Korean fields
      if (key === 'options') continue; // Strip options
      newObj[key] = getCleanJson(data[key]);
    }
    return newObj;
  }
  return data;
};

// --- Sub-components ---

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.debug("Failed to copy:", err);
      });
  };

  return (
    <button 
      onClick={handleCopy}
      className="text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all duration-100 active:scale-95 p-1 flex items-center gap-1.5 rounded self-end md:self-auto"
      title="값 복사"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] text-emerald-500 font-medium">복사됨</span>
        </>
      ) : (
        <>
           <Copy className="w-3.5 h-3.5" />
           <span className="text-[10px]">복사</span>
        </>
      )}
    </button>
  );
};

const ClearButton = ({ onClear }: { onClear: () => void }) => {
  return (
    <button
      onClick={onClear}
      className="text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-all duration-100 active:scale-95 p-1 flex items-center gap-1.5 rounded"
      title="내용 지우기"
    >
      <Eraser className="w-3.5 h-3.5" />
      <span className="text-[10px]">지우기</span>
    </button>
  );
};


// --- Main Component ---

const App = () => {
  const [template, setTemplate] = useState<Template>(SAMPLE_TEMPLATE);
  const [promptString, setPromptString] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isApiInfoOpen, setIsApiInfoOpen] = useState(false); 
  const [userApiKey, setUserApiKey] = useState("");
  const [uploadInput, setUploadInput] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  // Changed activeTab type to 'prompt' | 'preview'
  const [activeTab, setActiveTab] = useState<'prompt' | 'preview'>('preview');

  // Quick Translator State - Default Closed
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  // Sidebar section expanded state (default: collapsed)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [transInput, setTransInput] = useState("");
  const [transOutput, setTransOutput] = useState("");
  const [isTransLoading, setIsTransLoading] = useState(false);

  useEffect(() => {
    const str = generatePromptString(template);
    setPromptString(str);
  }, [template]);

  // Helper to update attribute value cleanly
  const updateAttributeValue = (sectionId: string, componentId: string, attrId: string, newValue: any) => {
    try {
      const newTemplate = JSON.parse(JSON.stringify(template));
      const s = newTemplate.prompt_sections.find((s:any) => s.section_id === sectionId);
      const c = s?.components.find((c:any) => c.component_id === componentId);
      const a = c?.attributes.find((a:any) => a.attr_id === attrId);
      if (a) {
        a.value = newValue; // Explicit replacement logic
        setTemplate(newTemplate);
      }
    } catch (err) { console.error("Error updating attribute:", err); }
  };

  // AI Handler for modification
  const handleAiModification = async () => {
    const userRequest = aiInput.trim() || "이미지 생성을 위해 값을 최적화하고 영문으로 번역해줘.";
    
    setIsAiLoading(true);

    try {
      const apiKey = userApiKey || process.env.API_KEY || '';
      if (!apiKey) {
        alert("API 키를 입력해주세요. (우측 상단 CPU 아이콘 클릭)");
        setIsAiLoading(false);
        return;
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `
      You are an expert AI Prompt Engineer for Midjourney (v7).
      
      TASK:
      1. Analyze the 'CURRENT JSON TEMPLATE' and 'USER REQUEST'.
      2. OPTIMIZE the template for high-quality image generation.
      3. CLEAN UP: Remove empty, unused, or irrelevant attributes. Keep the JSON concise ("Core Content Only").
      4. REMOVE PARAMETERS: **REMOVE the 'sec_params' or any section containing Midjourney parameters** from the output.
      
      CRITICAL RULES:
         - **OUTPUT VALUES MUST BE ENGLISH.** The 'value' field must be English keywords.
         - **GENERATE KOREAN TRANSLATIONS FOR UI:** 
            - Generate 'value_ko' (Korean translation of value).
            - Generate 'label_ko' (Korean translation of label).
            - Generate 'section_label_ko' (Korean translation of section_label).
            - Generate 'component_label_ko' (Korean translation of component_label).
         - **REWRITE 'value' contents to be Midjourney-optimized keywords** (comma-separated tokens).
         - **SET 'is_active': true** for all optimized/modified fields.
         - **REMOVE 'options' arrays** to keep JSON clean.
         - Maintain 'prompt_sections' -> 'components' -> 'attributes' structure.
      
      EXAMPLE OUTPUT STRUCTURE:
      {
        "prompt_sections": [
           {
             "section_id": "sec_subject",
             "section_label": "Subject",
             "section_label_ko": "주제",
             "is_active": true,
             "components": [
                {
                   "component_id": "comp_main",
                   "component_label": "Main Character",
                   "component_label_ko": "주요 캐릭터",
                   "is_active": true,
                   "attributes": [
                      { 
                        "attr_id": "desc", 
                        "label": "Description", 
                        "label_ko": "설명",
                        "type": "text", 
                        "value": "futuristic female cyborg", 
                        "value_ko": "미래형 여성 사이보그",
                        "is_active": true 
                      }
                   ]
                }
             ]
           }
        ]
      }

      CURRENT JSON TEMPLATE:
      ${JSON.stringify(template)}

      USER REQUEST:
      ${userRequest}
      
      RETURN:
      Only the JSON object. No markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      if (responseText) {
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const newTemplate = JSON.parse(jsonStr);
        
        if (!newTemplate.global_settings) newTemplate.global_settings = template.global_settings;
        if (!newTemplate.meta_data) newTemplate.meta_data = template.meta_data;
        if (!Array.isArray(newTemplate.prompt_sections)) {
           newTemplate.prompt_sections = [];
        }

        setTemplate(newTemplate);
        setActiveTab('prompt'); // Switch to Final Prompt tab on completion
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI 처리 중 오류가 발생했습니다. API 키를 확인하거나 다시 시도해주세요.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleQuickTranslation = async () => {
    if (!transInput.trim()) return;
    setIsTransLoading(true);
    setTransOutput("");

    try {
      const apiKey = userApiKey || process.env.API_KEY || '';
      if (!apiKey) {
        alert("API 키를 입력해주세요. (우측 상단 CPU 아이콘 클릭)");
        setIsTransLoading(false);
        return;
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text. If it's Korean, translate to English. If it's English, translate to Korean. Only output the translated text.\n\nText: ${transInput}`
      });
      setTransOutput(response.text?.trim() || "Translation failed.");
    } catch (error) {
      console.error(error);
      setTransOutput("Error occurred during translation. Check API Key.");
    } finally {
      setIsTransLoading(false);
    }
  };

  const handleUpload = () => {
    setUploadError(null);
    let cleanedInput = uploadInput.trim();
    
    if (cleanedInput.startsWith('```')) {
      cleanedInput = cleanedInput.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    try {
      if (!cleanedInput) throw new Error("JSON 내용을 입력해주세요.");
      const json = JSON.parse(cleanedInput);
      if (!json || typeof json !== 'object') throw new Error("유효한 JSON 객체가 아닙니다.");
      
      if (!Array.isArray(json.prompt_sections)) {
        if (json.prompt_sections && typeof json.prompt_sections === 'object') {
           throw new Error("'prompt_sections' 형식이 올바르지 않습니다.");
        }
        json.prompt_sections = [];
      }
      
      // Removed API translation call. Just parsing provided JSON.
      setTemplate(json);
      setIsUploadModalOpen(false);
      setUploadInput("");
    } catch (e: any) {
      setUploadError(e.message || "JSON 파싱 오류가 발생했습니다.");
    } finally {
      setIsUploadLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-zinc-200 overflow-hidden font-sans selection:bg-zinc-700/50">
      {/* Header */}
      <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 z-10 shrink-0">
        <a
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
        >
          <img src="/logo.png" alt="TB Logo" className="w-8 h-8 rounded-lg" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            TB 프롬프트 편집기
          </h1>
        </a>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsApiInfoOpen(true)}
             className={`p-2 rounded-full transition-all duration-100 active:scale-95 relative group ${userApiKey ? 'text-emerald-400 bg-emerald-900/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
             title="API 연결 정보"
           >
             <Cpu className="w-5 h-5" />
             {(process.env.API_KEY || userApiKey) && (
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
             )}
           </button>
          <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-zinc-400">
            v2.2 (Custom API Key)
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: Structure Tree */}
        <aside className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
            <h2 className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              구조 (Structure)
            </h2>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 rounded hover:bg-zinc-700 transition-all duration-100 active:scale-95"
            >
              <Upload className="w-3 h-3" />
              업로드
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
            {(template.prompt_sections || []).map((section) => (
              <div key={section.section_id} className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden shadow-sm group">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, [section.section_id]: !prev[section.section_id] }))}
                  className="w-full px-3 py-2 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 transition-colors"
                >
                  {expandedSections[section.section_id] ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate flex-1 text-left">{section.section_label_ko || section.section_label || section.section_id}</span>
                  {(section.is_active !== false) && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>}
                </button>
                {expandedSections[section.section_id] && (
                  <div className="p-2 space-y-1">
                    {(section.components || []).map((comp) => (
                      <div
                        key={comp.component_id}
                        onClick={() => {
                          const el = document.getElementById(`comp-${comp.component_id}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('ring-2', 'ring-emerald-500');
                            setTimeout(() => el.classList.remove('ring-2', 'ring-emerald-500'), 2000);
                          }
                        }}
                        className="pl-2 flex items-center gap-2 text-xs text-zinc-400 py-1 hover:bg-zinc-900 hover:text-white rounded cursor-pointer transition-colors"
                      >
                        <Box className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        <span className="truncate">{comp.component_label_ko || comp.component_label || comp.component_id}</span>
                        {(comp.is_active !== false) && <Check className="w-3 h-3 text-emerald-500 ml-auto mr-1" />}
                      </div>
                    ))}
                    {(!section.components || section.components.length === 0) && (
                       <div className="pl-2 text-xs text-zinc-600 italic py-1">하위 요소 없음</div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {(!template.prompt_sections || template.prompt_sections.length === 0) && (
              <div className="text-center py-10 px-4 text-zinc-500 text-sm">
                <p>로드된 템플릿이 없습니다.</p>
                <button 
                  onClick={() => {
                    setIsUploadModalOpen(true);
                  }}
                  className="mt-3 text-zinc-300 hover:text-white flex items-center justify-center gap-1 mx-auto transition-all duration-100 active:scale-95"
                >
                  <Play className="w-3 h-3" />
                  JSON 업로드 시작
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR FOOTER: External Tools */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900">
            <a 
              href="https://translate.google.co.kr/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-100 active:scale-95 shadow-sm"
              title="새 탭에서 구글 번역기 열기"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Google 번역기 열기
            </a>
          </div>
        </aside>

        {/* RIGHT PANEL: Editor & Output */}
        <main className="flex-1 flex flex-col min-w-0 bg-black">
          
          {/* Top: AI Assistant */}
          <div className="p-6 bg-zinc-900 border-b border-zinc-800 shadow-sm z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-5 h-5 text-white" />
              <h2 className="font-semibold text-zinc-200">AI 프롬프트 수정 (Korean → Optimized English JSON)</h2>
            </div>
            <div className="flex gap-3">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="요청사항을 입력하세요 (예: '거북이 모양의 우주선을 만들어줘'). &#13;&#10;입력 후 버튼을 누르면 최적화된 영문 프롬프트 JSON이 생성됩니다."
                className="flex-1 h-20 p-3 text-sm bg-black text-white border border-zinc-700 rounded-lg focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 outline-none resize-none transition-all placeholder:text-zinc-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiModification();
                  }
                }}
              />
              <button
                onClick={handleAiModification}
                disabled={isAiLoading}
                className="px-6 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 active:scale-95 flex flex-col items-center justify-center gap-1 min-w-[120px]"
              >
                {isAiLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span className="text-xs">프롬프트 수정</span>
                    <span className="text-[10px] opacity-70">(AI 변환)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle: Tab Content */}
          <div className="flex-1 p-6 flex flex-col min-h-0 bg-black relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-100 active:scale-95 ${activeTab === 'preview' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                  시각적 편집 (Visual Editor)
                </button>
                <button 
                  onClick={() => setActiveTab('prompt')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-100 active:scale-95 ${activeTab === 'prompt' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                  최종 프롬프트 (Midjourney Prompt)
                </button>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => copyToClipboard(promptString)}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-100 active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" /> Prompt 복사
                </button>
              </div>
            </div>

            <div className="flex-1 border border-zinc-800 rounded-xl bg-zinc-900/50 shadow-inner overflow-hidden relative">
              {activeTab === 'prompt' ? (
                <textarea
                  value={promptString}
                  readOnly
                  className="w-full h-full p-6 bg-[#0a0a0a] font-mono text-sm text-green-400 resize-none outline-none leading-relaxed selection:bg-zinc-800"
                  spellCheck={false}
                  placeholder="생성된 프롬프트가 없습니다..."
                />
              ) : (
                <div className="h-full overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
                  {/* Visual Preview */}
                  {(template.prompt_sections || []).map((section) => (
                    <div key={section.section_id} className="space-y-4 bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50">
                      <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2 pb-2 border-b border-zinc-800">
                        {section.section_label_ko || section.section_label}
                        {section.is_midjourney_params && <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-normal">PARAMS</span>}
                        {(section.is_active !== false) ? 
                           <span className="text-[10px] text-emerald-400 bg-emerald-900/20 px-1.5 rounded border border-emerald-900/30 font-normal">Active</span> : 
                           <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 rounded font-normal">Inactive</span>
                        }
                      </h3>
                      
                      <div className="flex flex-col gap-6">
                        {(section.components || []).map((comp) => (
                          <div key={comp.component_id} id={`comp-${comp.component_id}`} className="space-y-3 transition-all duration-300 rounded-lg">
                             {/* Component Header to organize visual editor */}
                             <div className="text-xs font-semibold text-zinc-400 flex items-center gap-2 px-1">
                                <Box className="w-3 h-3" />
                                {comp.component_label_ko || comp.component_label}
                             </div>

                             <div className="grid grid-cols-1 gap-4 pl-2 border-l border-zinc-800/50">
                               {(comp.attributes || []).map((attr) => (
                                 <div key={attr.attr_id} className="bg-black p-4 rounded border border-zinc-800 shadow-sm flex flex-col gap-3 hover:border-zinc-700 transition-colors">
                                   {/* Attribute Header */}
                                   <div className="flex items-center justify-between">
                                     <label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                                       {attr.label_ko || attr.label}
                                       {(attr.is_active === false) && <span className="text-[10px] text-red-900 font-normal">(Inactive)</span>}
                                     </label>
                                     <div className="flex items-center gap-1">
                                       <ClearButton onClear={() => updateAttributeValue(section.section_id, comp.component_id, attr.attr_id, "")} />
                                       <CopyButton value={Array.isArray(attr.value) ? attr.value.join(', ') : String(attr.value)} />
                                     </div>
                                   </div>
   
                                   {/* Split Layout */}
                                   <div className="flex gap-4 items-start">
                                     {/* Left: Current Value (Translated/Reference) */}
                                     <div className="w-[30%] border-r border-zinc-800 pr-3 pt-2 flex flex-col gap-2">
                                       <div className="text-sm text-zinc-400 break-words leading-relaxed" title={String(attr.value)}>
                                         {getDisplayValue(attr, attr.value)}
                                       </div>
                                       <div className="self-end opacity-70 hover:opacity-100 transition-opacity">
                                          <CopyButton value={getDisplayValue(attr, attr.value)} />
                                       </div>
                                     </div>
   
                                     {/* Right: Edit Field (English Input) */}
                                     <div className="flex-1 min-w-0">
                                       <div className="relative">
                                         <input 
                                           list={attr.options ? `datalist-${attr.attr_id}` : undefined}
                                           type="text" 
                                           placeholder="영문 값 입력 (예: Dragon)..."
                                           className="w-full text-sm p-2.5 bg-zinc-950 border border-zinc-700 rounded text-white outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-700"
                                           value={Array.isArray(attr.value) ? attr.value.join(', ') : attr.value}
                                           onChange={(e) => updateAttributeValue(section.section_id, comp.component_id, attr.attr_id, e.target.value)}
                                         />
                                       </div>
                                       
                                       {attr.options && (
                                         <datalist id={`datalist-${attr.attr_id}`}>
                                            {attr.options.map((opt: any) => {
                                              const val = typeof opt === 'string' ? opt : opt.value;
                                              const label = typeof opt === 'string' ? opt : (opt.label_ko || opt.label);
                                              return <option key={val} value={val}>{label}</option>
                                            })}
                                         </datalist>
                                       )}
                                     </div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom: Quick Translator (AI) - Replacement for blocked Google iframe */}
          <div className="border-t border-zinc-800 bg-zinc-900 shrink-0">
             <button 
               onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
               className="w-full flex items-center justify-between px-6 py-2 bg-zinc-950 hover:bg-zinc-900 text-xs text-zinc-400 border-b border-zinc-800 transition-colors"
             >
               <div className="flex items-center gap-2">
                 <Languages className="w-4 h-4 text-emerald-500" />
                 <span className="font-semibold text-zinc-300">AI 퀵 번역기 (Quick Translator)</span>
               </div>
               <div className="flex items-center gap-2">
                 {isTranslatorOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
               </div>
             </button>
             
             {isTranslatorOpen && (
               <div className="p-4 flex gap-3 h-48 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex-1 flex flex-col gap-2">
                     <div className="flex justify-between items-center text-xs text-zinc-500 px-1">
                        <span>입력 (Korean/English)</span>
                        <a href="https://translate.google.co.kr/?sl=auto&tl=en&op=translate" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                           <ExternalLink className="w-3 h-3" /> 구글 번역기 열기
                        </a>
                     </div>
                     <textarea 
                       className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-sm text-white resize-none focus:ring-1 focus:ring-emerald-500/50 outline-none"
                       placeholder="번역할 텍스트를 입력하세요..."
                       value={transInput}
                       onChange={(e) => setTransInput(e.target.value)}
                       onKeyDown={(e) => {
                         if(e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleQuickTranslation();
                         }
                       }}
                     />
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                     <button 
                       onClick={handleQuickTranslation}
                       disabled={isTransLoading || !transInput.trim()}
                       className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-all duration-100 active:scale-95 disabled:opacity-50"
                       title="번역하기"
                     >
                       {isTransLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                     </button>
                     <button
                        onClick={() => {
                            const temp = transInput;
                            setTransInput(transOutput);
                            setTransOutput(temp);
                        }}
                        className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-all duration-100 active:scale-95"
                        title="입력/결과 바꾸기 (Swap)"
                     >
                        <ArrowRightLeft className="w-5 h-5" />
                     </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                     <span className="text-xs text-zinc-500 px-1">결과 (Translated)</span>
                     <textarea 
                       readOnly
                       className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 resize-none outline-none"
                       placeholder="번역 결과가 여기에 표시됩니다."
                       value={transOutput}
                     />
                  </div>
               </div>
             )}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full border border-zinc-800 flex flex-col h-[80vh]">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 rounded-t-xl shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-500" />
                JSON 템플릿 불러오기
              </h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-all duration-100 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-hidden flex flex-col">
              {uploadError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-200 text-sm shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-400">오류 발생</p>
                    <p>{uploadError}</p>
                  </div>
                </div>
              )}

              <textarea
                value={uploadInput}
                onChange={(e) => setUploadInput(e.target.value)}
                placeholder='{"meta_data": ..., "prompt_sections": ...}'
                className="flex-1 w-full p-4 bg-black text-zinc-300 font-mono text-xs rounded-lg border border-zinc-700 focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="p-5 border-t border-zinc-800 bg-zinc-950 rounded-b-xl flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-all duration-100 active:scale-95"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadInput.trim() || isUploadLoading}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 active:scale-95"
              >
                {isUploadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                템플릿 적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Info Modal */}
      {isApiInfoOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full border border-zinc-800">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-zinc-400" />
                API 연결 정보
              </h3>
              <button 
                onClick={() => setIsApiInfoOpen(false)}
                className="text-zinc-500 hover:text-white transition-all duration-100 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">현재 사용 중인 모델:</p>
                <div className="flex items-center gap-2 text-white font-mono bg-zinc-950 px-3 py-2 rounded border border-zinc-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  gemini-2.5-flash
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <p className="text-sm text-zinc-400">기능별 사용:</p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">AI 프롬프트 수정:</span>
                      <p className="text-xs text-zinc-500 mt-0.5">사용자 요청을 반영하여 이미지 생성에 최적화된 영문 JSON을 생성합니다.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">AI 퀵 번역기:</span>
                      <p className="text-xs text-zinc-500 mt-0.5">하단 패널에서 한글↔영문 텍스트를 즉시 번역합니다.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <ShieldCheck className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-zinc-400">템플릿 업로드 (Parse Only):</span>
                      <p className="text-xs text-zinc-500 mt-0.5">API를 사용하지 않고 입력된 JSON을 그대로 파싱합니다.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* API Key Input Section */}
              <div className="space-y-2 pt-4 border-t border-zinc-800">
                 <label className="text-sm font-bold text-white flex items-center gap-2">
                   <KeyRound className="w-4 h-4 text-emerald-400" />
                   Custom API Key (Optional)
                 </label>
                 <div className="relative">
                   <input
                     type="password"
                     value={userApiKey}
                     onChange={(e) => setUserApiKey(e.target.value)}
                     placeholder="Gemini API Key 입력..."
                     className="w-full p-2.5 bg-black border border-zinc-700 rounded text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none placeholder:text-zinc-600 font-mono"
                   />
                 </div>
                 <p className="text-xs text-zinc-500">
                   입력하지 않으면 기본 제공 키(process.env.API_KEY)가 사용됩니다.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);