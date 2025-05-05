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
  
  private apiUrl = 'http://localhost:3000/team/api';


  constructor(private http: HttpClient) { }

  // Récupérer toutes les équipes
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/get`)
      .pipe(
        catchError(this.handleError<Team[]>('getTeams', []))
      );
  }
  

  // Récupérer une équipe par son ID
  getTeamById(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/get/${teamId}`)
      .pipe(
        catchError(this.handleError<Team>('getTeamById'))
      );
  }
  

 //  Ajouter une nouvelle équipe
 addTeam(teamData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/post`, teamData)
    .pipe(
      catchError(this.handleError<any>('addTeam'))
    );
}
   // Mettre à jour une équipe
   updateTeam(teamId: string, teamData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/put/${teamId}`, teamData)
      .pipe(
        catchError(this.handleError<any>('updateTeam'))
      );
  }

  // Supprimer une équipe
  deleteTeam(teamId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${teamId}`)
      .pipe(
        catchError(this.handleError<any>('deleteTeam'))
      );
  }

  // Récupérer l'entraîneur d'une équipe
  
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} a échoué: ${error.message}`);
      return of(result as T);
    };
  }
}