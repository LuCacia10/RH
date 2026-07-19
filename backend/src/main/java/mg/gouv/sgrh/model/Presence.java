package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "presences")
@Data
public class Presence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_presence;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    private LocalDate date_presence;
    private LocalTime heure_arrivee;
    private LocalTime heure_depart;

    @ManyToOne
    @JoinColumn(name = "id_statut_presence")
    private ValeurReference statutPresence;
    @JsonProperty("id_agent") public Long getAgentId(){return agent==null?null:agent.getId_agent();}
    @JsonProperty("id_agent") public void setAgentId(Long id){if(id==null){agent=null;}else{Agent v=new Agent();v.setId_agent(id);agent=v;}}
    @JsonProperty("id_statut_presence") public Long getStatutId(){return statutPresence==null?null:statutPresence.getId_valeur_reference();}
    @JsonProperty("id_statut_presence") public void setStatutId(Long id){if(id==null){statutPresence=null;}else{ValeurReference v=new ValeurReference();v.setId_valeur_reference(id);statutPresence=v;}}
}
