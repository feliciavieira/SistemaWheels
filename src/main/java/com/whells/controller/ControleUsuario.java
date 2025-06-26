package com.whells.controller;

import com.whells.model.Usuario;
import com.whells.repository.UsuarioRepositorio;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class ControleUsuario {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody Usuario usuario) {
        try {
            if (usuario.getMatricula() == null) {
                return ResponseEntity.badRequest().body("Matrícula é obrigatória");
            }

            if (usuarioRepositorio.existsById(usuario.getMatricula())) {
                return ResponseEntity.badRequest().body("Matrícula já cadastrada");
            }

            Usuario savedUser = usuarioRepositorio.save(usuario);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao criar usuário: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Usuario> getAllUsers() {
        return usuarioRepositorio.findAll();
    }

    @GetMapping("/{matricula}")
    public ResponseEntity<Usuario> getUser(@PathVariable Integer matricula) {
        return usuarioRepositorio.findById(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{matricula}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer matricula,
            @Valid @RequestBody Usuario userDetails) {
        try {
            if (!usuarioRepositorio.existsById(matricula)) {
                return ResponseEntity.notFound().build();
            }

            userDetails.setMatricula(matricula);
            Usuario updatedUser = usuarioRepositorio.save(userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    @DeleteMapping("/{matricula}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer matricula) {
        if (!usuarioRepositorio.existsById(matricula)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepositorio.deleteById(matricula);
        return ResponseEntity.noContent().build();
    }
}