/* ============================================================
   RS SOLUÇÕES DIGITAIS - SITE MODELO
   Script simples, usado apenas pelo formulário de contato.

   O site não possui backend nem banco de dados.
   O formulário apenas exibe uma mensagem na tela.
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
