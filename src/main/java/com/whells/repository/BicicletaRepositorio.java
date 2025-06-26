package com.whells.repository;

import com.whells.model.Bicicleta;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class BicicletaRepositorio {
    private final List<Bicicleta> bicicletas = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    public Optional<Bicicleta> findById(int id) {
        return bicicletas.stream().filter(b -> b.getId() == id).findFirst();
    }

    public List<Bicicleta> findAll() {
        return new ArrayList<>(bicicletas);
    }

    public Bicicleta save(Bicicleta bike) {
        if (bike.getId() == null) {
            bike.setId(idGenerator.getAndIncrement());
            bicicletas.add(bike);
        } else {
            bicicletas.removeIf(b -> b.getId() == bike.getId());
            bicicletas.add(bike);
        }
        return bike;
    }

    public void deleteById(int id) {
        bicicletas.removeIf(b -> b.getId() == id);
    }

    public boolean existsById(int id) {
        return bicicletas.stream().anyMatch(b -> b.getId() == id);
    }
}