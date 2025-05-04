import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  teams: Team[] = [
    {
      id: 1,
      name: 'Etoile Sportive du Sahel',
      country: 'Tunisie',
      logo: 'assets/images/teams/etoile.png',
      trophies: [
        { name: 'LDC', count: 10 },
        { name: 'Liga', count: 0 }
      ]
    },
    {
      id: 1,
      name: 'Real Madrid',
      country: 'Espagne',
      logo: 'assets/images/teams/real.png',
      trophies: [
        { name: 'LDC', count: 14 },
        { name: 'Liga', count: 35 }
      ]
    },
    {
      id: 2,
      name: 'FC Barcelona',
      country: 'Espagne',
      logo: 'assets/images/teams/barcelone.png',
      trophies: [
        { name: 'LDC', count: 5 },
        { name: 'Liga', count: 26 }
      ]
    },
    {
      id: 3,
      name: 'Manchester United',
      country: 'Angleterre',
      logo: 'assets/images/teams/mu.png',
      trophies: [
        { name: 'LDC', count: 3 },
        { name: 'Premier League', count: 20 }
      ]
    },
    {
      id: 4,
      name: 'Bayern Munich',
      country: 'Allemagne',
      logo: 'assets/images/teams/bayern.png',
      trophies: [
        { name: 'LDC', count: 6 },
        { name: 'Bundesliga', count: 32 }
      ]
    },
    {
      id: 5,
      name: 'Liverpool FC',
      country: 'Angleterre',
      logo: 'assets/images/teams/liverpool.png',
      trophies: [
        { name: 'LDC', count: 6 },
        { name: 'Premier League', count: 19 }
      ]
    },
    {
      id: 6,
      name: 'Paris Saint-Germain',
      country: 'France',
      logo: 'assets/images/teams/psg.png',
      trophies: [
        { name: 'LDC', count: 0 },
        { name: 'Ligue 1', count: 11 }
      ]
    },
    {
      id: 7,
      name: 'Manchester City',
      country: 'Angleterre',
      logo: 'assets/images/teams/manchester.png',
      trophies: [
        { name: 'LDC', count: 1 },
        { name: 'Premier League', count: 9 }
      ]
    },
    {
      id: 8,
      name: 'Juventus FC',
      country: 'Italie',
      logo: 'assets/images/teams/juv.png',
      trophies: [
        { name: 'LDC', count: 2 },
        { name: 'Serie A', count: 36 }
      ]
    }
  ];

  filteredTeams: Team[] = [];
  searchQuery: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredTeams = [...this.teams];
  }

  navigateToTeamDetails(teamId: string): void {
    this.router.navigate(['/team', teamId]);
  }

  searchTeams(): void {
    if (!this.searchQuery.trim()) {
      this.filteredTeams = [...this.teams];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredTeams = this.teams.filter(team => 
      team.name.toLowerCase().includes(query) || 
      team.country.toLowerCase().includes(query)
    );
  }
}


