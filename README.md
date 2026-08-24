# Site Modelo - RS Soluções Digitais

Site institucional de página única da RS Soluções Digitais.

- **Paleta:** azul `#1f6bff` → ciano `#2fb8f0` → amarelo `#ffc531` → vermelho `#e8443a`.
  O ciano é a ponte entre o azul e o amarelo — sem ele a interpolação atravessa um cinza
  esverdeado e suja o gradiente inteiro. O vermelho entra só na ponta, e é isso que o
  mantém sendo acento.
- **Fundo:** a **grade cinética** — uma malha desenhada em canvas atrás de todo o site,
  que se deforma na direção do ponteiro e solta uma onda a cada clique.
- **Símbolo:** a marca oficial da RS (`img/marca-rs.png`), usada como máscara.
- **Tipografia:** Sora (títulos), Manrope (leitura), IBM Plex Mono (rótulos e números).
- **Botões:** o gradiente da paleta como fundo, deslizando de ponta a ponta no hover, com
  uma faixa de luz atravessando o botão e a seta que anda junto.
- **Títulos:** sobem de trás de uma linha quando entram na tela, um brilho corre pelas
  letras logo depois, e o hover troca a cor deles.
- **Abertura:** no primeiro carregamento da sessão, o símbolo chega sobre campo escuro e a
  camada se dissolve.
- **Marca final:** só o símbolo grande, sobre uma luz de fundo. Sem reflexo e sem
  movimento.

## Como abrir o site

Não há build nem dependências. Basta abrir o arquivo `index.html` no navegador.

As fontes vêm do Google Fonts; sem internet o site continua funcionando com as fontes
do sistema.

## Estrutura dos arquivos

```
site-modelo/
├── index.html          Conteúdo e estrutura das seções
├── css/
│   └── estilos.css     Todo o visual do site
├── js/
│   ├── grade.js        A grade cinética do fundo
│   └── script.js       Formulário, cabeçalho ao rolar e entrada dos blocos
├── img/
│   └── marca-rs.png    O símbolo da marca, usado como máscara
└── README.md
```

## Onde alterar cada coisa

| O que mudar                     | Onde                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| Textos, títulos e links         | `index.html`                                               |
| Cores, fontes e espaçamentos    | `css/estilos.css`, bloco `:root` no início do arquivo      |
| Efeito de entrada dos títulos   | `css/estilos.css`, fim da seção `4. TÍTULOS E TEXTOS`      |
| Estilo dos botões               | `css/estilos.css`, seção `5. BOTÕES`                       |
| Estilo dos cards                | `css/estilos.css`, seção `8. CARDS`                        |
| Blocos no lugar das imagens     | `css/estilos.css`, seção `9. BLOCOS DE IMAGEM`             |
| Fundo (a grade cinética)        | `js/grade.js` — cores no topo do arquivo                   |
| Abertura do site                | `css/estilos.css`, seção `13. ABERTURA`                    |
| Marca do fim da página          | `css/estilos.css`, seção `14. MARCA FINAL`                 |
| Auroras e animações             | `css/estilos.css`, seção `15. ATMOSFERA E ANIMAÇÕES`       |
| Versão mobile                   | `css/estilos.css`, seção `16. RESPONSIVO`                  |

As cores, fontes e espaçamentos estão centralizados em variáveis CSS no `:root`.
Alterar um valor ali muda o site inteiro.

## Os botões

Todos os botões da página usam o mesmo modelo. A estrutura é sempre esta:

```html
<a href="#contato" class="botao">
  Fale conosco
  <span class="botao-seta" aria-hidden="true">→</span>
</a>
```

O fundo tem 200% de largura: no hover a `background-position` desliza de uma ponta à outra
(`background-image` não interpola, `background-position` sim). Por cima corre o lustro
(`.botao::after`), a faixa de luz que atravessa o botão.

No botão de envio do formulário a seta não entra: ela sugere "avançar de página", que não é
o que acontece ali.

Variantes disponíveis:

| Classe              | Uso                                                        |
| ------------------- | ---------------------------------------------------------- |
| `botao`             | Gradiente da marca. É o botão de conversão.                |
| `botao-secundario`  | Vidro com fio. O segundo caminho, ao lado do principal.    |
| `botao-pequeno`     | Tamanho do cabeçalho.                                      |
| `botao-grande`      | Tamanho da seção inicial.                                  |

## Os títulos

Cada título fica dentro de duas camadas: `mascara` recorta, `mascara-linha` sobe.

```html
<h2 class="titulo-secao">
  <span class="mascara"><span class="mascara-linha brilho-titulo">O que a RS faz</span></span>
</h2>
```

`brilho-titulo` é o brilho que corre pelas letras uma vez, logo depois da revelação — luz
passando pelo texto, não mudança de cor: começa e termina no mesmo off-white. O gatilho dos
dois é o mesmo do resto da página: a classe `visivel`, aplicada pelo script quando o
elemento entra na tela.

