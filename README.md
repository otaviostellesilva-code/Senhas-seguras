# Senhas-seguras
<img width="1310" height="758" alt="image" src="https://github.com/user-attachments/assets/e020a2bc-df19-4b4a-abf6-d234b1b7673b" />

Este website, intitulado "CriptoAnálise — A Matemática das Senhas", é uma ferramenta interativa e educacional focada em segurança da informação. O seu principal objetivo é demonstrar, através de cálculos matemáticos e estatísticos, como o comprimento e a aleatoriedade influenciam a segurança de uma palavra-passe (senha).

O site divide-se em três secções principais:

1. Introdução Teórica
Conceito de Espaço de Busca: Explica que a segurança de uma palavra-passe não depende apenas de caracteres especiais, mas sim do crescimento exponencial das combinações possíveis com base no seu comprimento.

Métrica de Ameaça: Apresenta um dado estatístico referencial de que supercomputadores atuais conseguem testar cerca de 100 bilhões de tentativas por segundo num ataque de força bruta.

Regras Fundamentais: Destaca três boas práticas — evitar padrões previsíveis, aumentar o alfabeto (misturar maiúsculas, minúsculas, números e símbolos) e utilizar geradores aleatórios.

2. Analisador de Entropia em Tempo Real
Esta é a ferramenta interativa central do site. Ao digitar uma palavra-passe, o sistema calcula instantaneamente:

Alfabeto (Charset): Identifica quantos símbolos diferentes pertencem aos grupos usados (ex: apenas números = 10 símbolos; apenas letras minúsculas = 26 símbolos).

Combinações: Exibe o número total de possibilidades matemáticas que um hacker teria de testar para adivinhar a sequência.

Entropia (Bits): Mede a aleatoriedade real da palavra-passe. Quanto maior o valor em bits, mais segura ela é.

Tempo de Quebra: Estima o tempo que um atacante levaria para decifrar a palavra-passe por força bruta (variando desde "instantâneo" até "milhões de anos").

Alertas de Padrões: Deteta falhas comuns comuns na sequência digitada, como sequências óbvias (123, abc), caracteres repetidos ou palavras comuns de dicionário (senha, qwerty).

3. Gerador Criptográfico
Permite ao utilizador criar de forma instantânea uma nova palavra-passe de 20 caracteres altamente segura.

A geração é feita localmente utilizando a API criptográfica nativa do navegador (crypto.getRandomValues), garantindo uma aleatoriedade real e segura contra previsões de software.

Inclui uma função rápida de cópia para a área de transferência.

Em suma, o site funciona como uma aplicação prática de conscientização cibernética, combinando teoria matemática de forma visual e interativa para ajudar utilizadores a criarem credenciais digitais mais fortes.
