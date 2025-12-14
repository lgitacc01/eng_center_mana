import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { 
    responseMimeType: "application/json" 
  } 
});

// Hàm làm sạch chuỗi JSON (Phòng hờ AI vẫn thêm markdown)
const cleanJsonString = (str) => {
  // 1. Xóa Markdown ```json và ```
  let cleaned = str.replace(/```json/g, "").replace(/```/g, "");
  
  // 2. Tìm điểm bắt đầu [ và kết thúc ]
  const firstBracket = cleaned.indexOf('['); // Tìm mảng
  const firstBrace = cleaned.indexOf('{');   // Tìm object
  const lastBracket = cleaned.lastIndexOf(']');
  const lastBrace = cleaned.lastIndexOf('}');
  
  // Ưu tiên cắt theo mảng nếu tạo quiz, cắt theo object nếu chấm điểm
  if (firstBracket !== -1 && lastBracket !== -1 && firstBracket < firstBrace) {
      return cleaned.substring(firstBracket, lastBracket + 1);
  } else if (firstBrace !== -1 && lastBrace !== -1) {
      return cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned.trim();
};

export const generateQuiz = async (req, res) => {
  const { content, difficulty = "Trung bình", number = 5, type = "general" } = req.body;

  if (!content) {
    return res.status(400).json({ msg: "Vui lòng cung cấp nội dung hoặc chủ đề để tạo câu hỏi." });
  }

  try {
    // 1. Tạo Prompt (Câu lệnh nhắc) chuẩn để AI trả về JSON sạch
    let basePrompt = `
      Bạn là một trợ lý giáo dục thông minh. Hãy tạo một bài trắc nghiệm tiếng Anh dựa trên nội dung sau: "${content}".
      
      Yêu cầu:
      - Số lượng câu hỏi: ${number} câu.
      - Độ khó: ${difficulty}.
      - Ngôn ngữ: Tương thích với nội dung đầu vào (Nếu content tiếng Anh thì ra đề tiếng Anh, Toán thì ra Toán).
      - Định dạng trả về: Chỉ trả về một JSON Array thuần túy, không có markdown (json), không có lời dẫn.
    `;

    let formatInstruction = "";

    // --- BƯỚC 2: RẼ NHÁNH CẤU TRÚC JSON ---
    if (type === 'reading') {
        // Nếu là bài Đọc hiểu (Reading): Cần đoạn văn + câu hỏi
        formatInstruction = `
          ĐÂY LÀ BÀI TẬP DẠNG ĐỌC HIỂU (READING COMPREHENSION).
          Hãy viết một đoạn văn (passage) phù hợp với chủ đề, sau đó tạo câu hỏi dựa trên đoạn văn đó.

          Cấu trúc JSON Output bắt buộc (Object):
          {
            "passage": "Nội dung đầy đủ của bài đọc/đoạn văn bản...",
            "questions": [
              {
                "question": "Nội dung câu hỏi?",
                "options": ["A...", "B...", "C...", "D..."],
                "correctAnswer": "Đáp án đúng",
                "explanation": "Giải thích ngắn gọn"
              }
            ]
          }
        `;
    } else {
        // Nếu là bài tập thường (Trắc nghiệm rời rạc): Chỉ cần mảng câu hỏi
        formatInstruction = `
          ĐÂY LÀ BÀI TẬP TRẮC NGHIỆM THÔNG THƯỜNG.
          
          Cấu trúc JSON Output bắt buộc (Array):
          [
            {
              "question": "Nội dung câu hỏi?",
              "options": ["A...", "B...", "C...", "D..."],
              "correctAnswer": "Đáp án đúng",
              "explanation": "Giải thích ngắn gọn"
            }
          ]
        `;
    }

    // Ghép prompt hoàn chỉnh
    const finalPrompt = `${basePrompt}\n\n${formatInstruction}`;

    // 2. Gửi yêu cầu đến AI
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    let text = response.text();

    console.log(" Gemini Raw Response:", text); // Log để debug nếu cần

    // --- BƯỚC 4: XỬ LÝ KẾT QUẢ ---
    const cleanedText = cleanJsonString(text);
    const parsedData = JSON.parse(cleanedText);
    
    // Chuẩn hóa dữ liệu trả về cho Frontend
    let responseData = {};

    if (type === 'reading') {
        // Nếu là reading, data chính là object { passage, questions }
        // Kiểm tra an toàn: nếu AI lỡ trả về mảng thì fallback
        if (Array.isArray(parsedData)) {
             responseData = { isReading: false, questions: parsedData };
        } else {
             responseData = {
                isReading: true,
                passage: parsedData.passage || parsedData.text || "", // Fallback key
                questions: parsedData.questions || []
             };
        }
    } else {
        // Nếu là thường
        const questionsArray = Array.isArray(parsedData) ? parsedData : (parsedData.questions || []);
        responseData = {
            isReading: false,
            questions: questionsArray
        };
    }
    
    return res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Lỗi Gemini AI:", error);
    res.status(500).json({ msg: "Lỗi kết nối đến Google Gemini.", error: error.message });
  }
};

// --- SERVICE FUNCTIONS (Dùng để gọi nội bộ từ Controller khác) ---

/**
 * Service: Chấm điểm 1 câu hỏi (Dùng cho submissionController)
 * Hàm này KHÔNG nhận req, res mà nhận tham số trực tiếp
 */
export const evaluateAnswerAI = async ({ questionContent, correctAnswer, studentAnswer, maxPoints }) => {
  try {
    // Nếu học viên không trả lời
    if (!studentAnswer || String(studentAnswer).trim() === "") {
        return { points: 0, feedback: "Học viên không trả lời." };
    }

    const prompt = `
      Bạn là giáo viên chấm thi. Hãy chấm điểm câu trả lời sau.
      
      - Câu hỏi: "${questionContent}"
      - Đáp án chuẩn/Gợi ý: "${correctAnswer}"
      - Trả lời của học viên: "${studentAnswer}"
      - Điểm tối đa: ${maxPoints}
      
      Yêu cầu:
      1. So sánh ý nghĩa câu trả lời của học viên với đáp án chuẩn.
      2. Chấm điểm dựa trên độ chính xác (thang điểm ${maxPoints}).
      3. Đưa ra nhận xét ngắn gọn (tiếng Việt).
      
      Output JSON format:
      {
        "points": <số điểm (number)>,
        "feedback": "<lời phê (string)>"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = cleanJsonString(result.response.text());
    const graded = JSON.parse(text);

    return {
        points: Number(graded.points) || 0,
        feedback: graded.feedback || "Đã chấm."
    };

  } catch (error) {
    console.error("Lỗi evaluateAnswerAI:", error);
    // Nếu AI lỗi, mặc định trả về 0 điểm và thông báo cần chấm tay lại
    return { points: 0, feedback: "Lỗi hệ thống chấm tự động (Vui lòng kiểm tra lại)." };
  }
};