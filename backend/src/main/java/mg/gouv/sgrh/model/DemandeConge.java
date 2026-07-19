package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

@Entity
@Table(name = "demandes_conges")
@Data
public class DemandeConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_conge;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "id_type_conge")
    private TypeConge typeConge;

    private LocalDate date_debut;
    private LocalDate date_fin;

    @ManyToOne
    @JoinColumn(name = "id_statut_conge")
    private ValeurReference statutConge;
    @JsonProperty("id_agent") public Long getAgentId(){return agent==null?null:agent.getId_agent();}
    @JsonProperty("id_agent") public void setAgentId(Long id){if(id==null){agent=null;}else{Agent v=new Agent();v.setId_agent(id);agent=v;}}
    @JsonProperty("id_type_conge") public Long getTypeId(){return typeConge==null?null:typeConge.getId_type_conge();}
    @JsonProperty("id_type_conge") public void setTypeId(Long id){if(id==null){typeConge=null;}else{TypeConge v=new TypeConge();v.setId_type_conge(id);typeConge=v;}}
    @JsonProperty("id_statut_conge") public Long getStatutId(){return statutConge==null?null:statutConge.getId_valeur_reference();}
    @JsonProperty("id_statut_conge") public void setStatutId(Long id){if(id==null){statutConge=null;}else{ValeurReference v=new ValeurReference();v.setId_valeur_reference(id);statutConge=v;}}
}
