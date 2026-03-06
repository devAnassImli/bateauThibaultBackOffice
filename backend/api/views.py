from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Produit, Historique
from .serializers import ProduitSerializer, HistoriqueSerializer

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def modifier_stock(self, request, pk=None):
        produit = self.get_object()
        quantite = request.data.get('quantite', 0)
        type_operation = request.data.get('type', 'retrait-par-vente')
        prix = request.data.get('prix', 0)

        produit.quantite_stock += int(quantite)
        produit.save()

        Historique.objects.create(
            produit=produit,
            type=type_operation,
            quantite=quantite,
            prix=prix,
            date=request.data.get('date')
        )
        return Response(ProduitSerializer(produit).data)

class HistoriqueViewSet(viewsets.ModelViewSet):
    queryset = Historique.objects.all()
    serializer_class = HistoriqueSerializer
    permission_classes = [IsAuthenticated]