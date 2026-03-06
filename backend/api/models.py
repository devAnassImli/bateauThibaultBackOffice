from django.db import models

class Produit(models.Model):
    CATEGORIE_CHOICES = [
        ('poisson', 'Poisson'),
        ('fruitsdermer', 'Fruits de Mer'),
        ('crustace', 'Crustacé'),
    ]
    nom = models.CharField(max_length=100)
    prix = models.FloatField()
    prix_promotion = models.FloatField(default=0)
    pourcentage_promotion = models.FloatField(default=0)
    quantite_stock = models.IntegerField(default=0)
    nombre_vendus = models.IntegerField(default=0)
    commentaires = models.CharField(max_length=255, blank=True)
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES)
    en_promotion = models.BooleanField(default=False)

    def __str__(self):
        return self.nom


class Historique(models.Model):
    TYPE_CHOICES = [
        ('ajout', 'Ajout'),
        ('retrait-par-vente', 'Retrait par vente'),
        ('retrait-par-invendus', 'Retrait par invendus'),
    ]
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    quantite = models.IntegerField()
    prix = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return f"{self.type} - {self.produit.nom} - {self.date}"