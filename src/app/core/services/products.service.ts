import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../product';
import { Historique } from '../historique';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProductsFromJson() {
    return this.http.get<Product[]>('assets/data/products.json');
  }

  getHistoriqueFromJson() {
    return this.http.get<Historique[]>('assets/data/historique.json');
  }
}