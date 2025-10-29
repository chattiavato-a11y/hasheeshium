import { BM25 } from './bm25';
import { services, ServiceKey } from '../../../lib/services';

interface CorpusDoc {
  key: ServiceKey;
  text: string;
  answer: string;
}

const createCorpus = (): CorpusDoc[] => {
  return services.map((service) => {
    const english = {
      title: service.title.en,
      description: service.description.en,
      spotlight: service.spotlight.en,
      features: service.modal.features.en,
      content: service.modal.content.en,
    };

    const text = [
      english.title,
      english.title,
      english.description,
      english.spotlight,
      english.content,
      english.features.join(' '),
    ]
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    const featureList = english.features.slice(0, 4).map((item) => `*   ${item}`).join('\n');
    const answer = [
      `I can definitely help with that. Our **${english.title}** pod is built to ${english.description.toLowerCase()}.`,
      'Key capabilities include:',
      featureList,
      'Would you like me to open the service playbook or connect you with a human specialist?'
    ].join('\n');

    return {
      key: service.key,
      text,
      answer,
    };
  });
};

const corpus = createCorpus();
const searchIndex = new BM25<ServiceKey>(corpus);

const MIN_RELEVANCE_SCORE = 1.0;

export const searchKnowledgeBase = (query: string): string | null => {
  const results = searchIndex.search(query);

  if (results.length > 0 && results[0].score > MIN_RELEVANCE_SCORE) {
    const bestResultKey = results[0].doc.key;
    const matchingDoc = corpus.find((doc) => doc.key === bestResultKey);

    if (matchingDoc) {
      console.log(`[KB Service] Found relevant document '${bestResultKey}' with score: ${results[0].score}`);
      return matchingDoc.answer;
    }
  }

  console.log('[KB Service] No relevant document found above threshold.');
  return null;
};
