export interface Product {
  id: number;
  nom: string;
  prix: number;
  prixPromotion: number;
  pourcentagePromotion: number;
  quantiteStock: number;
  nombreVendus: number;
  commentaires: string;
  categorie: string;
  enPromotion: boolean;
}