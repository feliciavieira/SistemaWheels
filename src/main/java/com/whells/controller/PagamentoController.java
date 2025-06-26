// PagamentoController.java
package com.whells.controller;

import com.whells.checkout.Checkout;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {
    private final Checkout checkout;

    public PagamentoController(Checkout checkout) {
        this.checkout = checkout;
    }

    @PostMapping("/{reservaId}")
    public ResponseEntity<?> criarPagamento(@PathVariable Integer reservaId) {
        try {
            String urlPagamento = checkout.processarCheckout(reservaId);
            Map<String, String> response = new HashMap<>();
            response.put("payment_url", urlPagamento);
            response.put("reserva_id", reservaId.toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "reserva_id", reservaId.toString()
            ));
        }
    }
}