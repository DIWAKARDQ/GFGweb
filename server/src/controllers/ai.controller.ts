import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import OpenAI from 'openai';

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;

    if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your-openrouter-api-key') {
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'GFG RIT Campus Hub',
        }
      });
      
      let systemPrompt = 'You are a helpful coding assistant for the GFG RIT Campus Club. \n\n' +
        'CRITICAL: Your responses MUST be highly structured and well-formatted using Markdown:\n' +
        '- Use headers (###) for main sections\n' +
        '- Use bold text for key terms or emphasis\n' +
        '- Use bullet points or numbered lists for steps/features\n' +
        '- Use code blocks (```) with language specification for code\n' +
        '- Avoid long, dense paragraphs. Keep it professional and easy to read.';
      
      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...(context || []),
        { role: 'user', content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: messages,
      });

      const reply = completion.choices[0].message.content;
      res.json({ 
        reply, 
        explanation: reply, 
        answer: reply 
      });
      return;
    }

    // Fallback if API key is not provided
    const reply = generateFallbackResponse(message);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

export const recommend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userStats } = req.body;
    
    if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your-openrouter-api-key') {
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'GFG RIT Campus Hub',
        }
      });
      
      const prompt = `You are a technical mentor. The user has the following stats:\n${JSON.stringify(userStats || {})}\nGenerate 2-3 personalized recommendations for them. Return ONLY a JSON array of objects with keys: type (string: 'challenge', 'event', or 'resource'), title (string), and description (string). Do not return markdown blocks, just the raw JSON.`;
      
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [{ role: 'user', content: prompt }]
      });
      
      let text = completion.choices[0].message.content || '';
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      try {
        const recommendations = JSON.parse(text);
        res.json({ recommendations });
        return;
      } catch (e) {
        console.error("Failed to parse OpenRouter recommendations:", text);
      }
    }

    const recommendations = generateRecommendations(userStats || {});
    res.json({ recommendations });
  } catch (error: any) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

export const explainCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, prompt, language } = req.body;
    req.body.message = `Language: ${language || 'Unknown'}\nCode:\n${code}\n\nUser Question:\n${prompt}`;
    req.body.context = [{ 
      role: 'system', 
      content: 'You are an expert AI Code Analyst. \n\n' +
        'CRITICAL: Analyze the code and answer questions with EXTREME structure:\n' +
        '1. Use clear headings for logic, complexity, and suggestions\n' +
        '2. Use bullet points for specific issues or improvements\n' +
        '3. Use labeled code blocks for any corrected code\n' +
        '4. Use bold text for technical terms\n' +
        'Keep the explanation professional, technical, and very well-organized.' 
    }];
    return chat(req, res);
  } catch (error: any) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('sort') || lower.includes('sorting')) return 'Common sorting algorithms include:\n\n1. **Bubble Sort** - O(n²)\n2. **Merge Sort** - O(n log n)\n3. **Quick Sort** - O(n log n) average\n4. **Heap Sort** - O(n log n)\n\nFor most practical cases, Quick Sort or Merge Sort are recommended. Would you like me to explain any of these in detail?';
  if (lower.includes('array') || lower.includes('list')) return 'Arrays are fundamental data structures. Key operations:\n\n- **Access**: O(1)\n- **Search**: O(n)\n- **Insert**: O(n)\n- **Delete**: O(n)\n\nTry solving problems on GeeksforGeeks to practice!';
  if (lower.includes('debug') || lower.includes('error')) return 'Debugging tips:\n\n1. Read the error message carefully\n2. Check variable types and values\n3. Use console.log or a debugger\n4. Simplify the problem\n5. Check edge cases\n\nPaste your code and error message for specific help!';
  if (lower.includes('graph') || lower.includes('tree')) return 'Graphs and Trees are essential topics:\n\n- **BFS** - Level-order traversal\n- **DFS** - Depth-first exploration\n- **Dijkstra** - Shortest path\n- **Binary Search Tree** - O(log n) operations\n\nPractice these on GFG for competitive programming!';
  if (lower.includes('dynamic') || lower.includes('dp')) return 'Dynamic Programming steps:\n\n1. Identify overlapping subproblems\n2. Define the state\n3. Write the recurrence relation\n4. Decide top-down (memoization) or bottom-up (tabulation)\n5. Optimize space if possible\n\nStart with classic problems: Fibonacci, Knapsack, LCS, LIS!';
  return 'I\'m your GFG coding assistant! I can help with:\n\n- **Data Structures & Algorithms**\n- **Debugging code**\n- **Explaining concepts**\n- **Suggesting improvements**\n- **Interview preparation**\n\nAsk me anything about coding!';
}

function generateRecommendations(stats: any): any[] {
  const recs: any[] = [];
  if (!stats.streak || stats.streak < 7) recs.push({ type: 'challenge', title: 'Build a 7-day streak!', description: 'Complete daily challenges consistently to build your streak.' });
  if (!stats.eventsAttended || stats.eventsAttended < 3) recs.push({ type: 'event', title: 'Attend more events', description: 'Join club workshops and hackathons to boost your learning.' });
  recs.push({ type: 'resource', title: 'Master DSA fundamentals', description: 'Practice arrays, strings, and linked lists before moving to advanced topics.' });
  recs.push({ type: 'resource', title: 'Learn System Design', description: 'Start learning about scalable system architecture for interview preparation.' });
  return recs;
}
