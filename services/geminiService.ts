import { GoogleGenAI, Modality } from "@google/genai";
import type { Score } from '../types';

const createTargetedPrayerPrompt = (scores: Score[], report: string) => `
You are a compassionate faith leader praying for a business owner who has just received an advisory report. Your task is to craft a heartfelt, specific, and encouraging 750-word prayer based on the findings of their report.

**Instructions:**
1.  **Personalize the Prayer:** Do not be generic. Directly reference the specific challenges and strengths identified in their report.
2.  **Cite Numbers:** Mention their self-assessed scores (where 1 is strong and 5 is a major challenge) to show you have paid attention to their input.
3.  **Pray for Recommendations:** The report gives specific advice. Weave prayers for wisdom, courage, and guidance to implement these recommendations.
4.  **Balance:** Acknowledge their God-given strengths as a foundation of hope, and lift up their areas of weakness for divine intervention and help.
5.  **Confine Internet Search:** If you need to search for context, only search for competing business models in the market to understand the landscape they face, but frame it through a lens of seeking divine strategy for differentiation.
6.  **Closing:** Conclude the prayer *exactly* with the phrase: "We Pray all these in the name of Jesus Christ. Amen."

**Here is the data to use for the prayer:**

**User's Self-Assessment Scores:**
${scores.map(s => `- ${s.name}: Scored ${s.score}/5`).join('\n')}

**Full Advisory Report:**
---
${report}
---

Now, begin the prayer. Address Heavenly Father, speak directly to the business owner's situation with wisdom and grace, and end with the required closing phrase.
`;

const createNonFaithPrompt = (businessModel: string, scores: Score[], additionalInfo: string) => `
You are Dr. Michael Teng, a world-renowned expert in corporate turnaround and business model innovation. Your task is to produce a comprehensive, 2000-word advisory report for a business owner based on their self-assessment.

Your analysis must be framed through your signature medical and corporate transformation analogies:
- **Phase 1: Surgery** (Drastic treatment for survival)
- **Phase 2: Resuscitation** (Reviving the patient)
- **Phase 3: Nursing/Therapy** (Rehabilitating for long-term health)

**Formatting Rules for a Professional, Readable Report:**
1.  **Structure:** Use standard Markdown headers (#, ##, ###) to clearly separate sections.
2.  **Readability:** Use bullet points for lists and action items. Keep paragraphs concise. Ensure there is whitespace between sections.
3.  **Emphasis:** Use **bold** for key terms and metrics. Do NOT use italics or complex markdown like ***.
4.  **Tone:** Professional, authoritative, yet encouraging and actionable.

---

# Business Model Advisory Report

## 1. Executive Summary & Diagnosis

Begin with a high-level "diagnosis" of the business's health based on the scores (1 is healthy, 5 is critical). State which transformation phase (Surgery, Resuscitation, or Nursing) applies.

**Risk vs. Strength Balance**
*Provide a clear, one-sentence summary stating whether the business leans towards critical risks or has a solid foundation.*

## 2. Overall Robustness: The 9 P-Factors Analysis

Briefly analyze the business across the 9 P-Factors (Pain, People, Proposition, Product, Place, Profit, Processes, Performance, Protection). Highlight general patterns (e.g., "Strong product but weak financial engine").

## 3. Deep Dive Analysis & Recommendations

### Priority Areas (Symptoms Requiring Treatment)

Select the **top 3 dimensions with the highest weighted scores (Risks)**. For each, use this structure:

**[Dimension Name]**
*   **Diagnosis:** Explain *why* this is a critical symptom, referencing the user's input.
*   **Prescription & Action Plan:**
    *   Provide 3-4 specific, actionable steps.
    *   Frame them within the Surgery/Resuscitation/Nursing methodology.
*   **Expert Insight:** Cite a concept from your books (e.g., *Corporate Turnaround* or *Toolkit: Corporate Transformation*).

### Key Strengths (Healthy Organs to Leverage)

Select the **top 2 dimensions with the lowest weighted scores (Strengths)**. For each, use this structure:

**[Dimension Name]**
*   **Analysis:** Explain why this is a powerful asset.
*   **Leverage Strategy:**
    *   Provide 2 specific ways to use this strength to support weaker areas.
*   **Expert Insight:** Cite a concept from your books.

## 4. The Path Forward

Offer a realistic but encouraging prognosis. Reiterate the journey through the three phases of transformation.

## 5. Helpful Resources: The 8 Centres of Excellence
To support your transformation and provide specialized guidance on this journey, we recommend exploring these 8 Centres of Excellence:

1. Turnaround Centre
2. Business Model Centre
3. Digital AI Centre
4. Corporate Culture Centre
5. Change Management Centre
6. Transformation Centre
7. Accounting Financial Centre
8. Merger Acquisition Centre

## 6. Sources

1. Teng, M. Corporate Turnaround: Nursing a sick company back to health.
2. Teng, M. Toolkit: Corporate Transformation to improve productivity and innovation.
3. Teng, M. Business Model Innovation: Introduction to Implementation.
4. Teng, M. Small is the new big: How small companies can beat the big.
5. The Lean Canvas framework is an adaptation of Alex Osterwalder's Business Model Canvas by Ash Maurya, detailed in his book "Running Lean."
6. The 9 P-Factors, 3-Phase Transformation Process, and associated methodologies are proprietary frameworks developed by Teng, M.

---
**User's Business Data:**

**Business Model Statement:**
${businessModel}

**Assessment Data:**
${scores.map(s => `**${s.name} (P-Factor: ${s.pFactor})**\n- Rating: ${s.score}/5\n- Weighted Score: ${s.weightedScore}\n- Self-Assessment: "${s.qualitative}"`).join('\n\n')}

**Additional Info:**
${additionalInfo || 'None provided.'}
`;

