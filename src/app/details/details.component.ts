import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../models/team';
import { Coach } from '../models/coach';
import { Player } from '../models/player';
import { Match } from '../models/match';
import { TeamServiceService } from '../team-service.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  teamId!: string;
  team: Team | undefined; // Cette variable contiendra les détails de l'équipe
  isLoading: boolean = true;  // Pour indiquer que les données sont en cours de chargement
  errorMessage: string = '';

 

  constructor(
    private route: ActivatedRoute, // Pour récupérer l'ID de l'URL
    private teamService: TeamServiceService, // Le service pour interagir avec le backend
    private location: Location // Pour gérer la navigation
  ) {}

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');  // Récupère l'ID depuis la route
    if (teamId) {
      this.teamService.getTeamById(teamId).subscribe(
        (team) => {
          this.team = team;
        },
        (error) => {
          console.error('Erreur de récupération des détails de l\'équipe', error);
        }
      );
    } else {
      console.error('ID de l\'équipe manquant');
    }
  }

  // Méthode pour obtenir les détails d'une équipe
  getTeamDetails(teamId: string): void {
    this.teamService.getTeamById(teamId).subscribe({
      next: (data: Team) => {
        this.team = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails de l\'équipe';
        this.isLoading = false;
      }
    });
  }

  
  // Méthode pour supprimer une équipe
  deleteTeam(): void {
    if (confirm('Voulez-vous vraiment supprimer cette équipe ?')) {
      this.teamService.deleteTeam(this.teamId).subscribe({
        next: () => {
          alert('L\'équipe a été supprimée');
          this.location.back(); // Revenir à la page précédente
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'équipe';
          console.error('Erreur:', err);
        },
      });
    }
  }

  // Méthode pour revenir à la page précédente
  goBack(): void {
    this.location.back();
  }
}


    

