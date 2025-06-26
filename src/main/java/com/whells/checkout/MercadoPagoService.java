// MercadoPagoService.java
package com.whells.checkout;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.whells.model.Reserva;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;

@Service
public class MercadoPagoService {
    @Value("${mercadopago.access.token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        if(accessToken == null || accessToken.isBlank()) {
            throw new IllegalStateException("Mercado Pago access token não configurado");
        }
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String criarPagamento(Reserva reserva) {
        try {
            PaymentClient client = new PaymentClient();

            PaymentCreateRequest request = PaymentCreateRequest.builder()
                    .transactionAmount(BigDecimal.valueOf(reserva.getValorTotal()))
                    .description("Aluguel de Bicicleta - Reserva #" + reserva.getId())
                    .paymentMethodId("pix")
                    .externalReference(String.valueOf(reserva.getId()))
                    .payer(PaymentPayerRequest.builder()
                            .email(reserva.getUsuario().getEmail())
                            .firstName(reserva.getUsuario().getNome().split(" ")[0])
                            .build())
                    .build();

            Payment payment = client.create(request);
            reserva.setPaymentId(payment.getId().toString());
            return payment.getPointOfInteraction().getTransactionData().getTicketUrl();

        } catch (MPApiException apiException) {
            throw new RuntimeException("Erro na API Mercado Pago: " + apiException.getApiResponse().getContent());
        } catch (MPException e) {
            throw new RuntimeException("Falha na comunicação com Mercado Pago: " + e.getMessage());
        }
    }
}
