import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/products.service';
import { Historique } from '../../core/historique';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  historique: Historique[] = [];
  filtreCategorie: string = 'tous';
  filtrePeriode: string = 'annuel';

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getHistorique();
    setInterval(() => this.getHistorique(), 30000);
  }

  getHistorique() {
    this.productsService.getHistoriqueFromJson().subscribe({
      next: (res: Historique[]) => {
        this.historique = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('erreur:', err)
    });
  }

  getVentes(): Historique[] {
    let ventes = this.historique.filter(h => h.type === 'retrait-par-vente');
    if (this.filtreCategorie !== 'tous') {
      ventes = ventes.filter(h => h.categorie === this.filtreCategorie);
    }
    return ventes;
  }

  getAchats(): Historique[] {
    let achats = this.historique.filter(h => h.type === 'ajout');
    if (this.filtreCategorie !== 'tous') {
      achats = achats.filter(h => h.categorie === this.filtreCategorie);
    }
    return achats;
  }

  getCA(): number {
    const now = new Date();
    return this.getVentes()
      .filter(h => this.filtrerParPeriode(h.date, now))
      .reduce((acc, h) => acc + h.prix * h.quantite, 0);
  }

  getMarge(): number {
    const now = new Date();
    const totalVentes = this.getVentes()
      .filter(h => this.filtrerParPeriode(h.date, now))
      .reduce((acc, h) => acc + h.prix * h.quantite, 0);
    const totalAchats = this.getAchats()
      .filter(h => this.filtrerParPeriode(h.date, now))
      .reduce((acc, h) => acc + h.prix * h.quantite, 0);
    return totalVentes - totalAchats;
  }

  getImpot(): number {
    const marge = this.getMarge();
    return marge > 0 ? marge * 0.3 : 0;
  }

  filtrerParPeriode(date: string, now: Date): boolean {
    const d = new Date(date);
    switch (this.filtrePeriode) {
      case 'annuel': return d.getFullYear() === now.getFullYear();
      case 'trimestriel': return d.getFullYear() === now.getFullYear() &&
        Math.ceil((d.getMonth() + 1) / 3) === Math.ceil((now.getMonth() + 1) / 3);
      case 'mensuel': return d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth();
      case 'semainier':
        const debutSemaine = new Date(now);
        debutSemaine.setDate(now.getDate() - now.getDay());
        const finSemaine = new Date(debutSemaine);
        finSemaine.setDate(debutSemaine.getDate() + 6);
        return d >= debutSemaine && d <= finSemaine;
      default: return true;
    }
  }

  getMargeParTrimestre(): { trimestre: string, marge: number }[] {
    const resultats: { trimestre: string, marge: number }[] = [];
    for (let t = 1; t <= 4; t++) {
      const ventes = this.historique
        .filter(h => h.type === 'retrait-par-vente' &&
          Math.ceil((new Date(h.date).getMonth() + 1) / 3) === t)
        .reduce((acc, h) => acc + h.prix * h.quantite, 0);
      const achats = this.historique
        .filter(h => h.type === 'ajout' &&
          Math.ceil((new Date(h.date).getMonth() + 1) / 3) === t)
        .reduce((acc, h) => acc + h.prix * h.quantite, 0);
      resultats.push({ trimestre: `T${t}`, marge: ventes - achats });
    }
    return resultats;
  }
}