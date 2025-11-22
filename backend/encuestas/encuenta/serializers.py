from rest_framework import serializers
from .models import Pregunta


class PreguntaSerializer(serializers.ModelSerializer):


	class Meta:
		model = Pregunta
		fields = [
			'id',
			'codigo',
			'usuario',
			'empresa',
			'pregunta',
			'respuesta',
			'comentario',
			'categoria',
			'fecha',
			'hora',
			'estado',
			'created_at',
			'updated_at',
		]
		read_only_fields = ['id', 'codigo', 'created_at', 'updated_at']

