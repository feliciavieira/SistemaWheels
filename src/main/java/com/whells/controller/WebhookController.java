// WebhookController.java
package com.whells.controller;

import com.google.gson.Gson;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.whells.model.Reserva;
import com.whells.repository.ReservaRepositorio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {
    @Value("${mercadopago.webhook.key}")
    private String webhookKey;
    private final ReservaRepositorio reservaRepositorio;
    private final Gson gson = new Gson();

    public WebhookController(ReservaRepositorio reservaRepositorio) {
        this.reservaRepositorio = reservaRepositorio;
    }

    @PostMapping("/mercadopago")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("x-signature") String signature,
            @RequestHeader("x-request-id") String requestId) {
        try {
            if (!isValidSignature(payload, signature)) {
                return ResponseEntity.status(401).build();
            }

            Map<String, Object> data = gson.fromJson(payload, Map.class);
            String action = (String) data.get("action");
            String paymentId = (String) data.get("data.id");

            if (paymentId != null && ("payment.created".equals(action) || "payment.updated".equals(action))) {
                processPayment(paymentId);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private boolean isValidSignature(String payload, String receivedSignature) throws Exception {
        if (webhookKey == null || webhookKey.isEmpty()) {
            throw new IllegalStateException("Webhook key não configurada");
        }

        String[] parts = receivedSignature.split(",");
        if (parts.length < 2) return false;

        String timestamp = parts[0].split("=")[1];
        String signature = parts[1].split("=")[1];
        String verificationString = timestamp + payload;

        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(webhookKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        byte[] hashBytes = sha256_HMAC.doFinal(verificationString.getBytes(StandardCharsets.UTF_8));
        String calculatedSignature = Base64.getEncoder().encodeToString(hashBytes);

        return MessageDigest.isEqual(signature.getBytes(StandardCharsets.UTF_8), calculatedSignature.getBytes());
    }

    private void processPayment(String paymentId) {
        try {
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.parseLong(paymentId));

            if (payment != null) {
                reservaRepositorio.findByPaymentId(paymentId).ifPresent(reserva -> {
                    if ("approved".equals(payment.getStatus())) {
                        reserva.setStatus("CONFIRMADO");
                    } else if ("rejected".equals(payment.getStatus())) {
                        reserva.setStatus("PAGAMENTO_REJEITADO");
                    }
                    reserva.setPaymentStatus(payment.getStatus());
                    reservaRepositorio.save(reserva);
                });
            }
        } catch (MPApiException apiException) {
            System.err.println("Erro na API Mercado Pago: " + apiException.getApiResponse().getContent());
        } catch (MPException e) {
            System.err.println("Falha na comunicação com Mercado Pago: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.err.println("ID de pagamento inválido: " + paymentId);
        }
    }
}