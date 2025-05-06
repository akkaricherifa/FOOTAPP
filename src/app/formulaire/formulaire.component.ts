import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player, Team, Trophy } from '../models/team';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamServiceService } from '../team-service.service';

@Component({
  selector: 'app-formulaire',
  standalone: true,
    imports: [CommonModule, FormsModule,ReactiveFormsModule,],
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.css'
})
export class FormulaireComponent {
    teamId!: string;
    team: Team = {
      _id: '',
      name: '',
      country: '',
      league: '',
      logo: '',
      stadium: '',
      foundedYear: new Date().getFullYear() - 50,
      stadiumCapacity: 30000,
      description: '',
      players: [],
      trophies: [],
      coach: {
        firstName: '',
        lastName: ''
      }
    }; // Cette variable contiendra les détails de l'équipe
    isLoading: boolean = true;  // Pour indiquer que les données sont en cours de chargement
    errorMessage: string = '';
    teamForm!: FormGroup;
    countries: string[] = [
      'France', 'Espagne', 'Angleterre', 'Allemagne', 'Italie', 
      'Portugal', 'Brésil', 'Argentine', 'Pays-Bas', 'Belgique',
      'États-Unis', 'Canada', 'Mexique', 'Japon', 'Corée du Sud'
    ];
     // Liste des positions pour les joueurs
    positions: string[] = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];
  // Pour afficher les messages d'erreurs
    submitted = false;
    successMessage = '';

  // Pour gérer l'état de chargement
    loading = false;

    constructor(
      private route: ActivatedRoute, // Pour récupérer l'ID de l'URL
      private teamService: TeamServiceService, // Le service pour interagir avec le backend
      private router: Router,
      private fb: FormBuilder,
       // Pour gérer la navigation
    ) {}

    ngOnInit(): void {
      this.initReactiveForm();
    
      const id = window.location.pathname.split('/').pop();
      if (id && id !== 'new') {
        this.loadTeam(id);
      } else {
        // Créer une nouvelle équipe vide si on n'est pas en mode édition
        this.team = {
          _id: '',
          name: '',
          country: '',
          league: '',
          logo: '',
          stadium: '',
          foundedYear: new Date().getFullYear() - 50,
          stadiumCapacity: 30000,
          description: '',
          players: [],
          trophies: [],
          coach: {
            firstName: '',
            lastName: ''
          }
        };
    
        // Ajouter un joueur par défaut
        this.addPlayer();
      }
    
      this.initTabTransitions();
    }
    
    
    // Initialiser le formulaire réactif (alternative)
    initReactiveForm(): void {
      this.teamForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
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
    
    // Pour les formulaires réactifs
    get playersFormArray(): FormArray {
      return this.teamForm.get('players') as FormArray;
    }
    
    get trophiesFormArray(): FormArray {
      return this.teamForm.get('trophies') as FormArray;
    }
    
    // Création d'un nouveau FormGroup pour un joueur
    createPlayerFormGroup(): FormGroup {
      return this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        age: [25, [Validators.required, Validators.min(16), Validators.max(50)]],
        position: ['', Validators.required],
        number: [this.team.players.length + 1, [
          Validators.required,
          Validators.min(1),
          Validators.max(99)
        ]],
        nationality: ['', Validators.required],
        image: ['', Validators.required]
      });
    }
    
    // Création d'un nouveau FormGroup pour un trophée
    createTrophyFormGroup(): FormGroup {
      return this.fb.group({
        name: ['', Validators.required],
        year: [new Date().getFullYear(), [
          Validators.required,
          Validators.min(1850),
          Validators.max(new Date().getFullYear())
        ]]
      });
    }
    
    // Charger les données d'une équipe existante (en mode édition)
    loadTeam(id: string): void {
      this.loading = true;
      this.teamService.getTeamById(id).subscribe(
        (teamData) => {
          this.team = teamData;
          this.loading = false;
          
          // Mise à jour du formulaire réactif avec les données chargées
          if (this.teamForm) {
            this.teamForm.patchValue({
              name: this.team.name,
              country: this.team.country,
              league: this.team.league,
              logo: this.team.logo,
              stadium: this.team.stadium,
              foundedYear: this.team.foundedYear,
              stadiumCapacity: this.team.stadiumCapacity,
              description: this.team.description,
              coach: this.team.coach
            });
            
            // Vider et remplir les FormArrays
            this.playersFormArray.clear();
            this.team.players.forEach(player => {
              const playerGroup = this.createPlayerFormGroup();
              playerGroup.patchValue(player);
              this.playersFormArray.push(playerGroup);
            });
            
            this.trophiesFormArray.clear();
            this.team.trophies.forEach(trophy => {
              const trophyGroup = this.createTrophyFormGroup();
              trophyGroup.patchValue(trophy);
              this.trophiesFormArray.push(trophyGroup);
            });
          }
        },
        (error) => {
          console.error('Erreur lors du chargement de l\'équipe:', error);
          this.errorMessage = 'Impossible de charger les détails de l\'équipe';
          this.loading = false;
        }
      );
    }
    
    // Méthode pour initialiser les transitions entre les onglets
    initTabTransitions(): void {
      // Cette méthode serait implémentée si vous utilisez des animations personnalisées
      // Pour la démonstration, nous utilisons les animations Bootstrap
    }
    
    // Méthode pour ajouter un joueur
    addPlayer(): void {
      if (this.teamForm) {
        const playerFormGroup = this.createPlayerFormGroup();
        this.playersFormArray.push(playerFormGroup);
      }
    }
    
    
    // Méthode pour supprimer un joueur
    removePlayer(index: number): void {
      if (this.playersFormArray.length > index) {
        this.playersFormArray.removeAt(index);
      }
    }
    
    // Méthode pour ajouter un trophée
    addTrophy(): void {
      const newTrophy: Trophy = {
        name: '',
        year: new Date().getFullYear()
      };
      this.team.trophies.push(newTrophy);
      
      // Pour le formulaire réactif
      if (this.teamForm) {
        this.trophiesFormArray.push(this.createTrophyFormGroup());
      }
    }
    
    // Méthode pour supprimer un trophée
    removeTrophy(index: number): void {
      // Animation de sortie avant suppression
      const trophyElement = document.querySelectorAll('.trophy-item')[index];
      if (trophyElement) {
        trophyElement.classList.add('animate__fadeOutRight');
        setTimeout(() => {
          this.team.trophies.splice(index, 1);
          
          // Pour le formulaire réactif
          if (this.teamForm) {
            this.trophiesFormArray.removeAt(index);
          }
        }, 300);
      } else {
        this.team.trophies.splice(index, 1);
        
        // Pour le formulaire réactif
        if (this.teamForm) {
          this.trophiesFormArray.removeAt(index);
        }
      }
    }
    
    // Navigation entre les onglets
    nextTab(tabId: string): void {
      const tabEl = document.getElementById(tabId);
      if (tabEl) {
        // Utiliser l'API Bootstrap pour activer l'onglet
        const bsTab = new (window as any).bootstrap.Tab(tabEl);
        bsTab.show();
      }
    }
    
    previousTab(tabId: string): void {
      this.nextTab(tabId); // Même logique que nextTab
    }
    
    // Prévisualisation du logo
    previewLogo(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.team.logo = e.target.result;
          
          // Pour le formulaire réactif
          if (this.teamForm) {
            this.teamForm.patchValue({ logo: e.target.result });
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Validation du formulaire avant soumission
    validateForm(): boolean {
      // Vérification des champs obligatoires
      if (!this.team.name || !this.team.country || !this.team.league || 
          !this.team.stadium || !this.team.logo || 
          !this.team.coach.firstName || !this.team.coach.lastName) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
        return false;
      }
      
      // Vérification des joueurs
      if (this.team.players.length === 0) {
        this.errorMessage = 'Veuillez ajouter au moins un joueur';
        return false;
      }
      
      for (const player of this.team.players) {
        if (!player.firstName || !player.lastName || !player.position || 
            !player.nationality || !player.image) {
          this.errorMessage = 'Veuillez compléter les informations de tous les joueurs';
          return false;
        }
      }
      
      // Vérification des trophées si présents
      for (const trophy of this.team.trophies) {
        if (!trophy.name || !trophy.year) {
          this.errorMessage = 'Veuillez compléter les informations de tous les trophées';
          return false;
        }
      }
      
      return true;
    }
    
    // Soumission du formulaire
    
    onSubmit(): void {
      this.submitted = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.team.players = this.teamForm.value.players;
      this.team.trophies = this.teamForm.value.trophies;

      
      // Validation avant envoi
      if (!this.validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    
      this.loading = true;
    
      // 🔥 Synchroniser les valeurs du formulaire dans this.team 🔥
      this.team = {
        ...this.team,
        ...this.teamForm.value,
        players: this.teamForm.value.players,
        trophies: this.teamForm.value.trophies,
        coach: this.teamForm.value.coach
      };
    
      const isUpdate = !!this.team._id;
    
      if (isUpdate) {
        this.teamService.updateTeam(this.team._id, this.team).subscribe(
          (response) => {
            this.handleSuccess('Équipe mise à jour avec succès!');
          },
          (error) => {
            this.handleError(error, 'Erreur lors de la mise à jour de l\'équipe');
          }
        );
      } else {
        this.teamService.addTeam(this.team).subscribe(
          (response) => {
            this.handleSuccess('Équipe ajoutée avec succès!');
          },
          (error) => {
            this.handleError(error, 'Erreur lors de l\'ajout de l\'équipe');
          }
        );
      }
    }
    
    // Gestion du succès après soumission
    handleSuccess(message: string): void {
      this.loading = false;
      this.successMessage = message;
      
      // Faire défiler jusqu'au message de succès
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirection après un délai
      setTimeout(() => {
        this.router.navigate(['/teams']);
      }, 2000);
    }
    
    // Gestion des erreurs
    handleError(error: any, defaultMessage: string): void {
      this.loading = false;
      console.error(defaultMessage, error);
      
      // Extraire le message d'erreur de la réponse API si disponible
      if (error.error && error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = defaultMessage;
      }
      
      // Faire défiler jusqu'au message d'erreur
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Réinitialiser le formulaire
    resetForm(): void {
      if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les données non enregistrées seront perdues.')) {
        this.submitted = false;
        this.errorMessage = '';
        this.successMessage = '';
        
        // Réinitialisation de l'objet équipe
        this.team = {
          _id: '',
          name: '',
          country: '',
          league: '',
          logo: '',
          stadium: '',
          foundedYear: new Date().getFullYear() - 50,
          stadiumCapacity: 30000,
          description: '',
          players: [],
          trophies: [],
          coach: {
            firstName: '',
            lastName: ''
          }
        };
        
        // Réinitialisation du formulaire réactif
        if (this.teamForm) {
          this.teamForm.reset();
          this.playersFormArray.clear();
          this.trophiesFormArray.clear();
        }
        
        // Ajouter un joueur par défaut
        this.addPlayer();
        
        // Revenir au premier onglet
        this.nextTab('info-tab');
      }
    }
    
    // Gestion de la sortie/abandon du formulaire
    canDeactivate(): boolean | Promise<boolean> {
      // Si le formulaire a été modifié
      const formDirty = this.teamForm ? this.teamForm.dirty : 
                        (this.team.name || this.team.players.length > 0);
      
      if (formDirty && !this.submitted) {
        return confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter?');
      }
      return true;
    }
  }



