package com.whells.repository;

import com.whells.model.Usuario;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepositorio {
    private final List<Usuario> usuarios = new ArrayList<>();

    public Optional<Usuario> findById(Integer matricula) {
        return usuarios.stream()
                .filter(u -> u.getMatricula() != null && u.getMatricula().equals(matricula))
                .findFirst();
    }

    public List<Usuario> findAll() {
        return new ArrayList<>(usuarios);
    }

    public Usuario save(Usuario usuario) {
        if (usuario.getMatricula() == null) {
            throw new IllegalArgumentException("Matrícula não pode ser nula");
        }

        usuarios.removeIf(u -> u.getMatricula().equals(usuario.getMatricula()));
        usuarios.add(usuario);
        return usuario;
    }

    public void deleteById(Integer matricula) {
        usuarios.removeIf(u -> u.getMatricula() != null && u.getMatricula().equals(matricula));
    }

    public boolean existsById(Integer matricula) {
        return usuarios.stream()
                .anyMatch(u -> u.getMatricula() != null && u.getMatricula().equals(matricula));
    }
}