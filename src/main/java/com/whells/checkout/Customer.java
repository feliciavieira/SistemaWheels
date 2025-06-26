package com.whells.checkout;

import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class Customer {

    /**
     * Cria um ID de cliente local (para uso interno no sistema)
     * @return ID único gerado localmente
     */
    public String createCustomer() {
        // Gera um ID único para o cliente (simulando o que o Asaas fazia)
        return "wheels_customer_" + UUID.randomUUID().toString();
    }

    /**
     * Método vazio mantido para compatibilidade (não faz nada sem Asaas)
     * @return null ou string vazia
     */
    public String getAccessToken() {
        return null;
    }
}