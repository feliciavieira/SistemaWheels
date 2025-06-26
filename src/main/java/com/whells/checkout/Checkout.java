package com.whells.checkout;

import com.whells.model.Reserva;
import com.whells.repository.ReservaRepositorio;
import com.whells.checkout.MercadoPagoService;
import org.springframework.stereotype.Service;

@Service
public class Checkout {
    private final MercadoPagoService mercadoPagoService;
    private final ReservaRepositorio reservaRepositorio;

    public Checkout(MercadoPagoService mercadoPagoService, ReservaRepositorio reservaRepositorio) {
        this.mercadoPagoService = mercadoPagoService;
        this.reservaRepositorio = reservaRepositorio;
    }

    public String processarCheckout(Integer reservaId) {
        Reserva reserva = reservaRepositorio.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (!"PENDENTE_PAGAMENTO".equals(reserva.getStatus())) {
            throw new IllegalStateException("Reserva não está aguardando pagamento. Status atual: " + reserva.getStatus());
        }

        if (reserva.getValorTotal() == null || reserva.getValorTotal() <= 0) {
            throw new IllegalStateException("Valor total da reserva inválido");
        }

        String urlPagamento = mercadoPagoService.criarPagamento(reserva);
        reserva.setStatus("AGUARDANDO_PAGAMENTO");
        reservaRepositorio.save(reserva);

        return urlPagamento;
    }
}