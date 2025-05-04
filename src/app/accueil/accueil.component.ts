import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamServiceService } from '../team-service.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  teams: Team[] = []; // Pour stocker les équipes récupérées
  filteredTeams: Team[] = []; // Pour stocker les équipes filtrées en fonction de la recherche
  searchQuery: string = ''; // Variable pour la recherche


  constructor(private router: Router, 
    private teamService: TeamServiceService
  ) { }

  ngOnInit(): void {
    this.getTeams(); // Appeler la méthode pour récupérer les équipes au chargement du composant
  }

  getTeams(): void {
    this.teamService.getTeams().subscribe(
      (teams) => {
        this.teams = teams; // Assigner les équipes récupérées à la variable
        this.filteredTeams = teams; // Initialiser filteredTeams avec toutes les équipes
      },
      (error) => {
        console.error('Erreur lors de la récupération des équipes:', error);
      }
    );
  }

  navigateToTeamDetails(teamId: string): void {
    this.router.navigate(['/team', teamId]);
  }

 searchTeams(): void {
    if (this.searchQuery) {
      this.filteredTeams = this.teams.filter(team =>
        team.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        team.country.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredTeams = this.teams;
    }
  }
}


