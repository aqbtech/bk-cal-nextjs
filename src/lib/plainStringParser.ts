import { ParseCourseInput } from "./calculator";
import { RawCourseData } from "./htmlParser";



interface CourseParseLine {
    // Format: Stt	Mã môn học	Tên môn học	Điểm tổng kết	Điểm chữ	Tín chỉ	Đạt	Tình trạng	Nhóm	Ghi chú
    // Example: 1	CO3015	Kiểm tra Phần mềm	8.5	A	3			L01	
    // code: parts[1] - Mã môn học
    // name: parts[2] - Tên môn học  
    // number_score: parts[3] - Điểm tổng kết (số)
    // letter_score: parts[4] - Điểm chữ (A, B+, etc.)
    // credits: parts[5] - Tín chỉ
    code: string;
    name: string;
    credits: number;
    number_score: number | string;
    letter_score: string;
}

export class PlainStringParser implements ParseCourseInput {
    extractCourseData(plainStringContent: string): RawCourseData[] {
        // line with \t separators
        const lines = plainStringContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const courseData: RawCourseData[] = [];

        // Lines to skip (common when using Ctrl+A from webpage)
        const skipPatterns = [
            /^myBk/i,
            /^Toggle navigation/i,
            /^User Image/i,
            /^Khoa /i,
            /^Sinh viên$/i,
            /^Dịch vụ/i,
            /^Kết quả học tập$/i,
            /^Tài liệu/i,
            /^Hệ thống quản lý/i,
            /^Tra thông tin/i,
            /^Bảng điểm/i,
            /^BẢNG ĐIỂM$/i,
            /^Năm học.*Học kỳ$/,
            /^Họ và tên:/i,
            /^Mã sinh viên:/i,
            /^Mã lớp:/i,
            /^Cập nhật cuối:/i,
            /^Các điểm đặc biệt:/i,
            /^Điểm hệ 4/i,
            /^Nhấn vào điểm/i,
            /^Tình trạng điểm:/i,
            /^Hủy điểm:/i,
            /^Tạm tính:/i,
            /^Môn học xét/i,
            /^Danh mục các điểm/i,
            /^Stt\s+Mã môn học/i,
            /^Version /i,
            /^Copyright /i,
        ];

        let i = 0;
        while (i < lines.length) {
            const line = lines[i];

            // Skip known header/footer lines
            if (skipPatterns.some(pattern => pattern.test(line))) {
                i++;
                continue;
            }

            // extract course with \t separator
            // struct: Stt\tMã môn học\tTên môn học\tĐiểm tổng kết\tTín chỉ\tĐạt\tTình trạng\tNhóm\tGhi chú
            const parts = line.split('\t');
            const codeRegex = /^[A-Z]{2}\d{4}/;

            if (codeRegex.test(line)) {
                // Extract course code (first 6 characters)
                const code = line.substring(0, 6);
                // One line course
                let courseText = line;
                let j = i + 1;

                // Collect all lines until the next course code or end of lines, except line start with "Số"
                while (j < lines.length && !codeRegex.test(lines[j]) && !lines[j].startsWith("Số")) {
                    courseText += "\n" + lines[j];
                    j++;
                }

                const courseData2Line = parseMultiLineCourse(courseText);
                if (courseData2Line) {
                    courseData.push(courseData2Line);
                }

                // Update index to the next course
                i = j;

            } else {
                // Try to parse new structure course line (tab-separated with STT at start)
                const parsedLine = parseCourseLine(line);
                if (parsedLine && codeRegex.test(parsedLine.code)) {
                    courseData.push({
                        code: parsedLine.code,
                        name: parsedLine.name,
                        credits: parsedLine.credits,
                        score: parsedLine.number_score
                    });
                }
                i++;
            }
        }

        return courseData;
    }
}

// Helper function to parse new structure course line
// Format: Stt	Mã môn học	Tên môn học	Điểm tổng kết	Điểm chữ	Tín chỉ	Đạt	Tình trạng	Nhóm	Ghi chú
// parts[0] = Stt, parts[1] = code, parts[2] = name, parts[3] = number score, parts[4] = letter score, parts[5] = credits
function parseCourseLine(line: string): CourseParseLine | null {
    const parts = line.split('\t').map(part => part.trim());
    if (parts.length < 6) {
        return null; // Not enough parts to parse
    }
    const code = parts[1];
    const name = parts[2];
    const rawScore = parts[3];
    const letter_score = parts[4];
    const credits = parseInt(parts[5]);

    // Handle special scores like RT, MT, DT, etc.
    const specialScores = ["RT", "MT", "DT", "CT", "VT", "CH", "KD", "VP", "HT"];
    const number_score = specialScores.includes(letter_score) ? letter_score : parseFloat(rawScore);

    return {
        code,
        name,
        credits,
        number_score,
        letter_score
    };
}

// Helper function to parse a multi-line course
function parseMultiLineCourse(text: string): RawCourseData | null {
    const lines = text.split('\n').map(line => line.trim());

    // Course code is the first 6 characters of the first line
    const code = lines[0].substring(0, 6);

    // Extract parts from the first line
    const firstLineParts = lines[0].trim().split(/\s+/);


    // Tìm vị trí của token đầu tiên chứa dấu ":" hoặc có dạng thành phần điểm
    let scoreIndex = firstLineParts.findIndex(token =>
        token.includes("(")
    );
    let credits = 0;
    if (scoreIndex > 0) {
        while (scoreIndex > 0 && !/\d+$/.test(firstLineParts[scoreIndex - 1])) {
            scoreIndex--;
            const maybeCredit = firstLineParts[scoreIndex - 1];
            if (/^\d+$/.test(maybeCredit)) {
                credits = parseInt(maybeCredit);
            }
        }
    }


    // Extract name from the first line (remove code and other parts)
    const name = firstLineParts.slice(1, scoreIndex - 1).join(' ');

    // Find the line containing "Thi" for the score
    let score: number | string = "";
    const thiLine = lines.find(line => line.includes("Thi"));

    if (thiLine) {
        const thiParts = thiLine.split(/\s+/);
        // Find the last numeric value in the line
        for (let i = 3; i >= 0; i--) {
            if (thiParts[i] === "RT") {
                score = "RT";
                break;
            }
            if (!isNaN(parseFloat(thiParts[i]))) {
                score = parseFloat(thiParts[i]);
                break;
            }
        }
    }

    // If we couldn't find a score in the "Thi" line, try the last line
    if (!score && lines.length > 1) {
        const lastLine = lines[lines.length - 1];
        const lastParts = lastLine.split(/\s+/);
        // Find the first numeric value in the last line
        for (let i = 0; i < lastParts.length; i++) {
            if (!isNaN(parseFloat(lastParts[i]))) {
                score = parseFloat(lastParts[i]);
                break;
            }
        }
    }

    return {
        code,
        name,
        credits,
        score
    };
}
