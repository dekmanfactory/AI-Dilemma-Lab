import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Choice } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Interface for the structured response we want from Gemini
interface AIAnalysisResponse {
  analysis: string;
  discussionQuestions: string[];
  keyEthicalConcepts: string[];
}

export const analyzeDecision = async (
  scenario: Scenario, 
  choice: Choice
): Promise<AIAnalysisResponse> => {
  if (!apiKey) {
    // Fallback if no API key is present
    return {
      analysis: "API 키가 설정되지 않아 AI 심층 분석을 제공할 수 없습니다. 하지만 당신의 선택은 이 상황에서 중요한 윤리적 가치를 반영하고 있습니다.",
      discussionQuestions: ["이 상황에서 가장 중요하게 고려한 가치는 무엇인가요?", "다른 선택을 했다면 결과가 어떻게 달라졌을까요?"],
      keyEthicalConcepts: ["윤리적 책임", "알고리즘 편향"]
    };
  }

  const prompt = `
    당신은 청소년을 위한 'AI 윤리 교육 전문가'입니다.
    학생이 '${scenario.title}'라는 딜레마 상황에서 결정을 내렸습니다.
    
    [시나리오]: ${scenario.description}
    [학생의 선택]: ${choice.text}
    [선택의 기반 관점]: ${choice.perspective} (공리주의, 의무론 등)

    학생의 선택에 대해 다음 3가지를 포함하여 JSON 형식으로 응답해주세요:
    1. analysis: 선택이 가져온 윤리적 결과와 그 의미에 대한 친절하고 교육적인 해설 (약 3-4문장).
    2. discussionQuestions: 이 문제에 대해 친구들과 토론해볼 수 있는 심오한 질문 3가지.
    3. keyEthicalConcepts: 이 상황과 관련된 핵심 윤리 용어 2-3개.

    어조는 격려하며 생각할 거리를 던져주는 선생님의 말투(해요체)를 사용해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            discussionQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keyEthicalConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["analysis", "discussionQuestions", "keyEthicalConcepts"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResponse;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      analysis: "AI 분석 서버 연결에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      discussionQuestions: ["이 기술이 사회에 미칠 영향은 무엇일까요?", "누가 책임을 져야 할까요?"],
      keyEthicalConcepts: ["기술 윤리"]
    };
  }
};