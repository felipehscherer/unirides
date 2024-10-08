## Requisitos Não Funcionais

- **RNF01 - Desempenho:** O sistema deve processar solicitações e ações dos usuários em menos de 2 segundos, com um tempo máximo de resposta de 5 segundos durante picos de tráfego.

- **RNF02 - Escalabilidade:** A aplicação deve ser capaz de escalar horizontalmente para suportar um número crescente de usuários simultâneos, sem comprometer a performance.

- **RNF03 - Usabilidade:** A interface da aplicação deve ser intuitiva, com um design responsivo, para garantir fácil uso tanto em dispositivos móveis quanto em navegadores desktop.

- **RNF04 - Segurança:** O sistema deve garantir a proteção dos dados dos usuários, utilizando criptografia para transmissão de dados e armazenamento de senhas com hashing seguro. A autenticação multifator (MFA) deve ser oferecida como uma camada adicional de segurança. Embora este requisito possa ser um pouco conflitante com o RNF01, ele deve ser considerado, ainda que seja com uma prioridade reduzida.

