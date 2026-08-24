/* ============================================================
   RS SOLUÇÕES DIGITAIS - SITE MODELO
   Script simples, usado em quatro pontos:

   0. Fim da abertura
   1. Formulário de contato (apenas visual)
   2. Cabeçalho que muda ao rolar a página
   3. Entrada dos blocos conforme aparecem na tela

   O site não possui backend nem banco de dados.
   ============================================================ */


/* ============================================================
   0. FIM DA ABERTURA

   É também a rede de segurança — se alguma animação não completar,
   a camada sai assim mesmo e o site nunca fica preso atrás dela.
   ============================================================ */
if (document.documentElement.classList.contains('abertura-tocando')) {
  // Só o fim: quem decide se a abertura toca é o script do <head>, e a
  // animação inteira é do CSS. Tirar a classe devolve a rolagem e apaga
  // a camada de vez.
  //
  // É também a rede de segurança — se alguma animação não completar, a
  // camada sai assim mesmo e o site nunca fica preso atrás dela.
  window.setTimeout(function () {
    document.documentElement.classList.remove('abertura-tocando');
  }, 2250);
}


/* ============================================================
   1. FORMULÁRIO DE CONTATO
   ============================================================ */
var formularioContato = document.getElementById('formulario-contato');
var mensagemEnvio = document.getElementById('mensagem-envio');

if (formularioContato) {
  formularioContato.addEventListener('submit', function (evento) {
    // Impede o envio, já que não existe servidor para receber os dados.
    evento.preventDefault();

    mensagemEnvio.textContent =
      'Formulário apenas demonstrativo. As informações não foram enviadas.';

    formularioContato.reset();
  });
}


/* ============================================================
   2. CABEÇALHO AO ROLAR
   Sai do estado transparente e ganha fundo e fio quando a
   página deixa o topo.
   ============================================================ */
var cabecalho = document.querySelector('.cabecalho');

if (cabecalho) {
  var atualizarCabecalho = function () {
    if (window.scrollY > 20) {
      cabecalho.classList.add('rolado');
    } else {
      cabecalho.classList.remove('rolado');
    }
  };

  atualizarCabecalho();
  window.addEventListener('scroll', atualizarCabecalho, { passive: true });
}


/* ============================================================
   3. ENTRADA DOS BLOCOS E DOS TÍTULOS
   Dois efeitos, o mesmo gatilho: os elementos com a classe
   "revelar" surgem quando entram na tela, e os títulos marcados
   com "mascara" sobem de trás da linha que os esconde.

   Se o navegador não suportar o recurso, ou se a pessoa pediu
   menos movimento, tudo aparece de uma vez.
   ============================================================ */
var blocos = document.querySelectorAll('.revelar, .mascara');
var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!('IntersectionObserver' in window) || menosMovimento) {
  for (var i = 0; i < blocos.length; i++) {
    blocos[i].classList.add('visivel');
  }
} else {
  var observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          // Uma vez visível, o bloco não precisa mais ser observado.
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  blocos.forEach(function (bloco, indice) {
    // Pequeno atraso em cascata dentro de cada grade de cards.
    // Os títulos ficam de fora: o atraso deles está no CSS.
    if (bloco.classList.contains('revelar')) {
      bloco.style.transitionDelay = (indice % 4) * 0.08 + 's';
    }
    observador.observe(bloco);
  });
}
