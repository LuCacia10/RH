package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@Entity
@Table(name = "bulletins_paie")
@Data
public class BulletinPaie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_bulletin;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    private Integer mois;
    
    @Column(columnDefinition = "YEAR")
    private Integer annee;
    private BigDecimal salaire_base;
    private BigDecimal salaire_net;
    @JsonProperty("id_agent") public Long getAgentId(){return agent==null?null:agent.getId_agent();}
    @JsonProperty("id_agent") public void setAgentId(Long id){if(id==null){agent=null;}else{Agent v=new Agent();v.setId_agent(id);agent=v;}}
}
