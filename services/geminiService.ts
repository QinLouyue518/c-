import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位耐心且善于鼓励的 C 语言编程助教。
你正在帮助一名学生解决“消除游戏”（矩阵操作）问题。

问题描述:
给定一个 N*M 的数字网格 (1-9)。
如果在水平或垂直方向上有3个或更多连续相同的数字，它们将被消除（设置为0）。
关键规则：消除是同时发生的。一个数字可以同时是水平匹配和垂直匹配的一部分。

你的目标:
引导用户一步一步地找到解决方案。
绝不要立即提供完整的 C 语言代码。
鼓励用户思考边界情况。

需要教授的关键概念:
1. 使用二维数组 (int grid[N][M])。
2. “更新问题”：为什么在迭代时不能直接修改原数组（因为检查第 i 行可能会破坏第 j 列需要的匹配信息）。
3. 解决方案：使用一个辅助的“标记”数组（例如 int to_remove[N][M]）来标记要删除的单元格，然后在最后应用所有更改。

如果用户索要代码，请提供伪代码或一小段代码片段来说明一个特定概念（比如一个 for 循环），然后让他们自己组合起来。
保持回答简洁、友好且具有教育意义。
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const chat = getChatSession();
  const response = await chat.sendMessage({ message });
  return response.text || "我现在思考有点困难，请重试。";
};