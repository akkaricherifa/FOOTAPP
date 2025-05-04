import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../models/team';
import { Coach } from '../models/coach';
import { Player } from '../models/player';
import { Match } from '../models/match';
import { TeamServiceService } from '../team-service.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  teamId!: string;
  team: Team | undefined;
  errorMessage: string = ''; // Pour afficher les erreurs éventuelles

  constructor(
    private route: ActivatedRoute, // Pour récupérer l'ID de l'URL
    private teamService: TeamServiceService, // Le service pour interagir avec le backend
    private location: Location // Pour gérer la navigation
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'équipe à partir de l'URL
    this.route.paramMap.subscribe(params => {
      this.teamId = params.get('id')!;
      this.getTeamDetails();
    });
  }

  // Méthode pour obtenir les détails d'une équipe
  getTeamDetails(): void {
    this.teamService.getTeamById(this.teamId).subscribe({
      next: (data) => {
        this.team = data; // Assigner les données de l'équipe
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails de l\'équipe';
        console.error('Erreur:', err);
      },
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


    

