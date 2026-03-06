import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/product';

@Component({
  selector: 'app-details-produits',
  imports: [CommonModule, FormsModule],
  templateUrl: './details-produits.html',
  styleUrl: './details-produits.css',
})
export class DetailsProduits implements OnInit {

  listeProduits: Product[] = [];
  poissons: Product[] = [];
  fruitsdermer: Product[] = [];
  crustaces: Product[] = [];
  modifications: { [id: number]: { stock: number, promo: number } } = {};
  erreurs: { [id: number]: { stock: string, promo: string } } = {};

  constructor(
    public productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProductsFromJson().subscribe({
      next: (res: Product[]) => {
        this.listeProduits = [...res];
        this.poissons = this.listeProduits.filter(p => p.categorie === 'poisson');
        this.fruitsdermer = this.listeProduits.filter(p => p.categorie === 'fruitsdermer');
        this.crustaces = this.listeProduits.filter(p => p.categorie === 'crustace');
        this.listeProduits.forEach(p => {
          this.modifications[p.id] = { stock: 0, promo: p.pourcentagePromotion };
          this.erreurs[p.id] = { stock: '', promo: '' };
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('erreur:', err);
      }
    });
  }

  validerProduit(produit: Product): boolean {
    let valide = true;
    this.erreurs[produit.id] = { stock: '', promo: '' };

    const modif = this.modifications[produit.id];

    if (modif.stock === null || modif.stock === undefined || isNaN(modif.stock)) {
      this.erreurs[produit.id].stock = 'Valeur invalide';
      valide = false;
    } else if (produit.quantiteStock + modif.stock < 0) {
      this.erreurs[produit.id].stock = 'Stock ne peut pas être négatif';
      valide = false;
    }

    if (modif.promo === null || modif.promo === undefined || isNaN(modif.promo)) {
      this.erreurs[produit.id].promo = 'Valeur invalide';
      valide = false;
    } else if (modif.promo < 0 || modif.promo > 100) {
      this.erreurs[produit.id].promo = 'Entre 0 et 100';
      valide = false;
    }

    this.cdr.detectChanges();
    return valide;
  }

  envoyerProduit(produit: Product) {
    if (!this.validerProduit(produit)) return;
    const modif = this.modifications[produit.id];
    produit.quantiteStock += modif.stock;
    produit.pourcentagePromotion = modif.promo;
    modif.stock = 0;
    alert(`Produit ${produit.nom} mis à jour !`);
    this.cdr.detectChanges();
  }

  envoyerTout() {
    let toutValide = true;
    this.listeProduits.forEach(p => {
      if (!this.validerProduit(p)) toutValide = false;
    });
    if (!toutValide) {
      alert('Certains champs sont invalides !');
      return;
    }
    this.listeProduits.forEach(p => this.envoyerProduit(p));
  }
}