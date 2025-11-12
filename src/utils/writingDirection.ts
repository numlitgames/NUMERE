// Writing direction configuration for different languages
export interface WritingDirection {
  flow: 'horizontal' | 'vertical';
  direction: 'ltr' | 'rtl' | 'ttb'; // left-to-right, right-to-left, top-to-bottom
  lineDirection: 'horizontal' | 'vertical';
  lineFlow: 'ttb' | 'btt' | 'ltr' | 'rtl'; // top-to-bottom, bottom-to-top, left-to-right, right-to-left
}

export const writingDirections: Record<string, WritingDirection> = {
  // European languages - horizontal, left-to-right, lines top-to-bottom
  ro: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  en: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  fr: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  de: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  es: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  it: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  pl: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  cs: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  hu: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  bg: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  ru: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  el: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  tr: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  
  // Arabic - horizontal, right-to-left
  ar: { flow: 'horizontal', direction: 'rtl', lineDirection: 'vertical', lineFlow: 'ttb' },
  
  // Hindi - horizontal, left-to-right
  hi: { flow: 'horizontal', direction: 'ltr', lineDirection: 'vertical', lineFlow: 'ttb' },
  
  // Japanese - can be vertical top-to-bottom, right-to-left OR horizontal left-to-right
  ja: { flow: 'vertical', direction: 'ttb', lineDirection: 'horizontal', lineFlow: 'rtl' },
  
  // Chinese - traditionally vertical top-to-bottom, right-to-left
  zh: { flow: 'vertical', direction: 'ttb', lineDirection: 'horizontal', lineFlow: 'rtl' }
};

export interface LetterPosition {
  x: number;
  y: number;
  lineIndex: number;
  positionInLine: number;
}

export class WritingDirectionManager {
  private letterSize: number = 50;
  private letterSpacing: number = 5;
  private lineSpacing: number = 60;
  private canvasWidth: number;
  private canvasHeight: number;
  private writingDir: WritingDirection;
  private positions: LetterPosition[] = [];
  private currentLine: number = 0;
  private currentPositionInLine: number = 0;

  constructor(
    canvasWidth: number, 
    canvasHeight: number, 
    language: string,
    letterSize: number = 50
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.letterSize = letterSize;
    this.writingDir = writingDirections[language] || writingDirections.en;
  }

  getNextLetterPosition(): LetterPosition {
    let x: number, y: number;

    if (this.writingDir.flow === 'horizontal') {
      // Horizontal flow (European languages, Arabic, Hindi)
      const startX = this.writingDir.direction === 'rtl' 
        ? this.canvasWidth - this.letterSize - 20  // Start from right for RTL
        : 20; // Start from left for LTR
      
      if (this.writingDir.direction === 'ltr') {
        x = startX + (this.currentPositionInLine * (this.letterSize + this.letterSpacing));
      } else {
        x = startX - (this.currentPositionInLine * (this.letterSize + this.letterSpacing));
      }
      
      y = 20 + (this.currentLine * this.lineSpacing);

      // Check if we need to wrap to next line
      const maxLettersPerLine = this.writingDir.direction === 'ltr' 
        ? Math.floor((this.canvasWidth - 40) / (this.letterSize + this.letterSpacing))
        : Math.floor((this.canvasWidth - 40) / (this.letterSize + this.letterSpacing));

      if (this.currentPositionInLine >= maxLettersPerLine - 1) {
        this.currentLine++;
        this.currentPositionInLine = 0;
      } else {
        this.currentPositionInLine++;
      }

    } else {
      // Vertical flow (Japanese, Chinese)
      const startY = 20;
      const startX = this.writingDir.lineFlow === 'rtl' 
        ? this.canvasWidth - this.letterSize - 20  // Start from right column
        : 20; // Start from left column
      
      y = startY + (this.currentPositionInLine * (this.letterSize + this.letterSpacing));
      
      if (this.writingDir.lineFlow === 'rtl') {
        x = startX - (this.currentLine * this.lineSpacing);
      } else {
        x = startX + (this.currentLine * this.lineSpacing);
      }

      // Check if we need to wrap to next column
      const maxLettersPerColumn = Math.floor((this.canvasHeight - 40) / (this.letterSize + this.letterSpacing));

      if (this.currentPositionInLine >= maxLettersPerColumn - 1) {
        this.currentLine++;
        this.currentPositionInLine = 0;
      } else {
        this.currentPositionInLine++;
      }
    }

    const position: LetterPosition = {
      x,
      y,
      lineIndex: this.currentLine,
      positionInLine: this.currentPositionInLine
    };

    this.positions.push(position);
    return position;
  }

  reset() {
    this.positions = [];
    this.currentLine = 0;
    this.currentPositionInLine = 0;
  }

  getAllPositions(): LetterPosition[] {
    return [...this.positions];
  }
}