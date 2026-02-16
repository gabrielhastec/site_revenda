/* ==================================================
   contato.js – Casa das Máquinas
   Validação e envio do formulário de contato
================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const btnEnviar = document.getElementById('btnEnviar');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      mostrarFeedback('Por favor, preencha todos os campos obrigatórios.', 'danger');
      return;
    }

    // Desabilitar botão e mostrar spinner
    btnEnviar.disabled = true;
    btnEnviar.querySelector('.btn-text').classList.add('d-none');
    btnEnviar.querySelector('.spinner-border').classList.remove('d-none');
    feedback.classList.add('d-none');

    // Coletar dados
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Simulação de envio (substitua pela sua API real)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // Se a API não existir, simula sucesso após 1 segundo (apenas para demonstração)
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('API não disponível, mas mensagem simulada com sucesso.');
      }

      const result = await response.json();
      mostrarFeedback(result.message || 'Mensagem enviada com sucesso!', 'success');
      form.reset();
      form.classList.remove('was-validated');
    } catch (error) {
      console.error('Erro no envio:', error);
      // Em caso de erro, mostra mensagem amigável
      mostrarFeedback('Houve um problema ao enviar. Tente novamente ou entre em contato por WhatsApp.', 'danger');
    } finally {
      // Reabilitar botão e ocultar spinner
      btnEnviar.disabled = false;
      btnEnviar.querySelector('.btn-text').classList.remove('d-none');
      btnEnviar.querySelector('.spinner-border').classList.add('d-none');
    }
  });

  function mostrarFeedback(mensagem, tipo) {
    feedback.classList.remove('d-none', 'alert-success', 'alert-danger');
    feedback.classList.add(`alert-${tipo}`);
    feedback.textContent = mensagem;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Máscara simples para telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      e.target.value = value.trim();
    });
  }
});
