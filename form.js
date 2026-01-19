$(function() {
    function after_form_submitted(data) {
        if (data.result == 'success') {
            $('#success_message').show(); // Exibe a mensagem de sucesso
            $('#error_message').hide();   // Oculta a mensagem de erro
        } else {
            $('#error_message').html('<ul></ul>'); // Limpa e prepara a lista de erros

            // Itera sobre os erros e adiciona cada um à lista
            jQuery.each(data.errors, function(key, val) {
                $('#error_message ul').append('<li>' + val + '</li>'); // Exibe apenas a mensagem de erro
            });

            $('#success_message').hide(); // Oculta a mensagem de sucesso
            $('#error_message').show();   // Exibe a mensagem de erro

            // Reverte o estado do botão
            $('button[type="button"]', $form).each(function() {
                $btn = $(this);
                label = $btn.prop('orig_label');
                if (label) {
                    $btn.prop('type', 'submit'); // Restaura o tipo do botão para "submit"
                    $btn.text(label);            // Restaura o texto original do botão
                    $btn.prop('orig_label', ''); // Limpa o rótulo original
                }
            });
        }
    }

    // Submissão do formulário
    $('#contact_form').submit(function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        $form = $(this);

        // Altera o texto do botão durante o envio
        $('button[type="submit"]', $form).each(function() {
            $btn = $(this);
            $btn.prop('type', 'button'); // Altera o tipo do botão para "button"
            $btn.prop('orig_label', $btn.text()); // Armazena o texto original do botão
            $btn.text('Enviando ...'); // Altera o texto do botão para "Enviando ..."
        });

        // Envia o formulário via AJAX
        $.ajax({
            type: "POST",
            url: 'handler.php', // Arquivo PHP que processa o formulário
            data: $form.serialize(), // Serializa os dados do formulário
            success: after_form_submitted, // Função de callback após o envio
            dataType: 'json' // Tipo de dados esperado na resposta
        });
    });
});