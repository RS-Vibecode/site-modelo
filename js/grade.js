/* ============================================================
   RS SOLUÇÕES DIGITAIS - SITE MODELO
   A GRADE CINÉTICA: o fundo do site.

   Uma malha desenhada em canvas atrás de todo o conteúdo. Ela se
   deforma na direção do ponteiro e cada clique solta uma onda que
   atravessa a tela empurrando os nós pelo caminho.

   Três ideias sustentam o desenho:

   1. AS BORDAS SÃO PREGADAS. As duas primeiras linhas e colunas de
      cada lado quase não se mexem (`pinFactor`). Sem isso a malha
      descola das quinas e a tela inteira parece um pano solto.

   2. O PONTEIRO É PERSEGUIDO, NÃO COPIADO. A posição usada no
      desenho corre atrás do ponteiro real a 8% por quadro. É o que
      dá peso à malha: ela chega atrasada, como coisa que tem massa.

   3. A PROXIMIDADE PINTA. Cada nó calcula o quanto está perto do
      ponteiro, e esse número decide cor, espessura e raio. A luz
      não é um círculo por cima: é a malha acendendo por dentro.

   Sem cores próprias — as três aqui repetem a paleta do CSS.
   ============================================================ */

(function () {
  var tela = document.getElementById('grade-cinetica');
  if (!tela || !tela.getContext) {
    return;
  }

  var ctx = tela.getContext('2d');

  /* --- medidas --- */
  var LADO_CELULA = 55; // distância entre nós
  var RAIO_INFLUENCIA = 260; // até onde o ponteiro é sentido
  var DEFORMACAO_MAX = 24; // quanto um nó chega a andar
  var ESPACO_PONTOS = 28; // a poeira de pontos do fundo
  var PERSEGUICAO = 0.08; // o atraso da malha atrás do ponteiro

  /* --- cores (as mesmas do CSS) --- */
  var COR_FUNDO = '#070c18';
  var LINHA_PARADA = { r: 255, g: 255, b: 255, a: 0.11 };
  var LINHA_ACESA = { r: 255, g: 197, b: 49, a: 0.9 }; // amarelo
  var NO_PARADO = { r: 255, g: 255, b: 255, a: 0.2 };
  var NO_ACESO = { r: 255, g: 197, b: 49, a: 1 };
  var BRILHO = '255, 197, 49';
  var ONDA = '31, 107, 255'; // azul

  var RAIO_NO = 1.8;
  var RAIO_NO_ACESO = 3.2;

  /* --- estado --- */
  var ponteiro = { x: -9999, y: -9999 };
  var alvo = { x: -9999, y: -9999 };
  var ondas = [];
  var largura = 0;
  var altura = 0;

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function entre(a, b, t) {
    return a + (b - a) * t;
  }

  function cor(parada, acesa, t) {
    return (
      'rgba(' +
      Math.round(entre(parada.r, acesa.r, t)) + ',' +
      Math.round(entre(parada.g, acesa.g, t)) + ',' +
      Math.round(entre(parada.b, acesa.b, t)) + ',' +
      entre(parada.a, acesa.a, t).toFixed(3) +
      ')'
    );
  }

  /* ============================================================
     O TAMANHO DA TELA
     O canvas é medido em pixels do dispositivo e desenhado em
     pixels de CSS: sem isso a malha sai borrada em tela retina.
     ============================================================ */
  function medir() {
    var proporcao = Math.min(window.devicePixelRatio || 1, 2);

    largura = window.innerWidth;
    altura = window.innerHeight;

    tela.width = Math.round(largura * proporcao);
    tela.height = Math.round(altura * proporcao);
    ctx.setTransform(proporcao, 0, 0, proporcao, 0, 0);
  }

  /* ============================================================
     ONDE CADA NÓ VAI PARAR
     Devolve a posição já deformada e o quanto o nó está aceso.
     ============================================================ */
  function deformar(gx, gy, coluna, linha, colunas, linhas) {
    // As bordas ficam pregadas: o fator cai a zero nas duas
    // primeiras posições de cada lado.
    var margem = 1.5;
    var pregoColuna = Math.min(coluna / margem, (colunas - 1 - coluna) / margem, 1);
    var pregoLinha = Math.min(linha / margem, (linhas - 1 - linha) / margem, 1);
    var prego = pregoColuna * pregoColuna * pregoLinha * pregoLinha;

    var dx = gx - ponteiro.x;
    var dy = gy - ponteiro.y;
    var distancia = Math.sqrt(dx * dx + dy * dy);
    var aceso = Math.max(0, 1 - distancia / RAIO_INFLUENCIA) * prego;

    // O empurrão das ondas
    var ox = 0;
    var oy = 0;

    for (var i = 0; i < ondas.length; i++) {
      var onda = ondas[i];
      var odx = gx - onda.x;
      var ody = gy - onda.y;
      var odist = Math.sqrt(odx * odx + ody * ody);
      var largura_crista = 55;
      var diferenca = odist - onda.raio;

      if (Math.abs(diferenca) < largura_crista) {
        var forca =
          (1 - Math.abs(diferenca) / largura_crista) * onda.opacidade * 18 * prego;
        var angulo = Math.atan2(ody, odx);
        var lado = diferenca < 0 ? -1 : 1;
        ox += Math.cos(angulo) * forca * lado * -1;
        oy += Math.sin(angulo) * forca * lado * -1;
      }
    }

    // O puxão do ponteiro, com queda em sino
    if (distancia < RAIO_INFLUENCIA && distancia > 0 && prego > 0) {
      var t = distancia / RAIO_INFLUENCIA;
      var suave = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, distancia / 60);
      var quanto = suave * DEFORMACAO_MAX * prego;
      var direcao = Math.atan2(dy, dx);

      return {
        x: gx - Math.cos(direcao) * quanto + ox,
        y: gy - Math.sin(direcao) * quanto + oy,
        aceso: aceso
      };
    }

    return { x: gx + ox, y: gy + oy, aceso: aceso };
  }

  /* ============================================================
     O DESENHO
     ============================================================ */
  function desenhar(agora) {
    ctx.clearRect(0, 0, largura, altura);

    ctx.fillStyle = COR_FUNDO;
    ctx.fillRect(0, 0, largura, altura);

    // A poeira de pontos, que não se mexe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (var px = ESPACO_PONTOS / 2; px < largura; px += ESPACO_PONTOS) {
      for (var py = ESPACO_PONTOS / 2; py < altura; py += ESPACO_PONTOS) {
        ctx.beginPath();
        ctx.arc(px, py, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // As ondas envelhecem
    for (var i = ondas.length - 1; i >= 0; i--) {
      var idade = (agora - ondas[i].nasceu) / 1000;
      ondas[i].raio = Math.max(0, idade * 400);
      ondas[i].opacidade = Math.max(0, 1 - idade * 1.2);
      if (ondas[i].opacidade <= 0) {
        ondas.splice(i, 1);
      }
    }

    // A malha
    var colunas = Math.max(2, Math.ceil(largura / LADO_CELULA)) + 1;
    var linhas = Math.max(2, Math.ceil(altura / LADO_CELULA)) + 1;
    var celulaL = largura / (colunas - 1);
    var celulaA = altura / (linhas - 1);

    var nos = [];
    for (var linha = 0; linha < linhas; linha++) {
      nos[linha] = [];
      for (var coluna = 0; coluna < colunas; coluna++) {
        nos[linha][coluna] = deformar(
          coluna * celulaL,
          linha * celulaA,
          coluna,
          linha,
          colunas,
          linhas
        );
      }
    }

    // Os fios entre os nós
    function fio(a, b) {
      var medio = (a.aceso + b.aceso) / 2;
      var t = medio * medio * (3 - 2 * medio); // suaviza as pontas
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = cor(LINHA_PARADA, LINHA_ACESA, t);
      ctx.lineWidth = entre(0.8, 1.5, t);
      ctx.stroke();
    }

    ctx.lineCap = 'butt';

    for (var l = 0; l < linhas; l++) {
      for (var c = 0; c < colunas - 1; c++) {
        fio(nos[l][c], nos[l][c + 1]);
      }
    }

    for (var c2 = 0; c2 < colunas; c2++) {
      for (var l2 = 0; l2 < linhas - 1; l2++) {
        fio(nos[l2][c2], nos[l2 + 1][c2]);
      }
    }

    // Os nós, e o halo dos que estão acesos
    for (var l3 = 0; l3 < linhas; l3++) {
      for (var c3 = 0; c3 < colunas; c3++) {
        var no = nos[l3][c3];
        var t2 = no.aceso * no.aceso * (3 - 2 * no.aceso);
        var raio = entre(RAIO_NO, RAIO_NO_ACESO, t2);

        if (t2 > 0.3) {
          var raioHalo = raio + entre(0, 6, (t2 - 0.3) / 0.7);
          var halo = ctx.createRadialGradient(no.x, no.y, raio * 0.5, no.x, no.y, raioHalo);
          halo.addColorStop(0, 'rgba(' + BRILHO + ',' + (t2 * 0.3).toFixed(3) + ')');
          halo.addColorStop(1, 'rgba(' + BRILHO + ',0)');
          ctx.beginPath();
          ctx.arc(no.x, no.y, raioHalo, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(no.x, no.y, raio, 0, Math.PI * 2);
        ctx.fillStyle = cor(NO_PARADO, NO_ACESO, t2);
        ctx.fill();
      }
    }

    // Os anéis das ondas
    for (var o = 0; o < ondas.length; o++) {
      ctx.beginPath();
      ctx.arc(ondas[o].x, ondas[o].y, Math.max(0, ondas[o].raio), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + ONDA + ',' + (ondas[o].opacidade * 0.28).toFixed(3) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  /* ============================================================
     O RELÓGIO
     ============================================================ */
  function quadro(agora) {
    ponteiro.x = entre(ponteiro.x, alvo.x, PERSEGUICAO);
    ponteiro.y = entre(ponteiro.y, alvo.y, PERSEGUICAO);
    desenhar(agora);
    window.requestAnimationFrame(quadro);
  }

  medir();
  window.addEventListener('resize', medir);

  /* Quem pediu menos movimento recebe a malha parada: o desenho é
     feito uma vez, sem relógio e sem ouvir o ponteiro. */
  if (menosMovimento || !window.requestAnimationFrame) {
    desenhar(0);
    window.addEventListener('resize', function () {
      desenhar(0);
    });
    return;
  }

  window.addEventListener(
    'mousemove',
    function (evento) {
      alvo.x = evento.clientX;
      alvo.y = evento.clientY;
    },
    { passive: true }
  );

  window.addEventListener('click', function (evento) {
    ondas.push({
      x: evento.clientX,
      y: evento.clientY,
      raio: 0,
      opacidade: 1,
      nasceu: window.performance ? window.performance.now() : 0
    });
  });

  window.requestAnimationFrame(quadro);
})();