### O hover

Passar o ponteiro sobre um título grande (`titulo-principal` ou `titulo-secao`) troca a cor
dele para o amarelo da paleta, e nada mais.

Nos títulos de seção quem pinta as letras é o gradiente do brilho, e não a `color` — por
isso lá a troca é do próprio gradiente, por um amarelo chapado.

O efeito só existe onde há ponteiro de verdade (`@media (hover: hover)`): em tela de toque
o `:hover` gruda depois do toque e o título ficaria aceso sem motivo.

## O fundo: a grade cinética

Uma malha desenhada em canvas (`js/grade.js`), fixa atrás de todo o conteúdo. Ela se
deforma na direção do ponteiro e cada clique solta uma onda que atravessa a tela empurrando
os nós pelo caminho. As seções são translúcidas de propósito — a grade passa por baixo da
página inteira.

Três ideias sustentam o desenho:

1. **As bordas são pregadas.** As duas primeiras linhas e colunas de cada lado quase não se
   mexem. Sem isso a malha descola das quinas e a tela parece um pano solto.
2. **O ponteiro é perseguido, não copiado.** A posição usada no desenho corre atrás do
   ponteiro real a 8% por quadro. É o que dá peso à malha: ela chega atrasada, como coisa
   que tem massa.
3. **A proximidade pinta.** Cada nó calcula o quanto está perto do ponteiro, e esse número
   decide cor, espessura e raio. A luz não é um círculo por cima: é a malha acendendo por
   dentro.

As cores ficam num bloco no topo do arquivo e repetem a paleta do CSS — inclusive a cor de
fundo, que é a mesma `--cor-fundo`. Se as duas descolarem, aparece uma emenda entre o fundo
do documento e o fundo do desenho.

Com movimento reduzido a malha é desenhada uma vez e fica parada: sem relógio, sem ouvir o
ponteiro.

## O símbolo

A forma vem do arquivo oficial da marca, recortado para o monograma sozinho e usado como
**máscara** (`-webkit-mask-image`), não como imagem. Assim o desenho é exatamente o da RS e
a cor é a da paleta — o gradiente atravessa a peça inteira. A mesma classe `simbolo` serve
o cabeçalho, a abertura e o fim da página; só muda a largura.

## A abertura

A camada que cobre o site no primeiro carregamento. Minimalista, 2,1 segundos:

| Momento | O que acontece                                                    |
| ------- | ------------------------------------------------------------------ |
| 0,1s    | O símbolo chega, subindo alguns pixels e crescendo de leve         |
| 0,5s    | O nome assenta, fechando o espaçamento das letras                  |
| 0,7s    | Um fio da paleta se acende embaixo, da esquerda para a direita     |
| 1,5s    | A camada se dissolve                                               |

O fecho é só uma dissolvência — nenhum gesto, porque o site já estava lá o tempo todo.

Três decisões que importam:

- **O padrão é invisível.** A abertura só existe quando o script do `<head>` escreve
  `abertura-tocando` no `<html>`. Sem JavaScript, com movimento reduzido ou na segunda
  visita da mesma sessão ninguém escreve, e o site está inteiro ali atrás. O contrário
  (nascer opaca e depender de alguém apagá-la) transformaria qualquer caminho não previsto
  num campo preto cobrindo o site.
- **Toca uma vez por sessão.** Fica guardado em `sessionStorage`. Para ver de novo, abra
  uma janela anônima ou limpe os dados do site.
- **Ela é uma camada, não um portão.** A página está montada embaixo desde o primeiro
  quadro; a abertura só cobre.

Para desligar de vez, remova o bloco `<script>` do `<head>` do `index.html`.

## A marca final

O fecho da página: só o símbolo grande, sobre uma luz de fundo. É uma peça **parada** —
nada ali se mexe, e não há reflexo.

## Seções da página

1. Cabeçalho (logo, menu e botão "Fale conosco")
2. Seção inicial
3. Serviços (4 cards)
4. Projetos (4 projetos)
5. Sobre a RS
6. Depoimentos (3 depoimentos)
7. Contato (formulário)
8. Marca final
9. Rodapé

## Observações

- O menu leva às seções da própria página por meio de âncoras (`#servicos`, `#projetos`...).
- O formulário de contato é **apenas visual**: não envia dados e não usa backend nem banco de dados.
- Os projetos e depoimentos são fictícios, criados apenas para preencher o layout.
- As imagens ainda não existem: os blocos com o gradiente da marca marcam onde elas entram.
- Quem usa o sistema com "menos movimento" (`prefers-reduced-motion`) não recebe nenhuma
  animação: a abertura não toca, os títulos nascem no lugar e a marca final fica parada de
  frente, com o reflexo estático.
