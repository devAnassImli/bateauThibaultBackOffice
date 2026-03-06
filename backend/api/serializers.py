from rest_framework import serializers
from .models import Produit, Historique

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = '__all__'

class HistoriqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historique
        fields = '__all__'