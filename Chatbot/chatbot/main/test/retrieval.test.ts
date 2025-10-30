import { describe, expect, it } from "vitest";
import { detectLanguage, retrieveDocuments } from "../src/retrieval";

describe("knowledge retrieval", () => {
        it("prioritizes contact details for English contact queries", () => {
                const results = retrieveDocuments("How do I contact OPS for a discovery call?", {
                        language: "en",
                        limit: 3,
                });
                const docIds = results.map((entry) => entry.document.id);
                expect(docIds).toContain("ops-contact-en");
        });

        it("returns bilingual matches for Spanish prompts", () => {
                const results = retrieveDocuments("¿Cómo contacto a OPS para hablar con alguien?", {
                        language: "es",
                        limit: 3,
                });
                const docIds = results.map((entry) => entry.document.id);
                expect(docIds).toContain("ops-contact-es");
        });
});

describe("language detection", () => {
        it("falls back to English when no Spanish signals exist", () => {
                const detected = detectLanguage("Tell me about OPS remote professionals", "en");
                expect(detected).toBe("en");
        });

        it("detects Spanish punctuation and keywords", () => {
                const detected = detectLanguage("¡Hola! ¿Cuáles son los pilares de OPS?", "en");
                expect(detected).toBe("es");
        });
});
