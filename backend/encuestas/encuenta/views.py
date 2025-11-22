from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import PreguntaSerializer
from .models import Pregunta
from django.shortcuts import render


class PreguntaGetPost(APIView):


    def get(self, request):
        categoria = request.query_params.get('categoria')
        estado = request.query_params.get('estado')
        qs = Pregunta.objects.all().order_by('-created_at')
        if categoria:
            qs = qs.filter(categoria=categoria)
        if estado:
            qs = qs.filter(estado=estado)
        ser = PreguntaSerializer(qs, many=True)
        return Response(ser.data)

    def post(self, request):
        ser = PreguntaSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class PreguntaGetPutDelete(APIView):


    def get(self, request, id):
        try:
            obj = Pregunta.objects.get(id=id)
        except Pregunta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ser = PreguntaSerializer(obj)
        return Response(ser.data)

    def put(self, request, id):
        try:
            obj = Pregunta.objects.get(id=id)
        except Pregunta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        ser = PreguntaSerializer(obj, data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_200_OK)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            obj = Pregunta.objects.get(id=id)
        except Pregunta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_200_OK)


def index(request):
    return render(request, 'index.html')



