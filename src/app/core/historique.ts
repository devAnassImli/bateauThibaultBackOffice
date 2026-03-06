export interface Historique {
  id: number;
  produitId: number;
  nom: string;
  categorie: string;
  type: 'ajout' | 'retrait-par-vente' | 'retrait-par-invendus';
  quantite: number;
  prix: number;
  date: string;
}