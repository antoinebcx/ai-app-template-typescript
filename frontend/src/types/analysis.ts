export interface ElementSchema {
    elementNumber: number;
    elementName: string;
    elementDescription: string;
}
  
export interface InputAnalysisSchema {
    reasoning: string;
    elements: ElementSchema[];
    summary: string;
}

export interface ClassificationResult {
    category: string;
    confidence: number;
}
