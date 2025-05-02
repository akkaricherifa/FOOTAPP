import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Team } from './models/team';
import { Coach } from './models/coach';
import { Player } from './models/player';
import { Match } from './models/match';

@Injectable({
  providedIn: 'root'
})

export class TeamServiceService {

  private apiUrl = 'assets/data'; // Pour le développement avec des données mockées
  // En production, utilisez votre API réelle, par exemple:
  // private apiUrl = 'https://api.example.com/football';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les équipes
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams.json`).pipe(
      catchError(this.handleError<Team[]>('getTeams', []))
    );
  }

  // Récupérer une équipe par son ID
  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams.json`).pipe(
      map(teams => teams.find(team => team.id === id) as Team),
      catchError(this.handleError<Team>(`getTeamById id=${id}`))
    );
  }

  // Récupérer l'entraîneur d'une équipe
  getTeamCoach(teamId: number): Observable<Coach> {
    return this.http.get<Coach[]>(`${this.apiUrl}/coaches.json`).pipe(
      map(coaches => coaches.find(coach => coach.teamId === teamId) as Coach),
      catchError(this.handleError<Coach>(`getTeamCoach teamId=${teamId}`))
    );
  }

  // Récupérer les joueurs d'une équipe
  getTeamPlayers(teamId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players.json`).pipe(
      map(players => players.filter(player => player.teamId === teamId)),
      catchError(this.handleError<Player[]>(`getTeamPlayers teamId=${teamId}`, []))
    );
  }

  // Récupérer les matchs d'une équipe
  getTeamMatches(teamId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches.json`).pipe(
      map(matches => matches.filter(match => 
        match.homeTeamId === teamId || match.awayTeamId === teamId
      )),
      catchError(this.handleError<Match[]>(`getTeamMatches teamId=${teamId}`, []))
    );
  }

  /**
   * Gestion des erreurs HTTP
   * @param operation - nom de l'opération qui a échoué
   * @param result - valeur optionnelle à retourner comme observable de résultat
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} a échoué: ${error.message}`);
      
      // Enregistrer l'erreur dans un service de journalisation
      // this.logService.error(`${operation} failed: ${error.message}`);
      
      // Retourner un résultat vide pour que l'application continue de fonctionner
      return of(result as T);
    };
  }
}