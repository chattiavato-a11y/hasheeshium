/**
 * A simple tokenizer that converts text to lowercase and splits by non-alphanumeric characters.
 */
const tokenize = (text: string): string[] => {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
};

// Fix: Make CorpusDoc generic to preserve key type.
interface CorpusDoc<K extends string> {
    key: K;
    text: string;
}

/**
 * A simple implementation of the Okapi BM25 ranking function.
 */
// Fix: Make BM25 class generic to preserve key type.
export class BM25<K extends string> {
    private k1: number;
    private b: number;
    private corpus: string[][];
    private docLengths: number[];
    private avgDocLength: number;
    private idf: Map<string, number>;
    private docs: CorpusDoc<K>[];

    constructor(corpus: CorpusDoc<K>[], k1 = 1.5, b = 0.75) {
        this.k1 = k1;
        this.b = b;
        this.docs = corpus;
        this.corpus = corpus.map(doc => tokenize(doc.text));
        this.docLengths = this.corpus.map(doc => doc.length);
        this.avgDocLength = this.docLengths.reduce((sum, len) => sum + len, 0) / this.corpus.length;
        this.idf = new Map();
        this.calculateIDF();
    }

    private calculateIDF() {
        const docFreq = new Map<string, number>();
        for (const doc of this.corpus) {
            const uniqueTerms = new Set(doc);
            for (const term of uniqueTerms) {
                docFreq.set(term, (docFreq.get(term) || 0) + 1);
            }
        }

        const numDocs = this.corpus.length;
        for (const [term, freq] of docFreq.entries()) {
            const idf = Math.log((numDocs - freq + 0.5) / (freq + 0.5) + 1);
            this.idf.set(term, idf);
        }
    }

    public search(query: string): { doc: CorpusDoc<K>; score: number }[] {
        const queryTerms = tokenize(query);
        const scores = this.docs.map((doc, docIndex) => ({
            doc: doc,
            score: this.getScore(queryTerms, docIndex)
        }));

        // Filter out zero-score results and sort by score descending
        return scores
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);
    }

    private getScore(queryTerms: string[], docIndex: number): number {
        let score = 0;
        const doc = this.corpus[docIndex];
        const docLength = this.docLengths[docIndex];
        const termFreq = new Map<string, number>();

        for (const term of doc) {
            termFreq.set(term, (termFreq.get(term) || 0) + 1);
        }

        for (const term of queryTerms) {
            if (!this.idf.has(term)) continue;

            const idf = this.idf.get(term)!;
            const tf = termFreq.get(term) || 0;

            const numerator = tf * (this.k1 + 1);
            const denominator = tf + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));
            
            score += idf * (numerator / denominator);
        }
        
        return score;
    }
}