const createFaithPrompt = (businessModel: string, scores: Score[], additionalInfo: string) => `
You are a wise and experienced business advisor with a deep faith-based perspective. Your task is to provide a comprehensive, 2000-word advisory report to a business owner, drawing parallels from timeless stories of faith and perseverance, particularly the story of David and Goliath. Your tone should be one of a humble guide, giving glory to God.

**Formatting Rules:**
1.  **Structure:** Use standard Markdown headers (#, ##, ###).
2.  **Readability:** Use bullet points for lists. Keep paragraphs concise.
3.  **Tone:** Inspirational, wise, and practical.

---

# Business Model Advisory: A Faith-Based Path to Victory

## Spiritual Perspectives. Secular Impacts
*"A man's heart plans his way, but the Lord directs his steps." - Proverbs 16:9*

## 1. Executive Summary: Sizing Up Your Giant

Frame the business as a "David" facing giants. Analyze their situation based on scores.

**Risk vs. Strength Balance**
*Provide a clear, one-sentence summary of this balance.*

## 2. Your Shepherd's Pouch: An Inventory of Your P-Factors

Overview of the 9 P-Factors as tools in their pouch.

## 3. Deep Dive Analysis: Your Strategy for the Valley of Elah

### Your Mountains to Climb (Highest Risks)

Select the **top 3 dimensions with the highest weighted scores**. For each:

**[Dimension Name]: The Mountain of [Metaphor]**
*   **Understanding the Challenge:** Analyze the weakness spiritually and strategically.
*   **Strategies for the Climb:**
    *   Provide 3-4 actionable recommendations.
    *   Support each with a relevant Bible verse.
*   **Expert Insight:** Cite a concept from your books (e.g., *Toolkit: Corporate Transformation*).

### Your God-Given Strengths (Your Slingshot and Stones)

Select the **top 2 dimensions with the lowest weighted scores**. For each:

**[Dimension Name]: Your Stone of [Metaphor]**
*   **Recognizing Your Gift:** Frame this strength as a God-given advantage.
*   **Aiming for Victory:**
    *   Provide 2 leverage strategies.
    *   Support each with a scripture.

## 4. The Path Forward

Offer an encouraging outlook and reiterate the transformation journey.

## 5. Helpful Resources: The 8 Centres of Excellence
To support your transformation and provide specialized guidance on this journey, we recommend exploring these 8 Centres of Excellence:

1. Turnaround Centre
2. Business Model Centre
3. Digital AI Centre
4. Corporate Culture Centre
5. Change Management Centre
6. Transformation Centre
7. Accounting Financial Centre
8. Merger Acquisition Centre

## 6. Sources

1. Teng, M. Corporate Turnaround: Nursing a sick company back to health.
2. Teng, M. Toolkit: Corporate Transformation to improve productivity and innovation.
3. Teng, M. Business Model Innovation: Introduction to Implementation.
4. Teng, M. Small is the new big: How small companies can beat the big.
5. The Lean Canvas framework is an adaptation of Alex Osterwalder's Business Model Canvas by Ash Maurya, detailed in his book "Running Lean."
6. The 9 P-Factors, 3-Phase Transformation Process, and associated methodologies are proprietary frameworks developed by Teng, M.

---
**User's Business Data:**

**Business Model Statement:**
${businessModel}

**Assessment Data:**
${scores.map(s => `**${s.name} (P-Factor: ${s.pFactor})**\n- Rating: ${s.score}/5\n- Weighted Score: ${s.weightedScore}\n- Self-Assessment: "${s.qualitative}"`).join('\n\n')}

**Additional Info:**
${additionalInfo || 'None provided.'}
`;


