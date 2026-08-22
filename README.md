# Site Modelo - RS Soluções Digitais

Site institucional de página única criado como **base para uma atividade prática de design**.

A versão atual é **propositalmente básica**: fundo branco, textos em preto e cinza,
fonte Arial, botões retangulares, cards apenas com borda e blocos cinza no lugar das
imagens. A estrutura funciona, mas o visual ainda não tem identidade.

## Objetivo da atividade

Melhorar o layout e criar uma identidade visual profissional para a RS Soluções Digitais.

Pontos abertos para trabalho:

- Escolher uma nova paleta de cores;
- Melhorar a tipografia;
- Reorganizar os espaçamentos;
- Criar hierarquia visual entre as seções;
- Melhorar os cards;
- Adicionar imagens (hoje são blocos cinza);
- Trabalhar botões e chamadas;
- Criar animações;
- Melhorar a experiência no celular;
- Desenvolver a identidade visual da RS.

## Como abrir o site

Não há build, dependências ou servidor. Basta abrir o arquivo `index.html` no navegador.

## Estrutura dos arquivos

```
site-modelo/
├── index.html          Conteúdo e estrutura das seções
├── css/
│   └── estilos.css     Todo o visual do site
├── js/
│   └── script.js       Script do formulário de contato
└── README.md
```

## Onde alterar cada coisa

| O que mudar                   | Onde                                                      |
| ----------------------------- | --------------------------------------------------------- |
| Textos, títulos e links       | `index.html`                                              |
| Cores, fontes e espaçamentos  | `css/estilos.css`, bloco `:root` no início do arquivo     |
| Estilo dos cards              | `css/estilos.css`, seção `8. CARDS`                       |
| Blocos cinza (futuras imagens)| `css/estilos.css`, seção `9. BLOCOS DE IMAGEM`            |
| Versão mobile                 | `css/estilos.css`, seção `13. RESPONSIVO`                 |

As cores, fontes e espaçamentos estão centralizados em variáveis CSS no `:root`.
Alterar um valor ali muda o site inteiro.

## Seções da página

1. Cabeçalho (logo, menu e botão "Fale conosco")
2. Seção inicial
3. Serviços (4 cards)
4. Projetos (4 projetos)
5. Sobre a RS
6. Depoimentos (3 depoimentos)
7. Contato (formulário)
8. Rodapé

## Observações

- O menu leva às seções da própria página por meio de âncoras (`#servicos`, `#projetos`...).
- O formulário de contato é **apenas visual**: não envia dados e não usa backend nem banco de dados.
- Os projetos e depoimentos são fictícios, criados apenas para preencher o layout.
