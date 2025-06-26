// ReservaRepositorio.java
package com.whells.repository;

import com.whells.model.Reserva;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class ReservaRepositorio {
    private final List<Reserva> reservas = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    public List<Reserva> findAll() {
        return new ArrayList<>(reservas);
    }

    public Optional<Reserva> findById(int id) {
        return reservas.stream().filter(r -> r.getId() == id).findFirst();
    }

    public boolean existsById(int id) {
        return reservas.stream().anyMatch(r -> r.getId() == id);
    }

    public Reserva save(Reserva reserva) {
        if (reserva.getId() == null) {
            reserva.setId(idGenerator.getAndIncrement());
            reservas.add(reserva);
        } else {
            reservas.removeIf(r -> r.getId() == reserva.getId());
            reservas.add(reserva);
        }
        return reserva;
    }

    public void deleteById(int id) {
        reservas.removeIf(r -> r.getId() == id);
    }

    public List<Reserva> findByUsuarioMatricula(int matricula) {
        return reservas.stream()
                .filter(r -> r.getUsuario() != null && r.getUsuario().getMatricula() == matricula)
                .collect(Collectors.toList());
    }

    public List<Reserva> findByBicicletaId(int bikeId) {
        return reservas.stream()
                .filter(r -> r.getBicicleta() != null && r.getBicicleta().getId() == bikeId)
                .collect(Collectors.toList());
    }

    public Optional<Reserva> findByPaymentId(String paymentId) {
        return reservas.stream()
                .filter(r -> paymentId != null && paymentId.equals(r.getPaymentId()))
                .findFirst();
    }
}