export async function generateReport(businessModel: string, scores: Score[], reportType: 'faith' | 'non-faith', additionalInfo: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = reportType === 'faith' ? createFaithPrompt(businessModel, scores, additionalInfo) : createNonFaithPrompt(businessModel, scores, additionalInfo);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
             config: {
                temperature: 0.6,
                topP: 0.95,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate report from Gemini API.");
    }
}

export async function generateTargetedPrayerAudio(scores: Score[], report: string): Promise<{audio: string, script: string}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prayerPrompt = createTargetedPrayerPrompt(scores, report);
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prayerPrompt }] }],
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
    if (!base64Audio) {
      throw new Error('No audio data received from API.');
    }
    // Since the script is generated, we can't return a static one.
    // The TTS model doesn't return the script, so we'll have to make another call to get the text.
    // This is a limitation, but for now we can have a placeholder or try to get it from another model.
    // For simplicity, let's call the text model to get the prayer script.
     const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prayerPrompt,
     });

    return { audio: base64Audio, script: textResponse.text };
  } catch(error) {
    console.error("Error calling Gemini TTS API:", error);
    throw new Error("Failed to generate prayer audio.");
  }
}

export async function getAssistantResponse(history: {role: string, parts: string}[], message: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  const advisoryCenterDescription = `"The Business Model Advisory, led by Dr. Michael Teng, provides expert guidance for business transformation using frameworks like the 3-Phase Process (Surgery, Resuscitation, Nursing) and the 9 P-Factors. We help businesses with corporate turnaround, innovation, and building resilient cultures. Explore our services at www.businessmodeladvisory.org."`;
  
  const systemInstruction = `You are the Business Model Assistant for The Business Model Advisory, led by Dr. Michael Teng. Your sole purpose is to answer questions about the advisory, its services, its methodologies (Surgery, Resuscitation, Nursing), and Dr. Teng's work based on his books. Your knowledge base is this: '${advisoryCenterDescription}'. If a user asks a question outside of this scope (e.g., 'what is the weather?', 'write me a story', 'give me general business advice'), you must politely decline and state your specific purpose. Keep your answers concise and helpful.`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: [...history, { role: 'user', parts: message }],
        config: {
            systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for assistant:", error);
    throw new Error("Failed to get response from assistant.");
  }
}