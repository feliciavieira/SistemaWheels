package com.whells.controller;

import com.whells.model.Bicicleta;
import com.whells.repository.BicicletaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class ControleBicicletas {
    @Autowired
    private BicicletaRepositorio bicicletaRepositorio;

    @GetMapping
    public List<Bicicleta> getAllBikes() {
        return bicicletaRepositorio.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bicicleta> getBikeById(@PathVariable int id) {
        return bicicletaRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBike(@RequestBody Bicicleta bike) {
        try {
            if (bike.getModelo() == null || bike.getModelo().isBlank()) {
                return ResponseEntity.badRequest().body("O modelo da Bicicleta é obrigatório");
            }
            bike.setDisponivel(true); // Nova bicicleta sempre começa disponível
            Bicicleta savedBike = bicicletaRepositorio.save(bike);
            return ResponseEntity.ok(savedBike);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao criar a Bicicleta: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBike(@PathVariable int id, @RequestBody Bicicleta bikeDetails) {
        try {
            if (!bicicletaRepositorio.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            bikeDetails.setId(id);
            Bicicleta updatedBike = bicicletaRepositorio.save(bikeDetails);
            return ResponseEntity.ok(updatedBike);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar a Bicicleta: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBike(@PathVariable int id) {
        if (!bicicletaRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bicicletaRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}