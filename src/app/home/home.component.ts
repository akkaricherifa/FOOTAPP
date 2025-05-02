import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamServiceService } from '../team-service.service';
import { Team } from '../models/team';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  teams: Team[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private teamService: TeamServiceService
  ) { }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des équipes. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur lors du chargement des équipes:', err);
      }
    });
  }

  navigateToTeam(teamId: number): void {
    this.router.navigate(['/team', teamId]);
  }


  goToTeam(id: number) {
    this.router.navigate(['/team', id]);
  }
}
