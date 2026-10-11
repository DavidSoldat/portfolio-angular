export interface Channel { name: string; color: string; trace: string; items: string[]; }

export const CHANNELS: readonly Channel[] = [
  { name: 'Backend', color: 'var(--color-red)', trace: 'M0 10 6 4 12 9 18 2 24 8 34 3',
    items: ['Java', 'Spring Boot', 'Spring Cloud Gateway', 'Spring Modulith', 'Kafka', 'PostgreSQL', 'Redis', 'Keycloak'] },
  { name: 'Frontend', color: 'var(--color-purple)', trace: 'M0 8 8 8 12 3 20 3 24 10 34 10',
    items: ['Angular', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { name: 'AI and ML', color: 'var(--color-green)', trace: 'M0 12 8 6 14 9 22 2 28 6 34 4',
    items: ['langchain4j', 'RAG', 'pgvector', 'ONNX Runtime', 'scikit-learn', 'Anthropic and OpenAI APIs'] },
  { name: 'Delivery', color: 'var(--color-yellow)', trace: 'M0 7 10 7 13 2 16 12 19 7 34 7',
    items: ['Docker', 'Kubernetes (k3s)', 'GitHub Actions', 'Flyway', 'JUnit', 'Testcontainers'] },
];
