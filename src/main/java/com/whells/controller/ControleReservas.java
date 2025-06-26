// ControleReservas.java
package com.whells.controller;

import com.whells.model.Bicicleta;
import com.whells.model.Reserva;
import com.whells.repository.BicicletaRepositorio;
import com.whells.repository.ReservaRepositorio;
import com.whells.repository.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ControleReservas {
    @Autowired
    private ReservaRepositorio reservaRepositorio;
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private BicicletaRepositorio bicicletaRepositorio;


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable int id) {
        // Alterado para usar findById ao invés de existsById
        if (reservaRepositorio.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        reservaRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{matricula}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable int matricula) {
        // Alterado para usar findById ao invés de existsById
        if (usuarioRepositorio.findById(matricula).isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        List<Reserva> reservas = reservaRepositorio.findByUsuarioMatricula(matricula);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/bicicleta/{bikeId}")
    public ResponseEntity<?> getBookingsByBike(@PathVariable int bikeId) {
        // Alterado para usar findById ao invés de existsById
        if (bicicletaRepositorio.findById(bikeId).isEmpty()) {
            return ResponseEntity.badRequest().body("Bicicleta não encontrada");
        }
        List<Reserva> reservas = reservaRepositorio.findByBicicletaId(bikeId);
        return ResponseEntity.ok(reservas);
    }
}