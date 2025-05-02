import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../models/team';
import { Coach } from '../models/coach';
import { Player } from '../models/player';
import { Match } from '../models/match';
import { TeamServiceService } from '../team-service.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  teamId: number = 0;
  team: Team | null = null;
  coach: Coach | null = null;
  players: Player[] = [];
  keyPlayers: Player[] = [];
  recentMatches: Match[] = [];
  activeTab: string = 'aperçu';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamServiceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId = +params['id']; // Convertir l'ID en nombre
      this.loadTeamDetails();
    });
  }

  loadTeamDetails(): void {
    this.loading = true;
    
    // Charger les informations de l'équipe
    this.teamService.getTeamById(this.teamId).subscribe({
      next: (team) => {
        this.team = team;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de l\'équipe.';
        this.loading = false;
        console.error('Erreur lors du chargement des détails de l\'équipe:', err);
      }
    });

    // Charger l'entraîneur
    this.teamService.getTeamCoach(this.teamId).subscribe({
      next: (coach) => {
        this.coach = coach;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'entraîneur:', err);
      }
    });

    // Charger les joueurs
    this.teamService.getTeamPlayers(this.teamId).subscribe({
      next: (players) => {
        this.players = players;
        // Filtrer les joueurs clés (par exemple, les joueurs avec les meilleures statistiques)
        this.keyPlayers = this.players
          .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
          .slice(0, 4); // Prendre les 4 meilleurs joueurs
      },
      error: (err) => {
        console.error('Erreur lors du chargement des joueurs:', err);
      }
    });

    // Charger les matchs récents
    this.teamService.getTeamMatches(this.teamId).subscribe({
      next: (matches) => {
        this.recentMatches = matches
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5); // Prendre les 5 derniers matchs
      },
      error: (err) => {
        console.error('Erreur lors du chargement des matchs:', err);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }
}


