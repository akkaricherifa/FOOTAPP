// formulaire.component.ts
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamServiceService } from '../team-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Team } from '../models/team';

@Component({
  selector: 'app-formulaire',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent {
  @ViewChild('tabContent') tabContent!: ElementRef;
   activeTab: string = 'info'; // Gère l'onglet actif

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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.teamForm = this.createForm();
  }

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id && id !== 'new') {
    this.loadTeam(id);
  } else {
    this.addPlayer();
    this.addTrophy();
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

 // Dans createPlayer(), assurez-vous que tous les champs requis sont valides
createPlayer(): FormGroup {
  return this.fb.group({
    firstName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZÀ-ÿ- ]+$/) // Accepte accents et espaces
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZÀ-ÿ- ]+$/)
    ]],
    age: [null, [
      Validators.required,
      Validators.min(16),
      Validators.max(50)
    ]],
    number: [null, [
      Validators.required,
      Validators.min(1),
      Validators.max(99)
    ]],
    position: ['', Validators.required],
    nationality: ['', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZÀ-ÿ- ]+$/)
    ]],
    image: ['', [
      Validators.required,
      Validators.pattern(/https?:\/\/.+\.(jpg|jpeg|png|gif)/i)
    ]]
  });
}



updateFormValidity(): void {
  this.players.controls.forEach(player => {
    player.updateValueAndValidity({ emitEvent: true });
  });
  this.teamForm.updateValueAndValidity();
}






createTrophy(): FormGroup {
  return this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]],
    year: [new Date().getFullYear(), [
      Validators.required,
      Validators.min(1850),
      Validators.max(new Date().getFullYear())
    ]]
  });
}

addPlayer(): void {
  const newPlayer = this.createPlayer();
  this.players.push(newPlayer);
  
  // Force la détection des changements
  setTimeout(() => {
    this.updateFormValidity();
    this.cdr.detectChanges();
  });
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
      next: (team: Team) =>  {
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



  private markAllAsTouched(control: AbstractControl): void {
    control.markAsTouched();
    
    if (control instanceof FormGroup || control instanceof FormArray) {
        Object.values(control.controls).forEach(childControl => {
            this.markAllAsTouched(childControl);
        });
    }
}
onSubmit(): void {
  this.submitted = true;
  this.markAllAsTouched(this.teamForm);
  
  if (this.teamForm.invalid) {
    this.showFieldErrors();
    return;
  }

  this.isLoading = true;
  const teamData = this.teamForm.value;

  if (teamData._id) {
    // Mise à jour d'une équipe existante
    this.teamService.updateTeam(teamData._id, teamData).subscribe({
      next: () => {
        this.successMessage = 'Équipe mise à jour avec succès';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/teams']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour de l\'équipe';
        this.isLoading = false;
        console.error(err);
      }
    });
  } else {
    // Création d'une nouvelle équipe
    this.teamService.addTeam(teamData).subscribe({
      next: () => {
        this.successMessage = 'Équipe créée avec succès';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/teams']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la création de l\'équipe';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}

private showFieldErrors(): void {
  // Joueurs
  this.players.controls.forEach((player, index) => {
    if (player.invalid) {
      const errors = this.getControlErrors(player);
      console.error(`Erreurs joueur ${index + 1}:`, errors);
    }
  });

  // Trophées
  this.trophies.controls.forEach((trophy, index) => {
    if (trophy.invalid) {
      const errors = this.getControlErrors(trophy);
      console.error(`Erreurs trophée ${index + 1}:`, errors);
    }
  });

  this.errorMessage = 'Veuillez corriger les erreurs marquées en rouge';
}

private getControlErrors(control: AbstractControl): any {
  return control instanceof FormGroup 
    ? Object.fromEntries(
        Object.entries(control.controls)
          .filter(([_, c]) => c.invalid)
          .map(([key, c]) => [key, c.errors])
      )
    : control.errors;
}

// Méthode pour marquer tous les contrôles comme "touched"


// Méthode pour récupérer toutes les erreurs
private getFormErrors(formGroup: FormGroup | FormArray): any {
    const errors: any = {};
    
    Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.get(key);
        
        if (control instanceof FormGroup || control instanceof FormArray) {
            errors[key] = this.getFormErrors(control);
        } else if (control?.errors) {
            errors[key] = control.errors;
        }
    });
    
    return Object.keys(errors).length ? errors : null;
}

private getInvalidFields(): string[] {
    const invalid = [];
    const controls = this.teamForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  
  nextTab(tabId: string) {
    if (this.validateCurrentTab()) {
      this.switchTab(tabId);
    }
  }

  previousTab(tabId: string): void {
    this.switchTab(tabId);
  }

  private switchTab(tabId: string): void {
    // Trouver l'élément du tab et le bouton correspondant
    const tabPaneId = tabId.replace('-tab', '');
    const tabPane = document.getElementById(tabPaneId);
    const tabButton = document.getElementById(tabId);
    
    if (tabPane && tabButton) {
      // Retirer les classes actives de tous les onglets
      document.querySelectorAll('.tab-pane').forEach(el => {
        el.classList.remove('active', 'show');
      });
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('active');
      });
      
      // Activer le nouvel onglet
      tabPane.classList.add('active', 'show');
      tabButton.classList.add('active');
      this.currentTab = tabId;
    }
  }

private validateCurrentTab(): boolean {
  let isValid = true;
  this.errorMessage = '';

  switch (this.currentTab) {
    case 'info-tab':
      const infoControls = ['name', 'country', 'league', 'foundedYear', 'stadium', 'stadiumCapacity', 'logo'];
      infoControls.forEach(control => {
        if (this.teamForm.get(control)?.invalid) {
          this.teamForm.get(control)?.markAsTouched();
          isValid = false;
        }
      });
      break;

    case 'players-tab':
      if (this.players.length === 0) {
        this.errorMessage = 'Veuillez ajouter au moins un joueur';
        isValid = false;
      } else {
        this.players.controls.forEach(player => {
          if (player.invalid) {
            this.markAllAsTouched(player);
            isValid = false;
          }
        });
      }
      break;

    case 'trophies-tab':
      // Les trophées sont optionnels donc pas de validation stricte
      this.trophies.controls.forEach(trophy => {
        if (trophy.invalid) {
          this.markAllAsTouched(trophy);
          isValid = false;
        }
      });
      break;

    case 'coach-tab':
      const coachControls = ['firstName', 'lastName'];
      coachControls.forEach(control => {
        if (this.teamForm.get(`coach.${control}`)?.invalid) {
          this.teamForm.get(`coach.${control}`)?.markAsTouched();
          isValid = false;
        }
      });
      break;
  }

  if (!isValid) {
    this.errorMessage = this.errorMessage || 'Veuillez corriger les erreurs avant de continuer';
  }

  return isValid;
}

logFormErrors(): void {
  console.group('Form Errors');
  console.log('Form valid:', this.teamForm.valid);
  console.log('Form errors:', this.teamForm.errors);
  
  console.group('Players Errors');
  this.players.controls.forEach((player, index) => {
    console.log(`Player ${index + 1}:`, {
      valid: player.valid,
      errors: player.errors,
      value: player.value
    });
  });
  console.groupEnd();
  
  console.groupEnd();
}
}