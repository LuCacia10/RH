package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

@Entity
@Table(name = "agents")
@Data
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_agent;

    @Column(unique = true, nullable = false, length = 50)
    private String matricule;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 100)
    private String prenom;

    private LocalDate date_naissance;

    @Column(length = 150)
    private String lieu_naissance;

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Column(length = 30)
    private String telephone;

    @Column(length = 150)
    private String email;

    @ManyToOne
    @JoinColumn(name = "id_sexe")
    private ValeurReference sexe;

    @ManyToOne
    @JoinColumn(name = "id_statut_agent")
    private ValeurReference statutAgent;

    private LocalDate date_recrutement;

    @ManyToOne
    @JoinColumn(name = "id_grade")
    private Grade grade;
    @JsonProperty("id_sexe") public Long getSexeId(){return sexe==null?null:sexe.getId_valeur_reference();}
    @JsonProperty("id_sexe") public void setSexeId(Long id){if(id==null){sexe=null;}else{ValeurReference v=new ValeurReference();v.setId_valeur_reference(id);sexe=v;}}
    @JsonProperty("id_statut_agent") public Long getStatutId(){return statutAgent==null?null:statutAgent.getId_valeur_reference();}
    @JsonProperty("id_statut_agent") public void setStatutId(Long id){if(id==null){statutAgent=null;}else{ValeurReference v=new ValeurReference();v.setId_valeur_reference(id);statutAgent=v;}}
    @JsonProperty("id_grade") public Long getGradeId(){return grade==null?null:grade.getId_grade();}
    @JsonProperty("id_grade") public void setGradeId(Long id){if(id==null){grade=null;}else{Grade v=new Grade();v.setId_grade(id);grade=v;}}
}
