// formulaire.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    this.addTrophy(); 
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
      Validators.pattern('[a-zA-Z ]*')
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('[a-zA-Z ]*')
    ]],
    position: ['', Validators.required],
    nationality: ['', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*')
    ]],
    image: ['', [
      Validators.required,
      Validators.pattern('https?://.+\.(jpg|jpeg|png|gif)')
    ]],
    // ... autres champs
  });
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



  private markAllAsTouched(control: AbstractControl): void {
    control.markAsTouched();
    
    if (control instanceof FormGroup || control instanceof FormArray) {
        Object.values(control.controls).forEach(childControl => {
            this.markAllAsTouched(childControl);
        });
    }
}
onSubmit(): void {
  this.markAllAsTouched(this.teamForm);
  
  if (this.teamForm.invalid) {
    this.showFieldErrors();
    return;
  }
  // ... reste de la soumission
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
    if (this.currentTab === 'info-tab') {
      const infoControls = ['name', 'country', 'league', 'foundedYear', 'stadium', 'stadiumCapacity', 'logo'];
      let isValid = true;
      
      infoControls.forEach(control => {
        if (this.teamForm.get(control)?.invalid) {
          this.teamForm.get(control)?.markAsTouched();
          isValid = false;
        }
      });
      
      if (!isValid) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
        return false;
      }
    }
    return true;
  }
}