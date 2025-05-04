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
  
  private apiUrl = 'http://localhost:3000/api/teams';



  constructor(private http: HttpClient) { }

  // Récupérer toutes les équipes
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}`)
      .pipe(
        catchError(this.handleError<Team[]>('getTeams', []))
      );
  }

  // Récupérer une équipe par son ID
  getTeamById(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`)
      .pipe(
        catchError(this.handleError<Team>('getTeamById'))
      );
  }

  

 //  Ajouter une nouvelle équipe
  addTeam(teamData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, teamData);
  }

   // Mettre à jour une équipe
   updateTeam(teamId: string, teamData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${teamId}`, teamData);
  }

  // Supprimer une équipe
  deleteTeam(teamId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${teamId}`);
  }

  // Récupérer l'entraîneur d'une équipe
  
  

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