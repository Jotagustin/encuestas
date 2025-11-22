from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import PreguntaSerializer
from .models import Pregunta

class PreguntaGetPost(APIView):
    def get(self, request):
        pre = Pregunta.objects.all()
        ser = PreguntaSerializer(pre, many=True)
        return Response(ser.data)
    
    def post(self, request):
        ser = PreguntaSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class PreguntaGetPutDelete(APIView):
    
    def get(self, request, id):
        try:
            pre = Pregunta.objects.get(id=id)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        ser = PreguntaSerializer(pre)
        return Response(ser.data)
    
    def put(self, request, id):
        try:
            pre = Pregunta.objects.get(id=id)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PreguntaUpdate(APIView):
    def put(self, request, pk):
        try:
            pregunta = Pregunta.objects.get(pk=pk)
        except Pregunta.DoesNotExist:
            return Response({"error": "Pregunta no encontrada"}, status=404)

        # Obtener el texto de respuesta desde React
        respuesta_texto = request.data.get("respuesta", "")

        # Guardar la respuesta
        pregunta.respuesta = respuesta_texto
        pregunta.save()

        # Serializar para devolver a React
        serializer = PreguntaSerializer(pregunta)
        return Response(serializer.data, status=200)



def index(request):
    return render(request, 'index.html')