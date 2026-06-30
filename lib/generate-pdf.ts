import jsPDF from 'jspdf';

interface PdfQuestion {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  selected: number | null;
}

interface PdfSection {
  subject: string;
  topicName: string;
  questions: PdfQuestion[];
  score: number;
  total: number;
  percentage: number;
}

// ─── Shared helpers ───

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  // Gold bar
  doc.setFillColor(245, 183, 47);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(26, 19, 4);
  doc.text('Star Tutoring', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('www.startutoring.uk', 14, 19);

  // Title
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, 14, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(subtitle, 14, 50);
}

function addFooter(doc: jsPDF, pageNum: number) {
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Page ${pageNum}`, 105, 290, { align: 'center' });
  doc.text('Star Tutoring — Stretford, Manchester', 105, 294, { align: 'center' });
}

function checkPageBreak(doc: jsPDF, y: number, needed: number, pageNum: { v: number }): number {
  if (y + needed > 275) {
    addFooter(doc, pageNum.v);
    doc.addPage();
    pageNum.v++;
    return 20;
  }
  return y;
}

function renderQuestion(
  doc: jsPDF, q: PdfQuestion, index: number, y: number, pageNum: { v: number }
): number {
  y = checkPageBreak(doc, y, 50, pageNum);

  const isCorrect = q.selected === q.correct;

  // Question number + status
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);

  const status = q.selected === null ? '[Not answered]' : isCorrect ? '[Correct]' : '[Wrong]';
  const statusColor: [number, number, number] = q.selected === null
    ? [150, 150, 150] : isCorrect ? [34, 180, 100] : [220, 60, 60];

  // Question text (wrap)
  const qText = `Q${index + 1}. ${q.text}`;
  const lines = doc.splitTextToSize(qText, 155);
  doc.text(lines, 14, y);

  // Status badge
  doc.setFontSize(8);
  doc.setTextColor(...statusColor);
  doc.text(status, 175, y);

  y += lines.length * 5 + 3;

  // Options
  doc.setFontSize(9);
  for (let j = 0; j < q.options.length; j++) {
    y = checkPageBreak(doc, y, 8, pageNum);

    const letter = String.fromCharCode(65 + j);
    const isSelectedOpt = j === q.selected;
    const isCorrectOpt = j === q.correct;

    // Marker
    let marker = '   ';
    if (isCorrectOpt) {
      doc.setTextColor(34, 180, 100);
      marker = ' > ';
    } else if (isSelectedOpt && !isCorrectOpt) {
      doc.setTextColor(220, 60, 60);
      marker = ' x ';
    } else {
      doc.setTextColor(80, 80, 80);
    }

    const optText = `${marker}${letter}) ${q.options[j]}`;
    const suffix = isCorrectOpt ? '  [Correct Answer]' : (isSelectedOpt && !isCorrectOpt) ? '  [Your Answer]' : '';

    doc.setFont('helvetica', isCorrectOpt || isSelectedOpt ? 'bold' : 'normal');
    const optLines = doc.splitTextToSize(optText + suffix, 170);
    doc.text(optLines, 18, y);
    y += optLines.length * 4.5 + 1;
  }

  // Explanation
  y = checkPageBreak(doc, y, 12, pageNum);
  y += 2;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const expLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, 165);
  doc.text(expLines, 20, y);
  y += expLines.length * 4 + 6;

  // Separator line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, y, 196, y);
  y += 5;

  return y;
}

// ─── Quiz PDF ───

export function generateQuizPdf(
  title: string,
  subject: string,
  level: string,
  score: number,
  total: number,
  timeTakenSecs: number,
  answers: PdfQuestion[]
) {
  const doc = new jsPDF();
  const pageNum = { v: 1 };
  const pct = Math.round((score / total) * 100);
  const mins = Math.floor(timeTakenSecs / 60);
  const secs = timeTakenSecs % 60;

  addHeader(doc, title, `${subject} | ${level} | Score: ${score}/${total} (${pct}%) | Time: ${mins}m ${secs}s`);

  // Score summary box
  let y = 58;
  doc.setFillColor(245, 250, 255);
  doc.roundedRect(14, y, 182, 16, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const gradeLabel = pct >= 90 ? 'Outstanding' : pct >= 75 ? 'Great Work' : pct >= 50 ? 'Good Effort' : 'Keep Going';
  doc.setTextColor(pct >= 50 ? 34 : 220, pct >= 50 ? 140 : 60, pct >= 75 ? 100 : 60);
  doc.text(`${gradeLabel} — ${pct}%`, 105, y + 10, { align: 'center' });

  y += 24;

  // Questions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('Question Review', 14, y);
  y += 8;

  for (let i = 0; i < answers.length; i++) {
    y = renderQuestion(doc, answers[i], i, y, pageNum);
  }

  addFooter(doc, pageNum.v);
  doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Results.pdf`);
}

// ─── Weekly Test PDF ───

export function generateWeeklyTestPdf(
  title: string,
  totalScore: number,
  totalQuestions: number,
  totalPercentage: number,
  timeTakenSecs: number,
  sections: PdfSection[]
) {
  const doc = new jsPDF();
  const pageNum = { v: 1 };
  const mins = Math.floor(timeTakenSecs / 60);
  const secs = timeTakenSecs % 60;
  const grade = totalPercentage >= 90 ? 'A*' : totalPercentage >= 75 ? 'A' : totalPercentage >= 60 ? 'B' : totalPercentage >= 45 ? 'C' : 'D';

  addHeader(doc, title, `Grade: ${grade} | Score: ${totalScore}/${totalQuestions} (${totalPercentage}%) | Time: ${mins}m ${secs}s`);

  let y = 58;

  // Subject breakdown table
  doc.setFillColor(245, 250, 255);
  const tableHeight = 8 + sections.length * 7;
  doc.roundedRect(14, y, 182, tableHeight, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Subject', 18, y + 6);
  doc.text('Topic', 65, y + 6);
  doc.text('Score', 140, y + 6);
  doc.text('Percentage', 165, y + 6);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  for (const sec of sections) {
    doc.text(sec.subject, 18, y + 4);
    doc.text(sec.topicName.slice(0, 25), 65, y + 4);
    doc.text(`${sec.score}/${sec.total}`, 140, y + 4);
    const pctColor: [number, number, number] = sec.percentage >= 75 ? [34, 180, 100] : sec.percentage >= 50 ? [200, 160, 0] : [220, 60, 60];
    doc.setTextColor(...pctColor);
    doc.text(`${sec.percentage}%`, 170, y + 4);
    doc.setTextColor(30, 30, 30);
    y += 7;
  }

  y += 8;

  // Questions per section
  for (const sec of sections) {
    y = checkPageBreak(doc, y, 20, pageNum);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    const sectionLabel = sec.topicName !== sec.subject ? `${sec.subject} — ${sec.topicName}` : sec.subject;
    doc.text(sectionLabel, 14, y);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`(${sec.score}/${sec.total})`, 14 + doc.getTextWidth(`${sectionLabel}  `), y);
    y += 7;

    for (let i = 0; i < sec.questions.length; i++) {
      y = renderQuestion(doc, sec.questions[i], i, y, pageNum);
    }

    y += 3;
  }

  addFooter(doc, pageNum.v);
  doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Results.pdf`);
}
