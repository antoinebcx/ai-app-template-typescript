export interface ElementType {
    elementNumber: number;
    elementName: string;
    elementDescription: string;
}
  
export interface InputAnalysisType {
    reasoning: string;
    elements: ElementType[];
    summary: string;
}

export interface ClassificationResult {
    category: string;
    confidence: number;
}
