package com.whells.dto;

import java.util.Date;

public class ReservaDTO {
    private Integer usuarioId;
    private Integer bicicletaId;
    private Date dataInicio;
    private Date dataFim;

    // Getters e Setters
    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Integer getBicicletaId() {
        return bicicletaId;
    }

    public void setBicicletaId(Integer bicicletaId) {
        this.bicicletaId = bicicletaId;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }
}