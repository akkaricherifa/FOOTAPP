// formulaire.component.ts
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamServiceService } from '../team-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulaire',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent {
  teamForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;
  team: any = { Tab: 0 };  // <-- initialisation directe
  currentTab: string = 'general-tab';

  countries = [
    'France', 'Espagne', 'Angleterre', 'Allemagne', 'Italie', 
    'Portugal', 'Brésil', 'Argentine', 'Pays-Bas', 'Belgique'
  ];

  positions = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.loadTeam(id);
    } else {
      this.addPlayer(); // Ajouter un joueur par défaut pour les nouvelles équipes
    }

    if (!this.team) {
      this.team = { Tab: 0 };
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      country: ['', Validators.required],
      league: ['', Validators.required],
      logo: ['', Validators.required],
      stadium: ['', Validators.required],
      foundedYear: [new Date().getFullYear() - 50, [
        Validators.required,
        Validators.min(1850),
        Validators.max(new Date().getFullYear())
      ]],
      stadiumCapacity: [30000, [
        Validators.required,
        Validators.min(1000)
      ]],
      description: [''],
      coach: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]
      }),
      players: this.fb.array([]),
      trophies: this.fb.array([])
    });
  }

  get players(): FormArray {
    return this.teamForm.get('players') as FormArray;
  }

  get trophies(): FormArray {
    return this.teamForm.get('trophies') as FormArray;
  }

  createPlayer(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [25, [Validators.required, Validators.min(16), Validators.max(50)]],
      position: ['', Validators.required],
      number: [this.players.length + 1, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]],
      nationality: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  createTrophy(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      year: [new Date().getFullYear(), [
        Validators.required,
        Validators.min(1850),
        Validators.max(new Date().getFullYear())
      ]]
    });
  }

  addPlayer(): void {
    this.players.push(this.createPlayer());
  }

  removePlayer(index: number): void {
    this.players.removeAt(index);
  }

  addTrophy(): void {
    this.trophies.push(this.createTrophy());
  }

  removeTrophy(index: number): void {
    this.trophies.removeAt(index);
  }

  loadTeam(id: string): void {
    this.isLoading = true;
    this.teamService.getTeamById(id).subscribe({
      next: (team) => {
        // Remplir le formulaire avec les données de l'équipe
        this.teamForm.patchValue({
          _id: team._id,
          name: team.name,
          country: team.country,
          league: team.league,
          logo: team.logo,
          stadium: team.stadium,
          foundedYear: team.foundedYear,
          stadiumCapacity: team.stadiumCapacity,
          description: team.description,
          coach: team.coach
        });

        // Vider et remplir les tableaux de joueurs et trophées
        this.players.clear();
        this.trophies.clear();

        team.players.forEach(player => {
          const playerGroup = this.createPlayer();
          playerGroup.patchValue(player);
          this.players.push(playerGroup);
        });

        team.trophies.forEach(trophy => {
          const trophyGroup = this.createTrophy();
          trophyGroup.patchValue(trophy);
          this.trophies.push(trophyGroup);
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement de l\'équipe';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.teamForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.players.length === 0) {
      this.errorMessage = 'Veuillez ajouter au moins un joueur';
      return;
    }

    this.isLoading = true;
    const teamData = this.teamForm.value;

    const observable = teamData._id 
      ? this.teamService.updateTeam(teamData._id, teamData)
      : this.teamService.addTeam(teamData);

    observable.subscribe({
      next: () => {
        this.successMessage = teamData._id 
          ? 'Équipe mise à jour avec succès!' 
          : 'Équipe créée avec succès!';
        this.isLoading = false;
        
        setTimeout(() => {
          this.router.navigate(['/teams']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Une erreur est survenue';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  
  nextTab(tabId: string) {
    console.log("Onglet demandé :", tabId);
    this.currentTab = tabId; // mise à jour de l'onglet courant
  }
  

  previousTab(tabId: string): void {
    this.nextTab(tabId);
  }
}